import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';

// loads an array of question objects from the game-data.js file
import { QUESTIONS } from '../data/game-data';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function GameScreen({storedName, onEndGame}) {
    const MAXPOINTS = 100; // maximum points available per question
    const PLAYERNAME = storedName;

    const [index, setIndex] = useState(0); // helper to iterate over the QUESTIONS
    const [countdown, setCountdown] = useState(MAXPOINTS); // points for correct answer decrease over time
    const [score, setScore] = useState(0); // current score of the user
    const [isHintVisible, setIsHintVisible] = useState(false); // hint button
    const [isAnswer1Selected, setIsAnswer1Selected] = useState(false);
    const [isAnswer2Selected, setIsAnswer2Selected] = useState(false);
    const [isAnswer3Selected, setIsAnswer3Selected] = useState(false);
    const [isAnswer4Selected, setIsAnswer4Selected] = useState(false);
    const [feedback, setFeedback] = useState({}); // immediate user feedback
    const [isSubmitDisabledAfterPressForMultiselect, setIsSubmitDisabledAfterPressForMultiselect] = useState(false); // if multiselection is wrong --> disable submit button
    const [isSubmitDiabledAfterPressForSortable, setIsSubmitDiabledAfterPressForSortable] = useState(false); // if sort is wrong --> disable submit button

    let playerScore; // place outside functions to re-use variable

    const [sortable1Text, setSortable1Text] = useState(QUESTIONS[index].answers.answer_1);
    const [sortable2Text, setSortable2Text] = useState(QUESTIONS[index].answers.answer_2);
    const [sortable3Text, setSortable3Text] = useState(QUESTIONS[index].answers.answer_3);
    const [sortable4Text, setSortable4Text] = useState(QUESTIONS[index].answers.answer_4);
    let temporarySortableText;

    let isQuestionSortable = QUESTIONS[index].type == 'sortable';

    function submitHandler() { // submit button pressed
        console.log('submitHandler --------------------------- ');

        // check if answer is correct
        if (!isQuestionSortable && isAnswerCorrect()) { // Multiselect & CORRECT answer
            console.log('multiselect && CORRECT answer')
            playerScore = score + countdown;
            setScore(playerScore); // update player score
            setIsHintVisible(false);

            if (index < (QUESTIONS.length - 1)) { // accessing items in an array starts at 0th element (hence -1)
                // deselect all answers
                setIsAnswer1Selected(false);
                setIsAnswer2Selected(false);
                setIsAnswer3Selected(false);
                setIsAnswer4Selected(false);

                let newIndex = index + 1;
                setIndex(newIndex); // renders the next question
                setCountdown(MAXPOINTS); // restart countdown at 100 points
            } else { // game ends
                compareScoreWithHighscore();
            }
        } else if (!isQuestionSortable && !isAnswerCorrect()) {
            console.log('multiselect && WRONG answer')
            setIsSubmitDisabledAfterPressForMultiselect(true);
            setCountdown(Math.ceil(countdown / 100 * 50)); // this prevents decimals in the countdown
        } else if (isQuestionSortable && isSortCorrect()) { // Sortable
            console.log('sortable && CORRECT answer')

            playerScore = score + countdown;
            setScore(playerScore); // update player score
            setIsHintVisible(false);

            if (index < (QUESTIONS.length - 1)) { // accessing items in an array starts at 0th element (hence -1)
                let newIndex = index + 1;
                setIndex(newIndex); // renders the next question
                setCountdown(MAXPOINTS); // restart countdown at 100 points
            } else { // game ends
                compareScoreWithHighscore();
            }

            console.log('sort is correct!!!!!!!!!!!!')
        } else if (isQuestionSortable && !isSortCorrect()) { // WRONG answer
            console.log('sortable && WRONG answer')
            setIsSubmitDiabledAfterPressForSortable(true);
            setCountdown(Math.ceil(countdown / 100 * 50)); // this prevents decimals in the countdown
        }


    };

    function isAnswerCorrect() {
        let isCorrect = false;
        let isAnswer1correct = QUESTIONS[index].correctAnswers.answer_1;
        let isAnswer2correct = QUESTIONS[index].correctAnswers.answer_2;
        let isAnswer3correct = QUESTIONS[index].correctAnswers.answer_3;
        let isAnswer4correct = QUESTIONS[index].correctAnswers.answer_4;

        if ((isAnswer1Selected == isAnswer1correct) // are all correct answers selected?
            && (isAnswer2Selected == isAnswer2correct)
            && (isAnswer3Selected == isAnswer3correct)
            && (isAnswer4Selected == isAnswer4correct)) {
                isCorrect = true; // answer is correct
        }
        console.log('is answer correct? ---> ' + isCorrect);
        return isCorrect;
    }

    function isSortCorrect() {
        let isCorrect = false;

        let correctSortable1Text = QUESTIONS[index].correctOrder.answer_1;
        let correctSortable2Text = QUESTIONS[index].correctOrder.answer_2;
        let correctSortable3Text = QUESTIONS[index].correctOrder.answer_3;
        let correctSortable4Text = QUESTIONS[index].correctOrder.answer_4;

        console.log('isSortCorrect');
        console.log(sortable1Text);
        console.log(correctSortable1Text);
        console.log(sortable2Text);
        console.log(correctSortable2Text);
        console.log(sortable3Text);
        console.log(correctSortable3Text);
        console.log(sortable4Text);
        console.log(correctSortable4Text);

        if ((sortable1Text == correctSortable1Text)
            && (sortable2Text == correctSortable2Text)
            && (sortable3Text == correctSortable3Text)
            && (sortable4Text == correctSortable4Text)) {
            isCorrect = true;
        }
        console.log('is SORT correct? ---> ' + isCorrect);
        return isCorrect;
    }

    const compareScoreWithHighscore = async () => {

        try { // check first place
            let firstScore = await AsyncStorage.getItem('first_score');

            if (firstScore == null) { // no score exists (i.e. app just got installed)
                storeCurrentPlayerAsFirstPlace();
            } else if (firstScore <= playerScore) { // current score is better than first place
                // update highscore entries from direction bottom to top
                moveSecondToThirdPlace();
                moveFirstToSecondPlace();
                storeCurrentPlayerAsFirstPlace();
            } else { // playerScore does not override first place
                try { // check second place
                    let secondScore = await AsyncStorage.getItem('second_score');
        
                    if (secondScore == null) { // no score exists (i.e. app just got installed)
                        storeCurrentPlayerAsSecondPlace();
                    } else if (secondScore <= playerScore) { // current score is better than first place
                        // update highscore entries from direction bottom to top
                        moveSecondToThirdPlace();
                        storeCurrentPlayerAsSecondPlace();
                    } else { // playerScore does not override second place
                        try { // check third place
                            let thirdScore = await AsyncStorage.getItem('third_score');
                
                            if (thirdScore == null) { // no score exists (i.e. app just got installed)
                                storeCurrentPlayerAsThirdPlace();
                            } else if (thirdScore <= playerScore) { // current score is better than first place
                                // update highscore entries from direction bottom to top
                                storeCurrentPlayerAsThirdPlace();
                            } else { // playerScore does not override any place in the leaderboard
                                console.log('playerScore does not override any place in the leaderboard');
                            }
                        } catch (e) {console.log(e);}
                    }
                } catch (e) {console.log(e);}
            }
        } catch (e) {console.log(e);}

        unlockBadges();
        onEndGame(); // gets called AFTER all 'await' async functions and correct data will be displayed on the PlayerScreen!
    };

    const unlockBadges = async () => {
        if (playerScore >= (QUESTIONS.length * MAXPOINTS / 100 * 50)) { // player score on average >= 50%
            let key = PLAYERNAME + "-journalist";

            try {
              await AsyncStorage.setItem(key, "true");
            } catch (e) {console.log(e);}
        }

        if (playerScore >= (QUESTIONS.length * MAXPOINTS / 100 * 70)) { // player score on average >= 70%
            let key = PLAYERNAME + "-researcher";

            try {
              await AsyncStorage.setItem(key, "true");
            } catch (e) {console.log(e);}
        }

        if (playerScore >= (QUESTIONS.length * MAXPOINTS / 100 * 90)) { // player score on average >= 90%
            let key = PLAYERNAME + "-historian";

            try {
              await AsyncStorage.setItem(key, "true");
            } catch (e) {console.log(e);}
        }
    };

    const storeCurrentPlayerAsFirstPlace = async () => {
        try {
          await AsyncStorage.setItem('first_score', playerScore + ''); // append string to cast number to string (necessary for storage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('first_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    const storeCurrentPlayerAsSecondPlace = async () => {
        try {
          await AsyncStorage.setItem('second_score', playerScore + ''); // append string to cast number to string (necessary for storage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('second_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    const storeCurrentPlayerAsThirdPlace = async () => {
        try {
          await AsyncStorage.setItem('third_score', playerScore + ''); // append string to cast number to string (necessary for storage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('third_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    const moveSecondToThirdPlace = async () => {
        let secondScore;
        let secondName;

        try {
            secondScore = await AsyncStorage.getItem('second_score');
        } catch (e) {console.log(e);}
        
        try {
            secondName = await AsyncStorage.getItem('second_name');
        } catch (e) {console.log(e);}
        
        if ((secondScore != null) && (secondName != null)) {
            // set data from second place to third place
            try {
                await AsyncStorage.setItem('third_score', secondScore + ''); // append string to cast number to string (necessary for storage)
            } catch (e) {console.log(e);}
      
            try {
                await AsyncStorage.setItem('third_name', secondName);
            } catch (e) {console.log(e);}
        }
    };

    const moveFirstToSecondPlace = async () => {
        let firstScore;
        let firstName;

        try {
            firstScore = await AsyncStorage.getItem('first_score');
        } catch (e) {console.log(e);}
        
        try {
            firstName = await AsyncStorage.getItem('first_name');
        } catch (e) {console.log(e);}
        
        if ((firstScore != null) && (firstName != null)) {
            // set data from first place to second place
            try {
                await AsyncStorage.setItem('second_score', firstScore + ''); // append string to cast number to string (necessary for storage)
            } catch (e) {console.log(e);}
      
            try {
                await AsyncStorage.setItem('second_name', firstName);
            } catch (e) {console.log(e);}
        }
    };

    let barWidth = countdown; // assign count here to use it within barInnerStyle()
    
    function barInnerStyle() { // style the time-bar dynamically
        let newColor;
        let newBarWidth = barWidth + '%';

        if (barWidth > 90) {
            newColor = 'green';
        } else if (barWidth > 70) {
            newColor = Colors.gold;
        } else if (barWidth > 40) {
            newColor = 'orange';
        } else {
            newColor = 'red';
        }

        return { // return the dynamic style of the time-bar
            backgroundColor: newColor,
            width: newBarWidth
        }
    }

    function hintButtonStyle() { // style the time-bar dynamically
        let color;

        if (isHintVisible) {
            color = Colors.gray400
        } else {
            color = Colors.button100
        }

        return { // return the dynamic style of the time-bar
            backgroundColor: color
        }
    }

    function showHint() {
        setCountdown(Math.ceil(countdown / 100 * 75)); // this prevents decimals in the countdown
        setIsHintVisible(true);
    }

    function pressAnswer1() {
        setIsAnswer1Selected(!isAnswer1Selected);
        setIsSubmitDisabledAfterPressForMultiselect(false);
    }

    function pressAnswer2() {
        setIsAnswer2Selected(!isAnswer2Selected);
        setIsSubmitDisabledAfterPressForMultiselect(false);
    }

    function pressAnswer3() {
        setIsAnswer3Selected(!isAnswer3Selected);
        setIsSubmitDisabledAfterPressForMultiselect(false);
    }

    function pressAnswer4() {
        setIsAnswer4Selected(!isAnswer4Selected);
        setIsSubmitDisabledAfterPressForMultiselect(false);
    }

    function answer1ButtonStyle() { // style the answer button dynamically
        let color;

        if (isAnswer1Selected) {
            color = Colors.gold
        } else {
            color = Colors.primary200
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    function answer2ButtonStyle() { // style the answer button dynamically
        let color;

        if (isAnswer2Selected) {
            color = Colors.gold
        } else {
            color = Colors.primary200
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    function answer3ButtonStyle() { // style the answer button dynamically
        let color;

        if (isAnswer3Selected) {
            color = Colors.gold
        } else {
            color = Colors.primary200
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    function answer4ButtonStyle() { // style the answer button dynamically
        let color;

        if (isAnswer4Selected) {
            color = Colors.gold
        } else {
            color = Colors.primary200
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    function submitButtonStyle() { // style the answer button dynamically
        let color;

        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) {
            color = Colors.button300;
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) {
            color = Colors.gray400;
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected || isSubmitDisabledAfterPressForMultiselect) {
            color = Colors.gray400;
        } else {
            color = Colors.button300;
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    function isSubmitButtonDisbled() {
        let disabled;

        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) { // sortable questions must be submit-able on first load
            disabled = false;
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) { // sortable question must not be submit-able after wrong answer
            disabled = true;
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected || isSubmitDisabledAfterPressForMultiselect) {
            disabled = true; // multiselect question AND no answer is selected OR button is disabled after submitting a wrong answer
        } else {
            disabled = false; // multiselect question AND any answer is selected
        }

        return disabled;
    }

    const provideUserFeedback = () => {
        let feedback = {};
    
        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) {
            feedback.message = 'If you are confident, press submit.';
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) {
            feedback.message = 'Incorrect answer. Try again!';
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected) { // validate name field
            feedback.message = 'Select an answer to proceed.';
        } else if (isSubmitDisabledAfterPressForMultiselect) {
            feedback.message = 'Incorrect answer. Try again!';
        } else {
            feedback.message = 'If you are confident, press submit.';
        }
    
        setFeedback(feedback);
    };

    function sendSortable1down() {
        temporarySortableText = sortable1Text;
        setSortable1Text(sortable2Text);
        setSortable2Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable2up() {
        temporarySortableText = sortable1Text;
        setSortable1Text(sortable2Text);
        setSortable2Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable2down() {
        temporarySortableText = sortable2Text;
        setSortable2Text(sortable3Text);
        setSortable3Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable3up() {
        temporarySortableText = sortable2Text;
        setSortable2Text(sortable3Text);
        setSortable3Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable3down() {
        temporarySortableText = sortable3Text;
        setSortable3Text(sortable4Text);
        setSortable4Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable4up() {
        temporarySortableText = sortable3Text;
        setSortable3Text(sortable4Text);
        setSortable4Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    // show the HINT message
    let hint = <View></View>;
    if (isHintVisible) {
        hint = (
            <View style={styles.row}>
                <Text style={styles.flex1}>{QUESTIONS[index].hint}</Text>
            </View>);
    }

    // show sort-able or select-able answers based on question type
    let listOfAnswers;
    if (QUESTIONS[index].type == 'multiselect') { // MULTISELECT answers
        listOfAnswers = (
            <>
                <View style={styles.buttonsRow}>
                    <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.answerButtonInnerContainer, answer1ButtonStyle(), styles.pressed]
                                : [styles.answerButtonInnerContainer, answer1ButtonStyle()]
                            }
                            onPress={pressAnswer1}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}>{QUESTIONS[index].answers.answer_1}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.buttonsRow}>
                    <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.answerButtonInnerContainer, answer2ButtonStyle(), styles.pressed]
                                : [styles.answerButtonInnerContainer, answer2ButtonStyle()]
                            }
                            onPress={pressAnswer2}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}>{QUESTIONS[index].answers.answer_2}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.buttonsRow}>
                    <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.answerButtonInnerContainer, answer3ButtonStyle(), styles.pressed]
                                : [styles.answerButtonInnerContainer, answer3ButtonStyle()]
                            }
                            onPress={pressAnswer3}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}>{QUESTIONS[index].answers.answer_3}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.buttonsRow}>
                    <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.answerButtonInnerContainer, answer4ButtonStyle(), styles.pressed]
                                : [styles.answerButtonInnerContainer, answer4ButtonStyle()]
                            }
                            onPress={pressAnswer4}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}>{QUESTIONS[index].answers.answer_4}</Text>
                        </Pressable>
                    </View>
                </View>
            </>);
    } else { // SORTABLE answers
        listOfAnswers = (
            <>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable1down}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-down" style={styles.arrowIcon} /></Text>
                        </Pressable>

                        <Text style={styles.sortableText}>{sortable1Text}</Text>

                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.hidePressable, styles.pressed]
                                : [styles.sortableIcon, styles.hidePressable]
                            }
                            onPress={null}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-up" style={styles.hideIcon} /></Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable2down}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-down" style={styles.arrowIcon} /></Text>
                        </Pressable>

                        <Text style={styles.sortableText}>{sortable2Text}</Text>

                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable2up}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-up" style={styles.arrowIcon} /></Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable3down}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-down" style={styles.arrowIcon} /></Text>
                        </Pressable>

                        <Text style={styles.sortableText}>{sortable3Text}</Text>

                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable3up}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-up" style={styles.arrowIcon} /></Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.hidePressable, styles.pressed]
                                : [styles.sortableIcon, styles.hidePressable]
                            }
                            onPress={null}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-down" style={styles.hideIcon} /></Text>
                        </Pressable>

                        <Text style={styles.sortableText}>{sortable4Text}</Text>

                        <Pressable
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.sortableIcon, styles.pressed]
                                : [styles.sortableIcon]
                            }
                            onPress={sendSortable4up}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}><FontAwesome name="arrow-up" style={styles.arrowIcon} /></Text>
                        </Pressable>
                    </View>
                </View>
            </>
        );
    }

    useEffect(() => {
        // load the displayed answers
        setSortable1Text(QUESTIONS[index].answers.answer_1);
        setSortable2Text(QUESTIONS[index].answers.answer_2);
        setSortable3Text(QUESTIONS[index].answers.answer_3);
        setSortable4Text(QUESTIONS[index].answers.answer_4);
    }, [index]); // when a new question loads

    useEffect(() => { // create countdown to reduce available points by 1 for each second passed
        const timer = countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer); // clear timeout when switching screen to next question
    }, [countdown]);

    useEffect(() => { // update the user feedback on every selection of an answer OR on pressing submit
        provideUserFeedback();
    }, [index,
        isAnswer1Selected, 
        isAnswer2Selected, 
        isAnswer3Selected, 
        isAnswer4Selected, 
        isSubmitDisabledAfterPressForMultiselect, 
        isSubmitDiabledAfterPressForSortable]);

    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.gameContainer}>
                    <View style={[styles.row, styles.rowTitle]}>
                        <Text style={[styles.flex1, styles.title]}>{QUESTIONS[index].title}</Text>
                    </View>
                    <View style={styles.barOuter}>
                        <View style={barInnerStyle()}>
                            <Text></Text>
                        </View>
                    </View>
                    <View style={[styles.row, styles.borderBottom]}>
                        <Text style={[styles.flex1, styles.text]}>Points: {countdown}</Text>
                        <Text style={[styles.flex1, styles.text]}>Your Score: {score}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.flex1}>{QUESTIONS[index].text}</Text>
                    </View>

                    <View style={styles.buttonsRow}>
                        <View style={styles.buttonOuterContainer}>
                            
                        </View>
                        <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.buttonInnerRight, hintButtonStyle(), styles.pressed]
                                : [styles.buttonInnerRight, hintButtonStyle()]
                            }
                            onPress={showHint}
                            disabled={isHintVisible}
                            android_ripple={{color: Colors.button400}}
                        >
                            <Text style={styles.buttonText}>Hint</Text>
                        </Pressable>
                        </View>
                    </View>

                    {hint}

                    {listOfAnswers}

                    {/* interactive feedback */}
                    {Object.values(feedback).map((message, index) => (
                    <Text key={index} style={styles.flex1}>
                        {message}
                    </Text>
                    ))}
                    
                    <View style={styles.buttonsRow}>
                        <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.buttonInnerLeft, styles.abortGameButton, styles.pressed]
                                : [styles.buttonInnerLeft, styles.abortGameButton]
                            }
                            onPress={onEndGame}
                            android_ripple={{color: Colors.button200}}
                        >
                            <Text style={styles.buttonText}>Abort</Text>
                        </Pressable>
                        </View>
                        <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.buttonInnerRight, submitButtonStyle(), styles.pressed]
                                : [styles.buttonInnerRight, submitButtonStyle()]
                            }
                            onPress={submitHandler}
                            disabled={isSubmitButtonDisbled()}
                            android_ripple={{color: Colors.button400}}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default GameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary400,
    },
    inner: {
        flex: 1,
        overflow: 'hidden',
        margin: 20,
        borderRadius: 8,
        marginTop: 60,
        marginBottom: 50
    },
    gameContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4
    },
    flex1: {
        flex: 1,
        fontSize: 18
    },
    text: {
        fontSize: Fonts.text
    },
    borderBottom: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: Colors.gray400,
        fontSize: Fonts.h2
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    sortableRow: {
        flexDirection: 'row',
        backgroundColor: Colors.gray600,
        overflow: 'hidden',
        borderRadius: 6,
        marginVertical: 16
    },
    buttonOuterContainer: {
        flex: 1,
        borderRadius: 6,
        overflow: 'hidden'
    },
    sortableOuterContainer: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center'
    },
    sortableIcon: {
        padding: 12,
        backgroundColor: Colors.primary200
    },
    sortableText: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontSize: Fonts.h3,
        paddingVertical: 8
    },
    buttonInnerLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 15
    },
    buttonInnerRight: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 15
    },
    answerButtonInnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6
    },
    pressed: {
        opacity: 0.75
    },
    abortGameButton: {
        backgroundColor: Colors.button100
    },
    buttonText: {
        color: 'white',
        fontSize: Fonts.h3
    },
    barOuter: {
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.gray600,
        backgroundColor: 'white',
        alignSelf: 'stretch',
        marginHorizontal: 0,
        marginVertical: 4,
        padding: 0,
        maxWidth: '97%',
        height: 14,
        overflow: 'hidden',
        backgroundColor: Colors.gray500
    },
    rowTitle: {
        alignSelf: 'center'
    },
    title: {
        fontSize: Fonts.h1
    },
    hidePressable: {
        backgroundColor: Colors.gray600 
    },
    hideIcon: {
        color: Colors.gray600,
        fontSize: 24
    },
    arrowIcon: {
        color: 'white',
        fontSize: 24
    }
});