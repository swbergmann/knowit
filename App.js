import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StartScreen from './screens/StartScreen';
import PlayerScreen from './screens/PlayerScreen';
import GameScreen from './screens/GameScreen';


/**
 * This is the main component of the application.
 * 
 * It displays the different screens of the app based on defined conditions.
 * It provides functions to persist, delete or fetch data from the storage (AsyncStorage).
 */
export default function App() {
  /**
   * The component is automatically re-rendered by React if the state of these variables changes.
   * Depending on the state (also: value) of 'storedName' and 'gameInPlay' different screens are displayed.
   * i.e. StartScreen, PlayerScreen or GameScreen
   */
  const [storedName, setStoredName] = useState(); // player name received from storage. "null" if user logs out
  const [gameInPlay, setGameInPlay] = useState(false); // is the game currenty played or not (to render GameScreen)


  /**
   * AsyncStorage is used to persist data locally on the phone
   * i.e. name, badges, highscores of different players (also: leaderboard)
   * different users can "login" by providing their name
   * they can play the game, unlock badges for themselves and create highscores
   * 
   * AsyncStorage works by storing pairs of key and value.
   * i.e. key 'name' and value 'Sebastian'
   * To retrieve the value of 'Sebastian' the key 'name' must be queried from the storage with .getItem('name')
   * Only string values are stored.
   */
  const storeName = async (userInput) => { // store user name in storage
    try {
      await AsyncStorage.setItem('name', userInput);
    } catch (e) {console.log(e);}
  };

  const getName = async () => { // retrieve user name from storage
    try {
      let name = await AsyncStorage.getItem('name');
      setStoredName(name); // necessary to render the correct screen. if name is 'null' then the player must enter their name
    } catch (e) {console.log(e);}
  };

  const removeName = async () => { // when player logs out, the value of 'name' gets deleted from storage
    try {
      await AsyncStorage.removeItem('name');
    } catch (e) {console.log(e);}
  };

  useEffect(() => {
    getName();
  }, []); // query the name from async storage only on the first loading of the component

  /**
   * startGame()
   * 
   * When the player clicks the "Play" button on the PlayerScreen
   * the state of "gameInPlay" changes to TRUE
   */
  function startGame() {
    setGameInPlay(true);
  }

  /**
   * endGame()
   * 
   * When the player clicks the "Logout" button on the PlayerScreen or the "Abort" button on the GameScreen
   * the state of "gameInPlay" changes to FALSE
   */
  function endGame() {
    setGameInPlay(false);
  }

  /* Props (i.e. onRemove, onGetName, storedName, etc.) are used to pass pointers to these functions
  *  to other components or pass the value of this variable to other components (so they can be used there).
  */
  let screen;

  if (storedName && !gameInPlay) {  // name is found in the storage AND game is NOT started
    screen = <PlayerScreen          // render PlayerScreen (pass props to the component)
                onRemove={removeName}
                onGetName={getName}
                storedName={storedName}
                onStartGame={startGame}
              />;
  } else if (storedName && gameInPlay) {  // name is found in the storage AND game is started
    screen = <GameScreen                  // render GameScreen (pass props to the component)
                storedName={storedName}
                onEndGame={endGame}
              />;
  } else {                            // no name is found in the storage (i.e. null)
    screen = <StartScreen             // render StartScreen (pass props to the component)
                onStore={storeName}
                onGetName={getName}
              />
  }

  return (
    // components must return exactyl 1 child element at the highest level i.e. <></>
    <>
      {/* white text and icons in the top status bar (i.e. time, network connection) because of the dark background color of the screens */}
      <StatusBar style='light' />

      {/* render the respective screen based on conditions above */}
      {screen}
    </>
  );
}