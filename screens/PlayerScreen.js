import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import BadgesContainer from '../components/BadgesContainer';
import HighscoreContainer from '../components/HighscoreContainer';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

/**
 * The PlayerScreen component displays:
 * - the player's name
 * - a 'Logout' button
 * - a 'Play' button
 * - Badges, if they are unlocked
 * - Leaderboard with the top 3 highscores of all players (on this device)
 */

function PlayerScreen({onRemove,  // delete 'name' from storage to log player out
                      onGetName,  // re-load 'storedName' from storage (which is then 'null') to switch to StartScreen
                      storedName, // player name to display on the screen
                      onStartGame // user clicks on "Play" button --> change state of 'gameInPlay' to TRUE --> switch to GameScreen
                    }) {

  function eraseHandler() { // user clicks on "Logout" button --> erase 'name' from storage --> switch to StartScreen
    onRemove();
    onGetName();
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.playerContainer}>
          <View style={styles.playerRow}>
            <SimpleLineIcons name='graduation' style={styles.study}/>
            <Text style={styles.playerName}>{storedName}</Text>
          </View>
          <View style={styles.playerRow}>
            <View style={[styles.buttonOuterContainer, styles.buttonLeft]}>

              {/* Logout button: platform dependent styles are applied to provide click-feedback (slight color change) */}
              <Pressable 
                style={({pressed}) =>
                  pressed && Platform.OS === 'ios'
                    ? [styles.buttonInnerContainer, styles.changeNameButton, styles.pressed]
                    : [styles.buttonInnerContainer, styles.changeNameButton]
                }
                onPress={eraseHandler}
                android_ripple={{color: Colors.button200}}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
            <View style={[styles.buttonOuterContainer, styles.buttonRight]}>

              {/* Play button: platform dependent styles are applied to provide click-feedback (slight color change) */}
              <Pressable 
                style={({pressed}) =>
                  pressed && Platform.OS === 'ios'
                    ? [styles.buttonInnerContainer, styles.startGameButton, styles.pressed]
                    : [styles.buttonInnerContainer, styles.startGameButton]
                }
                onPress={onStartGame}
                android_ripple={{color: Colors.button400}}
              >
                <Text style={styles.buttonText}>Play</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* use custom component, see BadgesContainer.js file */}
        <BadgesContainer storedName={storedName} />

        {/* use custom component, see HighscoreContainer.js file */}
        <HighscoreContainer />

      </View>
    </View>
  );
}

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary400,
  },
  inner: {
    flex: 1,
    overflow: 'hidden',
    margin: 20,
    borderRadius: 8,
    marginTop: 60,
    marginBottom: 50
  },
  playerContainer: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray400,
    padding: 20
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16
  },
  study: {
    fontSize: 38,
    color: 'black'
  },
  playerName: {
    fontSize: Fonts.h1,
    marginLeft: 12
  },
  buttonOuterContainer: {
    flex: 1,
    borderRadius: 6,
    overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8
  },
  buttonRight: {
    marginLeft: 15
  },
  buttonLeft: {
    marginRight: 15
  },
  buttonInnerContainer: {
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  pressed: {
    opacity: 0.75
  },
  changeNameButton: {
    backgroundColor: Colors.button100
  },
  startGameButton: {
    backgroundColor: Colors.button300
  },
  buttonText: {
    color: 'white',
    fontSize: Fonts.h3
  }
});