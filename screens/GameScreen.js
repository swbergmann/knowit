import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

import { StyleSheet, View, Text, Pressable, Platform, SafeAreaView, ScrollView } from 'react-native';

import { QUESTIONS } from '../data/game-data';  // loads an array of question objects from the game-data.js file

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';


/**
 * 
   * 1. load the data from the QUESTIONS array
   * 2. take only the question with the lowest array index (i.e. 0)
   *    and remove it from the array (to show it only once)
   * 3. check the TYPE of the quesiton (i.e. multiselect or sort)
   * 4. build the screen for the question based on the TYPE
   *    (i.e. different JSX component is used for sortable answers or multiselect answers)
   * 5. countdown starts from 100 and decreases 1 point each second (automatic update)
   * 6. answering the question correctly adds the current points from the countdown to the
   *    user's current "score" and re-renders the entire screen for the next question
   *    if there is a next question
   * 7. if there is no next question (QUESTIONS array is empty)
   *    a. then we check if the user unlocked a new badge
   *    b. then we try to store the user's current "score" into the top 3 positions 
   *       of the storage.
   * 8. render PlayerScreen (overview of badges and highscores)
   * 
   * 
   * 
   * 
   * 
   * 
   *  * Every time a game finishes, the badges of the player are updated (via the GameScreen)
 * If their game score is >= 50% they unlock the *Journalist* badge.
 * If their game score is >= 75% they unlock the *Researcher* badge.
 * If their game score is >= 90% they unlock the *Historian* badge.
 * 
 * Each badge becomes visible (or unlocked) because an entry is made in 
 * the local storage in the form of a key-value pair
 * i.e. "{name}-journalist": true
 * 
 * In this way various players each have their individual state of badges.
 * 
 * 
 * 
 * 
 *     * Every time a game finishes, we try to store the score of the player into the AsyncStorage
    * We check the current score against the keys "first_score", then "second_score", then "third_score"

    // let highscore = {
    //   first_score: "100",
    //   first_name: "{name}",
    //   second_score: "85",
    //   second_name: "{name}",
    //   third_score: "78",
    //   third_name: "{name}"
    // };
 * 
 * The GameScreen component displays one question per screen.
 * 
 * The 'index' state starts at 0 and gets increased by 1 after each correct answer. The change of this 
 * state automatically re-renders (re-loads) the entire GameScreen component and displays new data
 * (i.e. next question, answers, hints) from the QUESTIONS array importet from the pre-defined data file.
 */




function GameScreen({storedName, onEndGame}) {
    const MAXPOINTS = 100;      // maximum points (initially) available per question
    const USEHINT = 75;         // click on 'Hint' button, reveals more info but subtracts 25% of the currently available points
    const WRONGANSWER =  75;    // submitting a wrong answer also subtracts 25% of the currently available points
    const PLAYERNAME = storedName;  // necessary for setting badges and highscores in the AsyncStorage

    const [index, setIndex] = useState(0); // responsible for displaying the current question (used to iterate over all QUESTIONS)

    const [countdown, setCountdown] = useState(MAXPOINTS); // starts at MAXPOINTS and gets reduced by 1 point each second that passes
    const [score, setScore] = useState(0); // current score of the user (awarded points are added after each question and the player's score increases)
    let playerScore; // helpter to increase the 'score' state. place outside functions to re-use this variable in several functions.

    const [isHintVisible, setIsHintVisible] = useState(false); // is 'Hint' button visible or not
    
    // necessary for 'multiselect' questions to enable the 'Submit' button
    const [isAnswer1Selected, setIsAnswer1Selected] = useState(false);
    const [isAnswer2Selected, setIsAnswer2Selected] = useState(false);
    const [isAnswer3Selected, setIsAnswer3Selected] = useState(false);
    const [isAnswer4Selected, setIsAnswer4Selected] = useState(false);

    const [feedback, setFeedback] = useState({}); // immediate user feedback at all times (guides the user)
    const [feedbackStyle, setFeedbackStyle] = useState({}); // styling of user feedback (i.e. default or red text color)

    /* if the user submits a wrong multiselection answer --> disable the submit button
       user must change the selection in order to submit their answer again */
    const [isSubmitDisabledAfterPressForMultiselect, setIsSubmitDisabledAfterPressForMultiselect] = useState(false);

    /* if the user submits a wrong sort of answers --> disable the submit button
       user must change the order of answers to submit their answer again*/
    const [isSubmitDiabledAfterPressForSortable, setIsSubmitDiabledAfterPressForSortable] = useState(false);

    /**
     * Sortable questions are initially loaded from the QUESTIONS array.
     * When the user changes the order by clicking on the up- or down- arrows the text values
     * get re-assigned and the component re-renders and displays the new order (which is different
     * from the initial order in the QUESTIONS array).
     */
    const [sortable1Text, setSortable1Text] = useState(QUESTIONS[index].answers.answer_1);
    const [sortable2Text, setSortable2Text] = useState(QUESTIONS[index].answers.answer_2);
    const [sortable3Text, setSortable3Text] = useState(QUESTIONS[index].answers.answer_3);
    const [sortable4Text, setSortable4Text] = useState(QUESTIONS[index].answers.answer_4);
    let temporarySortableText; // helper for re-assigning the text values

    // differentiate between multiselect and sortable questions (different styling & functionality)
    let isQuestionSortable = QUESTIONS[index].type == 'sortable';

    function submitHandler() { // user presses the submit button

        if (!isQuestionSortable && isAnswerCorrect()) {
            // Multiselect & CORRECT answer

            playerScore = score + countdown;    // increase score of the player
            setScore(playerScore);              // set new state
            
            if (index < (QUESTIONS.length - 1)) {   // current question is NOT the last question - we must prepare the state of the screen
                // deselect all answers
                setIsAnswer1Selected(false);
                setIsAnswer2Selected(false);
                setIsAnswer3Selected(false);
                setIsAnswer4Selected(false);

                setIsHintVisible(false);            // hide 'Hint' text (default state for the next question to be loaded)

                let newIndex = index + 1;   // increase index by 1
                setIndex(newIndex);         // set the 'index' state - this renders the next question
                setCountdown(MAXPOINTS);    // restart the countdown at 100 points

            } else { // game ends (current question was the LAST question)
                compareScoreWithHighscore();
            }
        } else if (!isQuestionSortable && !isAnswerCorrect()) {
                // Multiselect & WRONG answer

            setIsSubmitDisabledAfterPressForMultiselect(true); // disable 'Submit' button to prevent double-submits of incorrect answers
            setCountdown(Math.ceil(countdown / 100 * WRONGANSWER)); // reduce points to be earned. Math.ceil() prevents decimals in the countdown.
        } else if (isQuestionSortable && isSortCorrect()) {
            // Sortable & CORRECT answer

            playerScore = score + countdown;    // increase score of the player
            setScore(playerScore);              // set new state
            
            if (index < (QUESTIONS.length - 1)) {
                // current question is NOT the last question - we must prepare the state of the screen
                
                setIsHintVisible(false);    // hide 'Hint' text (default state for the next question to be loaded)

                let newIndex = index + 1;   // increase index by 1
                setIndex(newIndex);         // set the 'index' state - this renders the next question
                setCountdown(MAXPOINTS);    // restart the countdown at 100 points

            } else { // game ends (current question was the LAST question)
                compareScoreWithHighscore();
            }
        } else if (isQuestionSortable && !isSortCorrect()) {
                // Multiselect & WRONG answer

            setIsSubmitDiabledAfterPressForSortable(true);          // disable 'Submit' button to prevent double-submits of incorrect answers
            setCountdown(Math.ceil(countdown / 100 * WRONGANSWER)); // reduce points to be earned. Math.ceil() prevents decimals in the countdown.
        }
    };

    /**
     * When multiselect questions are submitted the selected answers
     * are compared with the correct answers from the QUESTIONS array.
     */
    function isAnswerCorrect() {
        let isCorrect = false;
        let isAnswer1correct = QUESTIONS[index].correctAnswers.answer_1;
        let isAnswer2correct = QUESTIONS[index].correctAnswers.answer_2;
        let isAnswer3correct = QUESTIONS[index].correctAnswers.answer_3;
        let isAnswer4correct = QUESTIONS[index].correctAnswers.answer_4;

        // if all selected answers are correct answers AND
        // all non-selected answers are incorrect answers
        if ((isAnswer1Selected == isAnswer1correct)
            && (isAnswer2Selected == isAnswer2correct)
            && (isAnswer3Selected == isAnswer3correct)
            && (isAnswer4Selected == isAnswer4correct)) {
                // the entire answer is evaluated as 'correct'
                isCorrect = true;
        }

        return isCorrect;
    }

    /**
     * When sortable questions are submitted the chosen order of the answers
     * are compared with the correct order of the answers from the QUESTIONS array.
     */
    function isSortCorrect() {
        let isCorrect = false;
        let correctSortable1Text = QUESTIONS[index].correctOrder.answer_1;
        let correctSortable2Text = QUESTIONS[index].correctOrder.answer_2;
        let correctSortable3Text = QUESTIONS[index].correctOrder.answer_3;
        let correctSortable4Text = QUESTIONS[index].correctOrder.answer_4;

        // if the order of each text/answer matches exactly (is identical with the solution)
        if ((sortable1Text == correctSortable1Text)
            && (sortable2Text == correctSortable2Text)
            && (sortable3Text == correctSortable3Text)
            && (sortable4Text == correctSortable4Text)) {
                // the entire answer is evaluated as 'correct'
            isCorrect = true;
        }

        return isCorrect;
    }

    /**
     * When the last question is submitted correctly, the program compares the score earned
     * by the current player with the top 3 highscores from the AsynStorage.
     * 
     * If the current score is high enough, the other scores are moved and the top 3 ranking is updated.
     * 
     * Finally, this function also calls other functions (see below for comments):
     * unlockBadges()
     * onEndGame()
     */
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
                            } else {
                                // playerScore does not override any place in the top 3 leaderboard
                                // do nothing
                            }
                        } catch (e) {console.log(e);}
                    }
                } catch (e) {console.log(e);}
            }
        } catch (e) {console.log(e);}

        unlockBadges(); // check if the current player unlocked badges
        onEndGame();    // gets called AFTER all 'await' async functions so that correct data will be displayed on the PlayerScreen!
    };

    /**
     * If the score earned by the current player is high enough, badges are unlocked for the player.
     * Locked badges are gray and display the percentage value necessary to unlock them.
     * Unlocked badges have a colorful styling (yellow stars).
     * 
     * Each badge is an individual entry in the AsyncStorage with a combination of player name + badge name
     */
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

    // if first place is 'null' (i.e. nobody played the game)
    const storeCurrentPlayerAsFirstPlace = async () => {
        try {
          await AsyncStorage.setItem('first_score', playerScore + ''); // append string to cast number to string (necessary for AsyncStorage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('first_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    // if second place is 'null' (i.e. only first place exists)
    const storeCurrentPlayerAsSecondPlace = async () => {
        try {
          await AsyncStorage.setItem('second_score', playerScore + ''); // append string to cast number to string (necessary for AsyncStorage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('second_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    // if third place is 'null' (i.e. only first and second place exist)
    const storeCurrentPlayerAsThirdPlace = async () => {
        try {
          await AsyncStorage.setItem('third_score', playerScore + ''); // append string to cast number to string (necessary for AsyncStorage)
        } catch (e) {console.log(e);}

        try {
            await AsyncStorage.setItem('third_name', PLAYERNAME);
        } catch (e) {console.log(e);}
    };

    /**
     * Copy score & name from second place to third place
     * in order to then override the second place with new data.
     */
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

    /**
     * Copy score & name from first place to second place
     * in order to then override the first place with new data.
     */
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

    /**
     * The countdown bar on top of the GameScreen initial has a width of 100%
     * each second, the countdown decreases by 1 point, which reduces the width
     * also by 1% each second.
     * 
     * In addition to changes of the bar width, also the bar color changes
     * from green to gold to orange to red in order to indicate the loss 
     * of possible points for this question.
     * 
     * Since the entire GameScreen component re-renders each second because of
     * the new value of the 'countdown' state, the barInnerStyle() function also
     * gets called each second and updates the styling of the bar.
     */

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
            backgroundColor: newColor,  // color
            width: newBarWidth          // width
        }
    }

    /**
     * When the 'Hint' button was clicked the 'isHintVisible' state is set to true
     * This value is used to change the color of the 'Hint' button to a soft gray,
     * because the button is then disabled and not press-able a second time.
     */
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

    /**
     * Press the 'Hint' button
     */
    function showHint() {
        setCountdown(Math.ceil(countdown / 100 * USEHINT)); // decreases the points to be earned. Math.ceil() prevents decimals in the countdown
        setIsHintVisible(true); // change this state and display the hint message to the user
    }

    /**
     * pressAnswer1(), pressAnswer2(), pressAnswer3(), pressAnswer4()
     * 
     * In multiselect questions the 'Submit' button is disabled by default, because initially no answer is selected by the user.
     * Only when the user presses an answer option and thereby selects it, then the 'Submit' button gets en-abled.
     */

    function pressAnswer1() {
        setIsAnswer1Selected(!isAnswer1Selected);               // toggle this state
        setIsSubmitDisabledAfterPressForMultiselect(false);     // enable 'Submit' button
    }

    function pressAnswer2() {
        setIsAnswer2Selected(!isAnswer2Selected);               // toggle this state
        setIsSubmitDisabledAfterPressForMultiselect(false);     // enable 'Submit' button
    }

    function pressAnswer3() {
        setIsAnswer3Selected(!isAnswer3Selected);               // toggle this state
        setIsSubmitDisabledAfterPressForMultiselect(false);     // enable 'Submit' button
    }

    function pressAnswer4() {
        setIsAnswer4Selected(!isAnswer4Selected);               // toggle this state
        setIsSubmitDisabledAfterPressForMultiselect(false);     // enable 'Submit' button
    }

    /**
     * answer1ButtonStyle(), answer2ButtonStyle(), answer3ButtonStyle(), answer4ButtonStyle()
     * 
     * Dynamically return the styling of the answer option.
     */
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

    /**
     * The 'Submit' button color is gray when it is disabled and blue when it is pressable
     */
    function submitButtonStyle() { // style the answer button dynamically
        let color;

        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) {
            // sortable question && no wrong answer submitted (default when question is rendered)
            color = Colors.button300;
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) {
            // sortable question && wrong answer submitted
            color = Colors.gray400;
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected || isSubmitDisabledAfterPressForMultiselect) {
            // multiselect question && no answer selected (default state when question is rendered)
            // OR multiselect question && wrong anser submitted
            color = Colors.gray400;
        } else {
            // all other scenarios
            color = Colors.button300;
        }

        return { // return the dynamic style of the answer button
            backgroundColor: color
        }
    }

    /**
     * Several conditions specify if the 'Submit' button is pressable or disabled
     */
    function isSubmitButtonDisbled() {
        let disabled;

        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) {
            // sortable questions must be submit-able on first load
            disabled = false;
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) {
            // sortable question must not be submit-able after wrong answer was submitted by the user
            disabled = true;
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected || isSubmitDisabledAfterPressForMultiselect) {
            // multiselect question AND no answer is selected 
            // OR multiselect question AND button is disabled after submitting a wrong answer
            disabled = true; 
        } else {
            // all other scenarios (i.e. change the selection in any way)
            disabled = false;
        }

        return disabled;
    }

    /**
     * Above the 'Submit' button interactive user feedback is displayed.
     * This feedback guides the user on what actions to perform next
     * (i.e. incorrect answer)
     * 
     * In case of an incorrect answer, the feedback is styled in red color.
     */
    const provideUserFeedback = () => {
        let feedback = {};
        let style;
    
        if (isQuestionSortable && !isSubmitDiabledAfterPressForSortable) {
            feedback.message = 'If you are confident, press submit.';
            style = 'info';
        } else if (isQuestionSortable && isSubmitDiabledAfterPressForSortable) {
            feedback.message = 'Incorrect answer. Try again!';
            style = 'error';
        } else if (!isAnswer1Selected && !isAnswer2Selected && !isAnswer3Selected && !isAnswer4Selected) {
            feedback.message = 'Select an answer to proceed.';
            style = 'info';
        } else if (isSubmitDisabledAfterPressForMultiselect) {
            feedback.message = 'Incorrect answer. Try again!';
            style = 'error';
        } else {
            feedback.message = 'If you are confident, press submit.';
            style = 'info';
        }
    
        setFeedback(feedback);
        setFeedbackStyle(style);
    };

    // return the style which is defined in the setFeedbackStyle() call of the provideUserFeedback() function.
    function getFeedbackStyle() {
        let color = 'black';    // default color is black (i.e. info style)

        if (feedbackStyle == 'error') {
            color = 'red';      // red color in case of submitting a wrong answer
        }

        return {color: color};
    };

    /**
     * sendSortable1down(), 
     * sendSortable2up(), sendSortable2down()
     * sendSortable3up(), sendSortable3down()
     * sendSortable4up()
     * 
     * The text of the displayed answers of sortable questions are stored in the state of:
     * sortable1Text, sortable2Text, sortable3Text, sortable4Text
     * 
     * If a user clicks any of the arrow-buttons (up or down) then the respective function is called
     * to re-assign (exchange) the values of the affected states. If the state changes, the component 
     * re-renders automatically and displays the answers in the new order.
     * 
     * Finally setIsSubmitDiabledAfterPressForSortable() is set to FALSE, which makes the 'Submit' button pressable again.
     */

    function sendSortable1down() {
        temporarySortableText = sortable1Text;  // temporary assignment
        setSortable1Text(sortable2Text);
        setSortable2Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable2up() {
        temporarySortableText = sortable1Text;  // temporary assignment
        setSortable1Text(sortable2Text);
        setSortable2Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable2down() {
        temporarySortableText = sortable2Text;  // temporary assignment
        setSortable2Text(sortable3Text);
        setSortable3Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable3up() {
        temporarySortableText = sortable2Text;  // temporary assignment
        setSortable2Text(sortable3Text);
        setSortable3Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable3down() {
        temporarySortableText = sortable3Text;  // temporary assignment
        setSortable3Text(sortable4Text);
        setSortable4Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    function sendSortable4up() {
        temporarySortableText = sortable3Text;  // temporary assignment
        setSortable3Text(sortable4Text);
        setSortable4Text(temporarySortableText);
        setIsSubmitDiabledAfterPressForSortable(false);
    }

    // show the HINT message, this variable is used in the JSX code below as {hint}
    let hint = <View></View>;
    if (isHintVisible) {
        hint = (
            <View style={styles.row}>
                <Text style={styles.flex1}>{QUESTIONS[index].hint}</Text>
            </View>);
    }

    /**
     * show sort-able or select-able answers based on question type
     * this variable is used in the JSX code below as {listOfAnswers}
     */
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
                        <View style={styles.sortableInnerContainer}>
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
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <View style={styles.sortableInnerContainer}>
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
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <View style={styles.sortableInnerContainer}>
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
                </View>
                <View style={styles.sortableRow}>
                    <View style={styles.sortableOuterContainer}>
                        <View style={styles.sortableInnerContainer}>
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
                </View>
            </>
        );
    }

    useEffect(() => {
        // load the text of sortable answers initially from the QUESTIONS array
        setSortable1Text(QUESTIONS[index].answers.answer_1);
        setSortable2Text(QUESTIONS[index].answers.answer_2);
        setSortable3Text(QUESTIONS[index].answers.answer_3);
        setSortable4Text(QUESTIONS[index].answers.answer_4);
    }, [index]); // when a new question is rendered (only on the first screen load, when the index increases)

    useEffect(() => { // create countdown to reduce available points by 1 for each second passed
        const timer = countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer); // clear this timeout when switching screen to next question
    }, [countdown]);

    useEffect(() => {       // update the user feedback
        provideUserFeedback();
    }, [index,              // on the initial screen load (after submitting correctly)
        isAnswer1Selected,  // on every selection of an answer
        isAnswer2Selected, 
        isAnswer3Selected, 
        isAnswer4Selected, 
        isSubmitDisabledAfterPressForMultiselect,   // after submitting a wrong answer
        isSubmitDiabledAfterPressForSortable]);     // after submitting a wrong sort

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
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
                            <View style={[styles.buttonOuterContainer, styles.buttonRight]}>
                            <Pressable 
                                style={({pressed}) =>
                                pressed && Platform.OS === 'ios'
                                    ? [styles.buttonInnerContainer, hintButtonStyle(), styles.pressed]
                                    : [styles.buttonInnerContainer, hintButtonStyle()]
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

                        {/* interactive feedback to guide the user through the game */}
                        {Object.values(feedback).map((message, index) => (
                        <Text key={index} style={[styles.flex1, getFeedbackStyle()]}>
                            {message}
                        </Text>
                        ))}
                        
                        <View style={styles.buttonsRow}>
                            <View style={[styles.buttonOuterContainer, styles.buttonLeft]}>
                            <Pressable 
                                style={({pressed}) =>
                                pressed && Platform.OS === 'ios'
                                    ? [styles.buttonInnerContainer, styles.abortGameButton, styles.pressed]
                                    : [styles.buttonInnerContainer, styles.abortGameButton]
                                }
                                onPress={onEndGame}
                                android_ripple={{color: Colors.button200}}
                            >
                                <Text style={styles.buttonText}>Abort</Text>
                            </Pressable>
                            </View>
                            <View style={[styles.buttonOuterContainer, styles.buttonRight]}>
                            <Pressable 
                                style={({pressed}) =>
                                pressed && Platform.OS === 'ios'
                                    ? [styles.buttonInnerContainer, submitButtonStyle(), styles.pressed]
                                    : [styles.buttonInnerContainer, submitButtonStyle()]
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
            </ScrollView>
        </SafeAreaView>
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
        marginTop: 60
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
        marginVertical: 16,
        overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8
    },
    buttonOuterContainer: {
        flex: 1,
        borderRadius: 6,
        overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8
    },
    buttonRight: {
        marginLeft: 15
    },
    buttonLeft: {
        marginRight: 15
    },
    sortableOuterContainer: {
        flex: 1
    },
    sortableInnerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: 6
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
    buttonInnerContainer: {
        alignItems: 'center',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    answerButtonInnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12
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