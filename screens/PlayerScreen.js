import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text, Pressable, Image, Platform } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';
import BadgesContainer from '../components/BadgesContainer';
import HighscoreContainer from '../components/HighscoreContainer';

function PlayerScreen({onRemove, onGetName, storedName, onPlay}) {

  console.log("PlayerScreen storedName");
  console.log(storedName);
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
                onPress={onPlay}
                android_ripple={{color: Colors.button400}}
              >
                <Text style={styles.buttonText}>Play</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <BadgesContainer storedName={storedName} />

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