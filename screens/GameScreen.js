import { StyleSheet, View, Text, Pressable, FlatList, Platform } from 'react-native';

import { QUESTIONS } from '../data/game-data';

import Colors from '../constants/colors';
import QuestionContainer from '../components/QuestionContainer';

/* created outside of the component function since it doesn't 
*  have to be re-created when the component re-renders
*/
function renderQuestionItem(itemData) {
    return(
        <QuestionContainer
            text={itemData.item.text}
            hint={itemData.item.hint}
        />
    );
}

function GameScreen({onEndGame}) {
    console.log('QUESTIONS');
    console.log(QUESTIONS);
    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.gameContainer}>
                    <Text>GameScreen</Text>
                    <FlatList
                        data={QUESTIONS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderQuestionItem}
                        />
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
                            onPress={null}
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