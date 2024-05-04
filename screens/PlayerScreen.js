import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';

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
            <SimpleLineIcons name='graduation' style={styles.study}/>
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
        </View>
        <View style={styles.badgesContainer}>
          <View style={styles.playerRow}>
            <Text style={styles.introduction}>Play the game to unlock badges.</Text>
          </View>
          <View style={styles.playerRow}>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Historian</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
          </View>
          <View style={styles.playerRow}>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Researcher</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
          </View>
          <View style={styles.playerRow}>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Journalist</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
          </View>
          <View style={styles.playerRow}>
            <FontAwesome name="star" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Librarian</Text>
            <FontAwesome name="star" style={styles.badgeIcon} />
          </View>
        </View>
        <View style={styles.highscoreContainer}>
          <Text>Highscore:</Text>
          <Text>100p. Sebi</Text>
          <Text>86p. Steve</Text>
          <Text>78p. Paul</Text>
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
    marginTop: 110,
    marginBottom: 50
  },
  playerContainer: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  study: {
    fontSize: 38,
    color: 'black'
  },
  playerName: {
    fontSize: 36,
    marginLeft: 12
  },
  introduction: {
    fontSize: 20
  },
  badgesContainer: {
    flex: 4,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  badgeIcon: {
    fontSize: 38,
    color: 'black'
  },
  badgeText: {
    fontSize: 28,
    marginHorizontal: 20
  },
  highscoreContainer: {
    flex: 3,
    backgroundColor: 'yellow'
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