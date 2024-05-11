import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';

function HighscoreContainer() {
    const [highscores, setHighscores] = useState({});

    console.log('HighscoreContainer');

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

    // LOAD highscore from storage
    const getHighscores = async () => {
        let scores = {};

        try {
            let firstScore = await AsyncStorage.getItem('first_score');
            console.log('getHighscores firstScore');
            console.log(firstScore);

            if (firstScore != null) {
                scores.first_score = firstScore;
            }
        } catch (e) {console.log(e);}

        try {
            let firstName = await AsyncStorage.getItem('first_name');
            if (firstName != null) {
                scores.first_name = firstName;
            }
        } catch (e) {console.log(e);}

        try {
            let secondScore = await AsyncStorage.getItem('second_score');
            if (secondScore != null) {
                scores.second_score = secondScore;
            }
        } catch (e) {console.log(e);}

        try {
            let secondName = await AsyncStorage.getItem('second_name');
            if (secondName != null) {
                scores.second_name = secondName;
            }
        } catch (e) {console.log(e);}

        try {
            let thirdScore = await AsyncStorage.getItem('third_score');
            if (thirdScore != null) {
                scores.third_score = thirdScore;
            }
        } catch (e) {console.log(e);}

        try {
            let thirdName = await AsyncStorage.getItem('third_name');
            if (thirdName != null) {
                scores.third_name = thirdName;
            }
        } catch (e) {console.log(e);}

        setHighscores(scores);
    };

    // initiate as empty string and empty views
    let noHighscoresMessage = "";
    let highscoreFirstPlace = <View></View>;
    let highscoreSecondPlace = <View></View>;
    let highscoreThirdPlace = <View></View>;

    // override with data, if data is stored
    if ((highscores.first_score != null) && (highscores.first_name != null)) {
        highscoreFirstPlace = (
            <View style={styles.rowDark}>
                <SimpleLineIcons name="badge" style={styles.firstPlace} />
                <Text style={styles.name}>{highscores.first_name}</Text>
                <Text style={styles.score}>Score: {highscores.first_score}</Text>
            </View>);
    } else {
        // if no highscore exists, append this text to the heading
        noHighscoresMessage = "not available. Play the game to create the first highscore.";
    }

    if ((highscores.second_score != null) && (highscores.second_name != null)) {
        highscoreSecondPlace = (
            <View style={styles.rowDark}>
                <SimpleLineIcons name="badge" style={styles.secondPlace} />
                <Text style={styles.name}>{highscores.second_name}</Text>
                <Text style={styles.score}>Score: {highscores.second_score}</Text>
            </View>);
    }

    if ((highscores.third_score != null) && (highscores.third_name != null)) {
        highscoreThirdPlace = (
            <View style={styles.rowDark}>
                <SimpleLineIcons name="badge" style={styles.thirdPlace} />
                <Text style={styles.name}>{highscores.third_name}</Text>
                <Text style={styles.score}>Score: {highscores.third_score}</Text>
            </View>);
    }

    useEffect(() => {
        getHighscores();
        console.log('useEffect()');
    }, []);

    return(
        <View style={styles.highscoreContainer}>
            <View style={styles.row}>
                <Text style={styles.heading}>Highscore Leaderboard {noHighscoresMessage}</Text>
            </View>
            {highscoreFirstPlace}
            {highscoreSecondPlace}
            {highscoreThirdPlace}
        </View>
    );
}

export default HighscoreContainer;

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8
    },
    rowDark: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
      backgroundColor: Colors.gray150,
      alignSelf: 'stretch',
      borderRadius: 8,
      maxHeight: 54
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
    }
  });