import { StatusBar } from 'expo-status-bar';

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './screens/StartScreen';
import PlayerScreen from './screens/PlayerScreen';
import GameScreen from './screens/GameScreen';

export default function App() {
  const [storedName, setStoredName] = useState(); // the name of the player
  const [gameInPlay, setGameInPlay] = useState(false); // is the game currenty played

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

  useEffect(() => {
    getName();
  }, []); // query the name from async storage only on the first loading of the page

  /**
   * startGame()
   * the state of "gameInPlay" changes to TRUE
   * 
   * Player clicks "Play" button to start the game
   * 
   * 1. load the data from the QUESTIONS array
   * 2. take only the question with the lowest array index (i.e. 0)
   *    and remove it from the array (to show it only once)
   * 3. check the TYPE of the quesiton (i.e. multiselect or sort)
   * 4. build the screen for the question based on the TYPE
   *    (i.e. different JSX component is used for sortable answers or multiselect answers)
   * 5. countdown starts from 100 and decreases 1 point each second (automatic update)
   * 6. answering the question correctly adds the current points from the countdown to the
   *    user's current "score" and re-renders the entire screen for the next question
   *    if there is a next question
   * 7. if there is no next question (QUESTIONS array is empty)
   *    a. then we check if the user unlocked a new badge
   *    b. then we try to store the user's current "score" into the top 3 positions 
   *       of the storage.
   * 8. render PlayerScreen (overview of badges and highscores)
   */
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
    screen = <GameScreen storedName={storedName} onEndGame={endGame} />;
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