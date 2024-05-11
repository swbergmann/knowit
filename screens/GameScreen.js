import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';

// loads an array of question objects from the game-data.js file
import { QUESTIONS } from '../data/game-data';

import Colors from '../constants/colors';

function GameScreen({storedName, onEndGame}) {
    const MAXPOINTS = 100; // maximum points available per question
    const PLAYERNAME = storedName;

    const [index, setIndex] = useState(0); // helper to iterate over the QUESTIONS
    const [countdown, setCountdown] = useState(MAXPOINTS); // points for correct answer decrease over time
    const [score, setScore] = useState(0); // current score of the user

    let playerScore; // place outside functions to re-use variable

    function submitHandler() { // submit button pressed
        playerScore = score + countdown;
        setScore(playerScore); // update player score

        if (index < (QUESTIONS.length - 1)) { // accessing items in an array starts at 0th element (hence -1)
            let newIndex = index + 1;
            setIndex(newIndex); // renders the next question
            setCountdown(MAXPOINTS); // restart countdown at 100 points
        } else { // game ends
            compareScoreWithHighscore();
        }
    };

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

        if (barWidth > 60) {
            newColor = 'green';
        } else if (barWidth > 30) {
            newColor = Colors.gold;
        } else {
            newColor = 'red';
        }

        return { // return the dynamic style of the time-bar
            backgroundColor: newColor,
            width: newBarWidth
        }
    }

    useEffect(() => {
        const timer = countdown > 0 && setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer); // clear timeout when switching screen to next question
    }, [countdown]);

    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.gameContainer}>
                    <View style={styles.row}>
                        <Text style={styles.flex1}>Points to earn: {countdown}</Text>
                        <Text style={styles.flex1}>Your score: {score}</Text>
                    </View>
                    <View style={styles.barOuter}>
                        <View style={barInnerStyle()}>
                            <Text></Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.flex1}>{QUESTIONS[index].title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.flex1}>{QUESTIONS[index].text}</Text>
                    </View>
                        <View>
                            <Text>{QUESTIONS[index].hint}</Text>
                        </View>
                    <View style={styles.buttonsRow}>
                        <View style={styles.buttonOuterContainer}>
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
                        <View style={styles.buttonOuterContainer}>
                        <Pressable 
                            style={({pressed}) =>
                            pressed && Platform.OS === 'ios'
                                ? [styles.buttonInnerContainer, styles.submitAnswerButton, styles.pressed]
                                : [styles.buttonInnerContainer, styles.submitAnswerButton]
                            }
                            onPress={submitHandler}
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
        marginTop: 110,
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
        flex: 1
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    buttonOuterContainer: {
        flex: 1,
        borderRadius: 6,
        overflow: 'hidden'
      },
    buttonInnerContainer: {
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
    submitAnswerButton: {
        backgroundColor: Colors.button300
    },
    buttonText: {
        color: 'white',
        fontSize: 24
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
        backgroundColor: Colors.gray600
    }
});