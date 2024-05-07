import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/colors';

function Badges({storedName}) {
    console.log("Badges");
    console.log(storedName);
    /* assign storedName to const 
    * to make it accessible in this function
    * to be used whenever needed in the JS code
    */
    const playerName = storedName;
    
    const [badges, setBadges] = useState({});

    /**
    * Every time a game finishes, the badges of the player are updated
    * If players finish their first game (no matter how low the achieved score is)
    * they unlock the *Journalist* badge.
    * If their game score is > 75% they unlock the *Researcher* badge.
    * If their game score is > 90% they unlock the *Historian* badge.
    * 
    * Each badge becomes visible (or unlocked) because an entry is made in 
    * the local storage in the form of a key-value pair
    * i.e. "{name}-journalist": true
    * 
    * In this way various players each have their individual state of badges.
    */

    const getBadges = async () => {
        console.log("getBadges----");
        let badges = {};

        try { // Journalist
            let key = playerName + '-journalist';
            console.log("key " + key);
            let badgeJournalist = await AsyncStorage.getItem(key);
            console.log("badgeJournalist " + badgeJournalist);
            if (badgeJournalist !== null) {
                badges.journalist = true;
            }
        } catch (e) {console.log(e);}

        try { // Researcher
            let key = storedName + '-researcher';
            let badgeResearcher = await AsyncStorage.getItem(key);
            console.log("badgeResearcher " + badgeResearcher);
            if (badgeResearcher !== null) {
                badges.researcher = true;
            }
        } catch (e) {console.log(e);}

        try { // Historian
            let key = storedName + '-historian';
            let badgeHistorian = await AsyncStorage.getItem(key);
            console.log("badgeHistorian " + badgeHistorian);
            if (badgeHistorian !== null) {
                badges.historian = true;
            }
        } catch (e) {console.log(e);}

        setBadges(badges);
    };

    console.log("badges.historian " + badges.historian);
    if (badges.historian === true) {
        historian = (
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Historian</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        historian =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Historian</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    console.log("badges.researcher " + badges.researcher);
    if (badges.researcher === true) {
        researcher = (
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Researcher</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        researcher =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Researcher</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    console.log("badges.journalist " + badges.journalist);
    if (badges.journalist === true) {
        journalist = (
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Journalist</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        journalist =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Journalist</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    const addBadge = async () => {
        console.log("addBadge++++++");
        let key = playerName + "-researcher";
        console.log("addBadge key: " + key);
        try {
          await AsyncStorage.setItem(key, "true");
        } catch (e) {console.log(e);}
        getBadges(playerName);
    };

    useEffect(() => {
        getBadges(playerName);
    }, []);
    
    return(
        <View style={styles.badgesContainer}>
          <View style={styles.row}>
            <Text style={styles.introduction}>Play the game to unlock badges.</Text>
          </View>
          <View style={styles.row}>
              {historian}
          </View>
          <View style={styles.row}>
              {researcher}
          </View>
          <View style={styles.row}>
              {journalist}
          </View>
          <Pressable onPress={addBadge}>
            <Text>Test</Text>
          </Pressable>
        </View>
    );
}

export default Badges;

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8
    },
    introduction: {
      fontSize: 20
    },
    badgesContainer: {
      flex: 4,
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomWidth: 2,
      borderBottomColor: Colors.gray400,
      padding: 20
    },
    badgeIcon: {
      fontSize: 30,
      color: Colors.gray400
    },
    badgeIconUnlocked: {
        fontSize: 30,
        color: Colors.gold
    },
    badgeText: {
      fontSize: 24,
      marginHorizontal: 20,
      color: Colors.gray400
    },
    badgeTextUnlocked: {
      fontSize: 24,
      marginHorizontal: 20
    }
  });