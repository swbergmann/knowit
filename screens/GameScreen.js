import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';

// loads an array of question objects from the game-data.js file
import { QUESTIONS } from '../data/game-data';

import Colors from '../constants/colors';

function GameScreen({onEndGame}) {
    const [index, setIndex] = useState(0); // helper to iterate over the QUESTIONS
    const [countdown, setCountdown] = useState(100); // points for correct answer decrease over time
    const [score, setScore] = useState(0); // stores the current score of the user

    function submitHandler() { // submit button pressed
        if (index < 1) { // load next question
            let newIndex = index + 1;
            let newScore = score + countdown;
            setScore(newScore); // update player score
            setIndex(newIndex); // renders the next question
            setCountdown(100); // restart countdown at 100 points
        } else { // finish the game
            console.log('game ends------')
            onEndGame();
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