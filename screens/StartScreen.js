import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Pressable, Keyboard, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback, Platform } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';

// use object-destructuring to automatically pull out these props from the incoming props object
function StartScreen({onStore, onGetName}) {
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  function inputChangeHandler(text) {
    setUserInput(text.trim()); // remove white-spaces
  }

  function pressHandler() {
    if (isFormValid) { // only store input if form is validated
      onStore(userInput);
      onGetName(); // update storedName to switch screens
    }
  }

  const validateForm = () => {
    let errors = {};

    if (!userInput) { // validate name field
      errors.name = 'Name is required.';
    } else if (userInput.length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    } else if (userInput.length > 12) {
      errors.name = 'Maximum length is 12 characters.';
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); // form is only valid if 0 errors occur
  }

  useEffect(() => {
    validateForm(); // validate form on every user input
  }, [userInput]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.visible}>
              <View style={styles.upper}>
                <Image 
                  source={require('../assets/undraw/welcome_cats.png')}
                  style={styles.welcomeImage}
                  resizeMode='contain'
                />

                <Text style={styles.knowit}>Know It?!</Text>
              </View>
              <View style={styles.lower}>
                <Text style={styles.description}>Enter your name</Text>

                <View style={styles.inputLine}>
                  <SimpleLineIcons name='graduation' color='black' style={styles.icon}/>
                  <TextInput 
                    style={styles.input}
                    placeholder='Name'
                    onChangeText={inputChangeHandler}
                    />
                </View>

                {/* show errors only when they exist */}
                {Object.values(errors).map((error, index) => (
                  <Text key={index} style={styles.error}>
                    {error}
                  </Text>
                ))}

                <Pressable 
                  style={styles.button}
                  onPress={pressHandler}
                >
                  <Text style={styles.white}>Login</Text>
                </Pressable>
              </View>
            </View>
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
      marginTop: 90
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
    knowit: {
      fontSize: 36,
      marginVertical: 20
    },
    description: {
      fontSize: 20,
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
      marginHorizontal:24,
      width: '100%'
    },
    button: {
      backgroundColor: Colors.primary200,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginVertical: 32,
      marginTop: 85,
      borderRadius: 6
    },
    white: {
      color: 'white',
      fontSize: 24
    },
    error: {
      color: 'red',
      fontSize: 20
    }
});