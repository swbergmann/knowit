import { StatusBar } from 'expo-status-bar';

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './screens/StartScreen';
import PlayerScreen from './screens/PlayerScreen';

export default function App() {
  const [userInput, setUserInput] = useState();
  const [storedName, setStoredName] = useState();

  const storeName = async () => {
    try {
      await AsyncStorage.setItem('name', userInput);
    } catch (e) {
      console.log(e);
    }
  };

  const getName = async () => {
    try {
      let name = await AsyncStorage.getItem('name');
      setStoredName(name); // based on this value, the correct screen is rendered
    } catch (e) {
      console.log(e);
    }
  };

  const removeName = async () => {
    try {
      await AsyncStorage.removeItem('name');
    } catch (e) {
      console.log(e);
    }
  };

  function eraseHandler() {
    removeName();
    getName(); // update storedName to switch screens
  }

  function inputChangeHandler(text) {
    console.log(text);
    setUserInput(text);
  }

  function pressHandler() {
    storeName();
    getName(); // update storedName to switch screens
  }

  useEffect(() => {
    getName();
  }, []);

  // use props to pass pointers to these functions to the component
  let screen = <StartScreen onInputChange={inputChangeHandler} onPress={pressHandler} name={userInput} />;

  if (storedName) {
    screen = <PlayerScreen onPress={eraseHandler} />;
  }

  return (
    <>
      {screen}
      <StatusBar style='auto' />
    </>
  );
}