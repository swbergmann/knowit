import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';

function PlayerScreen({onRemove, onGetName, storedName}) {
  function eraseHandler() {
    onRemove();
    onGetName(); // update storedName to switch screens
    // setUserInput("");
  }
  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <Text style={styles.playerName}>{storedName}</Text>
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
        <Pressable 
            style={styles.button}
            onPress={eraseHandler}
        >
          <Text style={styles.white}><SimpleLineIcons name='logout' style={styles.icon} color='white' size={24}/> Change name!</Text>
        </Pressable>
        <Pressable 
            style={styles.button}
            onPress={null}
        >
          <Text style={styles.white}><SimpleLineIcons name='logout' color='white'/> Start game!</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 70
  },
  playerContainer: {
    flex: 1,
    backgroundColor: 'red'
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
  playerName: {
    fontSize: 36
  },
  icon: {
    backgroundColor: 'red'
  },
  button: {
    backgroundColor: Colors.primary300,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6
  },
  white: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'orange'
  }
});