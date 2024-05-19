import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Pressable, Keyboard, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback, Platform } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import { validateLogin } from '../utils/validateLogin';

/**
 * The StartScreen component displays
 * - a welcome image
 * - name of the app
 * - an input field for the user name
 * - validation feedback for the user name
 * - a 'Login' button.
 */
function StartScreen({onStore, onGetName}) {              // use object-destructuring to automatically pull out these props from the incoming props object
  const [userInput, setUserInput] = useState('');         // state of the user input (player name)
  const [error, setError] = useState('');                 // error messages for input of player name
  const [isFormValid, setIsFormValid] = useState(false);  // is the input valid or not

  function inputChangeHandler(text) {   // executed when text input changes
    setUserInput(text);       // set value of 'userInput' to the input text provided by the user
  }

  function pressHandler() {   // executed when 'Login' button is clicked
    if (isFormValid) {        // only store input if form is validated
      onStore(userInput);     // store user input in the AsyncStorage
      onGetName();            // load and update 'storedName' to switch screens (via conditions in App.js)
    }
  }

  useEffect(() => {
    setError(validateLogin(userInput));
    setIsFormValid(Object.keys(validateLogin(userInput)).length === 0);
  }, [userInput]);  // every time the 'userInput' state changes

  return (
    <KeyboardAvoidingView
      // to scrool up the screen if the device keyboard opens on an IOS device use 'padding' otherwise (Android) use 'height'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* close the device keyboard, if the user presses anywhere on the screen - with exception of the text input element */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.visible}>
              <View style={styles.upper}>
                <Image 
                  source={require('../assets/undraw/welcome_cats.png')}
                  style={styles.welcomeImage}
                  resizeMode='contain'
                />

                <Text style={styles.introduction}>to the quizzing app</Text>
                <Text style={styles.knowit}>Know It?!</Text>
              </View>
              <View style={styles.lower}>
                <Text style={styles.description}>Enter your name</Text>

                <View style={styles.inputLine}>
                  <SimpleLineIcons name='graduation' color='black' style={styles.icon}/>
                  <TextInput 
                    style={styles.input}
                    placeholder='Name'
                    autoCorrect={false}
                    onChangeText={inputChangeHandler}
                    />
                </View>

                {/* error message is displayed when the form validation detects them */}
                <Text style={styles.error}>
                  {error}
                </Text>
                
                <View style={styles.buttonOuterContainer}>
                  {/* Login button: platform dependent styles are applied to provide click-feedback (slight color change) */}
                  <Pressable 
                    style={({pressed}) =>
                      pressed && Platform.OS === 'ios'
                        ? [styles.buttonInnerContainer, styles.pressed]
                        : styles.buttonInnerContainer
                    }
                    onPress={pressHandler}
                    android_ripple={{color: Colors.primary600}}
                    >
                    <Text style={styles.buttonText}>Login</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            {/* Empty View as last emelemt is necessary to have a pretty styling AND the scroll-up behavior of the KeyboardAvoidingView */}
            <View style={styles.empty}></View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primary600
    },
    safe: {
      flex: 1,
      marginTop: 60
    },
    inner: {
      flex: 1,
      margin: 20,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      borderRadius: 8
    },
    visible: {
      overflow: 'hidden',
      borderRadius: 8
    },
    upper: {
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'white',
      borderBottomWidth: 2,
      borderBottomColor: Colors.gray400
    },
    lower: {
      alignItems: 'center',
      backgroundColor: Colors.gray000,
      paddingVertical: 20
    },
    empty: {
      flex: 1
    },
    welcomeImage: {
      width: '100%',
      height: 210
    },
    introduction: {
      fontSize: Fonts.h3
    },
    knowit: {
      fontSize: Fonts.h1,
      marginVertical: 20
    },
    description: {
      fontSize: Fonts.text,
      color: Colors.gray600
    },
    inputLine: {
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: Colors.gray400,
      backgroundColor: 'white',
      borderRadius: 6,
      alignSelf: 'stretch',
      marginHorizontal: 24,
      marginVertical: 24,
      padding: 10,
      overflow: 'hidden'
    },
    icon: {
      marginTop: 2,
      fontSize: 24
    },
    input: {
      fontSize: 24,
      marginHorizontal: 24,
      width: '100%'
    },
    buttonOuterContainer: {
      borderRadius: 6,
      overflow: 'hidden',
      marginVertical: 32,
      marginTop: 85
    },
    buttonInnerContainer: {
      width: 120,
      backgroundColor: Colors.primary200,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12
    },
    pressed: {
      opacity: 0.75
    },
    buttonText: {
      color: 'white',
      fontSize: Fonts.h3
    },
    error: {
      color: 'red',
      fontSize: Fonts.text
    }
});