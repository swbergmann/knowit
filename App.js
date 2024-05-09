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

  function startGame() {
    setGameInPlay(true);
  }

  function endGame() {
    setGameInPlay(false);
  }

  /* Use props to pass pointers to these functions to the component
  *  or pass the values to the components.
  */
  let screen;

  if (storedName && !gameInPlay) { // name is found in the storage AND game is not started
    screen = <PlayerScreen 
                onRemove={removeName}
                onGetName={getName}
                storedName={storedName}
                onStartGame={startGame}
              />;
  } else if (storedName && gameInPlay) { // name is found in the storage AND game is started
    screen = <GameScreen onEndGame={endGame} />;
  } else { // no name found in the storage
    screen = <StartScreen onStore={storeName} onGetName={getName} />
  }

  return (
    <>
      <StatusBar style='light' />
      {screen}
    </>
  );
}