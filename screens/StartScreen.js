import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';

// use object-destructuring to automatically pull out these props from the incoming props object
function StartScreen({onStore, onGetName}) {
  const [userInput, setUserInput] = useState();

  function inputChangeHandler(text) {
    console.log(text);
    setUserInput(text);
  }

  function pressHandler() {
    onStore(userInput);
    onGetName(); // update storedName to switch screens
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/undraw/welcome_cats.png')}
        style={styles.welcomeImage}
        resizeMode='contain'
      />

      <Text style={styles.knowit}>to Know It?!</Text>
      {/* <Text style={styles.title}>the quizzing app</Text> */}
      
      <TextInput 
        style={styles.input}
        placeholder='Please enter your name'
        onChangeText={inputChangeHandler}
      />

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
      borderColor: '#575DD9',
      alignSelf: 'stretch',
      margin: 32,
      height: 64,
      borderRadius: 6,
      paddingHorizontal: 16,
      fontSize: 24
    },
    button: {
      backgroundColor: '#575DD9',
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
    }
});