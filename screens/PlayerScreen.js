import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';

function PlayerScreen({onRemove, onGetName, storedName}) {
  function eraseHandler() {
    onRemove();
    onGetName(); // update storedName to switch screens
  }
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.playerContainer}>
          <View style={styles.playerRow}>
            <SimpleLineIcons name='graduation' color='black' style={styles.study}/>
            <Text style={styles.playerName}>{storedName}</Text>
          </View>
          <View style={styles.playerRow}>
            <Pressable 
                style={[styles.buttonInnerContainer, styles.changeNameButton]}
                onPress={eraseHandler}
            >
              <Text style={styles.buttonText}>Change name</Text>
            </Pressable>
            <Pressable 
                style={[styles.buttonInnerContainer, styles.startGameButton]}
                onPress={null}
            >
              <Text style={styles.buttonText}>Start game</Text>
            </Pressable>
          </View>
          <View style={styles.playerRow}>
            <Text>Play the game to unlock badges.</Text>
          </View>
        </View>
        <View style={styles.badgesContainer}>
          <Text>Your badges:</Text>
          <Text> <SimpleLineIcons name='badge'/> Historian</Text>
          <Text> <SimpleLineIcons name='badge'/> Researcher</Text>
          <Text> <SimpleLineIcons name='badge'/> Journalist</Text>
          <Text> <SimpleLineIcons name='badge'/> Librarian</Text>
        </View>
        <View style={styles.highscoreContainer}>
          <Text>Highscore:</Text>
          <Text>100p. Sebi</Text>
          <Text>86p. Steve</Text>
          <Text>78p. Paul</Text>
        </View>
        <View style={styles.buttonsContainer}>
          
        </View>
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
    marginTop: 160
  },
  playerContainer: {
    flex: 4,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  study: {
    fontSize: 38
  },
  playerName: {
    fontSize: 36,
    marginLeft: 12
  },
  badgesContainer: {
    flex: 4,
    backgroundColor: 'orange'
  },
  highscoreContainer: {
    flex: 4,
    backgroundColor: 'yellow'
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: 'pink',
    flexDirection: 'row'
  },
  buttonInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  changeNameButton: {
    backgroundColor: Colors.button100
  },
  startGameButton: {
    backgroundColor: Colors.button200,
    marginLeft: 30
  },
  buttonText: {
    color: 'white',
    fontSize: 24
  }
});