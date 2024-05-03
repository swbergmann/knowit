import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';

import Colors from '../constants/colors';

// use object-destructuring to automatically pull out these props from the incoming props object
function StartScreen({onStore, onGetName}) {
  const [userInput, setUserInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  function inputChangeHandler(text) {
    setUserInput(text);
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
    <View style={styles.container}>
      <Image 
        source={require('../assets/undraw/welcome_cats.png')}
        style={styles.welcomeImage}
        resizeMode='contain'
      />

      <Text style={styles.knowit}>to Know It?!</Text>
      
      <TextInput 
        style={styles.input}
        placeholder='Please enter your name'
        onChangeText={inputChangeHandler}
      />

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
        <Text style={styles.white}>Save my name!</Text>
      </Pressable>    
    </View>
  );
}

export default StartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    welcomeImage: {
      width: '100%',
      height: 210,
      marginTop: 70
    },
    knowit: {
      fontSize: 36
    },
    title: {
      fontSize: 28
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.primary300,
      alignSelf: 'stretch',
      margin: 32,
      height: 64,
      borderRadius: 6,
      paddingHorizontal: 16,
      fontSize: 24
    },
    button: {
      backgroundColor: Colors.primary300,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginTop: 32,
      marginHorizontal: 32,
      borderRadius: 6
    },
    white: {
      color: 'white',
      fontSize: 18
    },
    error: {
      color: 'red',
      fontSize: 20
    }
});