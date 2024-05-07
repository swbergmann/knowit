import { StatusBar } from 'expo-status-bar';

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './screens/StartScreen';
import PlayerScreen from './screens/PlayerScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const [storedName, setStoredName] = useState();
  const [gameInPlay, setGameInPlay] = useState(false);

  const storeName = async (userInput) => {
    try {
      await AsyncStorage.setItem('name', userInput);
    } catch (e) {console.log(e);}
  };

  const getName = async () => {
    try {
      let name = await AsyncStorage.getItem('name');
      setStoredName(name); // based on this value, the correct screen is rendered
    } catch (e) {console.log(e);}
  };

  const removeName = async () => {
    try {
      await AsyncStorage.removeItem('name');
    } catch (e) {console.log(e);}
  };

  useEffect(() => {getName();}, []); // query the name from async storage only on the first loading of the page

  // use props to pass pointers to these functions to the component
  let screen = <StartScreen onStore={storeName} onGetName={getName} />;

  if (storedName) {
    screen = <PlayerScreen 
                onRemove={removeName}
                onGetName={getName}
                storedName={storedName}
                onPlay={setGameInPlay}
              />;
  }

  if (gameInPlay) {
    screen = <GameScreen />;
  }

  return (
    <>
      <StatusBar style='light' />
      {screen}
    </>
  );
}