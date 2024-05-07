import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text, Pressable, Image, Platform } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';
import Badges from '../components/Badges';

function PlayerScreen({onRemove, onGetName, storedName}) {

  console.log("PlayerScreen storedName");
  console.log(storedName);
  function eraseHandler() {
    onRemove();
    onGetName(); // update storedName to switch screens
  }

  /**
   * Every time a game finishes, we try to store the score of the player into the AsyncStorage
   * We check the current score against the keys "first_score", then "second_score", then "third_score"
   * 
   */

  // let highscore = {
  //   first_score: "100",
  //   first_name: "{name}",
  //   second_score: "85",
  //   second_name: "{name}",
  //   third_score: "78",
  //   third_name: "{name}"
  // };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.playerContainer}>
          <View style={styles.playerRow}>
            <SimpleLineIcons name='graduation' style={styles.study}/>
            <Text style={styles.playerName}>{storedName}</Text>
          </View>
          <View style={styles.playerRow}>
            <View style={styles.buttonOuterContainer}>
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
            <View style={styles.buttonOuterContainer}>
              <Pressable 
                style={({pressed}) =>
                  pressed && Platform.OS === 'ios'
                    ? [styles.buttonInnerContainer, styles.startGameButton, styles.pressed]
                    : [styles.buttonInnerContainer, styles.startGameButton]
                }
                onPress={null}
                android_ripple={{color: Colors.button400}}
              >
                <Text style={styles.buttonText}>Play</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Badges storedName={storedName} />
        <View style={styles.highscoreContainer}>
          <View style={styles.row}>
            <Text style={styles.heading}>Highscore Leaderboard</Text>
          </View>
          <View style={styles.rowDark}>
            <SimpleLineIcons name="badge" style={styles.firstPlace} />
            <Text style={styles.name}>SebastianB</Text>
            <Text style={styles.score}>Score: 100</Text>
          </View>
          <View style={styles.rowDark}>
            <SimpleLineIcons name="badge" style={styles.secondPlace} />
            <Text style={styles.name}>Mina Miau</Text>
            <Text style={styles.score}>Score: 88</Text>
          </View>
          <View style={styles.rowDark}>
            <SimpleLineIcons name="badge" style={styles.thirdPlace} />
            <Text style={styles.name}>Bob</Text>
            <Text style={styles.score}>Score: 83</Text>
          </View>
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
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray400,
    padding: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
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
    fontSize: 36,
    marginLeft: 12
  },
  rowDark: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    backgroundColor: Colors.gray150,
    alignSelf: 'stretch',
    borderRadius: 8
  },
  firstPlace: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 30,
    color: Colors.gold
  },
  secondPlace: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 30,
    color: Colors.silver
  },
  thirdPlace: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 30,
    color: Colors.bronze
  },
  name: {
    flex: 5,
    fontSize: 20
  },
  score: {
    flex: 4,
    fontSize: 20
  },
  highscoreContainer: {
    flex: 4,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  heading: {
    fontSize: 20
  },
  buttonOuterContainer: {
    borderRadius: 6,
    overflow: 'hidden'
  },
  buttonInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  pressed: {
    opacity: 0.75
  },
  changeNameButton: {
    backgroundColor: Colors.button100
  },
  startGameButton: {
    backgroundColor: Colors.button300,
    marginLeft: 30
  },
  buttonText: {
    color: 'white',
    fontSize: 24
  }
});