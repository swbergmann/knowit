import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Platform } from 'react-native';

// loads an array of question from the game-data.js file
import { QUESTIONS } from '../data/game-data';

import Colors from '../constants/colors';
import QuestionContainer from '../components/QuestionContainer';

function GameScreen({onEndGame}) {
    const [index, setIndex] = useState(0); // helper to iterate over the QUESTIONS
    console.log('index----');
    console.log(index);

    let question =  <QuestionContainer
                        text={QUESTIONS[index].text}
                        hint={QUESTIONS[index].hint}
                    />;

    function submitHandler() {
        console.log("submitHandler----");
        console.log(index);
        if (index < 1) { // load next question
            let count = index + 1;
            setIndex(count);
        } else { // finish the game
            onEndGame();
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.gameContainer}>
                    <Text>GameScreen</Text>

                    {question}

                    {/* <FlatList
                        data={QUESTIONS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderQuestionItem}
                        /> */}
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
    }
});