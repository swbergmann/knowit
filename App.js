import { StatusBar } from 'expo-status-bar';

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './screens/StartScreen';
import PlayerScreen from './screens/PlayerScreen';

export default function App() {
  const [name, setName] = useState();
  const [storedName, setStoredName] = useState();

  const storeName = async () => {
    try {
      await AsyncStorage.setItem('name', name);
    } catch (e) {
      console.log('saving error');
      console.log(e);
    }
  };

  const getName = async () => {
    try {
      let name = await AsyncStorage.getItem('name');
      if (name !== null) {
        //setName(name);
        setStoredName(name);
      } else {
        console.log("name was undefined.");
        // if name was 'undefined', update storedName to reload the screens
        setStoredName(name);
      }
    } catch (e) {
      console.log('reading error');
      console.log(e);
    }
  };

  const removeName = async () => {
    try {
      await AsyncStorage.removeItem('name');
    } catch (e) {
      console.log('removing error');
    }
  };

  function onEraseHandler() {
    removeName();

    // update the state of storedName to switch screens
    getName();
  }

  function inputChangeHandler(text) {
    console.log(text);
    setName(text);
  }

  function onPressHandler() {
    storeName();

    // update the state of storedName to switch screens
    getName();
  }

  useEffect(() => {
    getName();
  }, []);

  let screen = <StartScreen onInputChange={inputChangeHandler} onPress={onPressHandler} name={name} />;

  if (storedName) {
    screen = <PlayerScreen onPress={onEraseHandler} />;
  }

  return (
    <>
      {screen}
      <StatusBar style='auto' />
    </>
  );
}