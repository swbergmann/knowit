import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

/**
 * The BadgesContainer component displays:
 * - 3 badges, each of which can be unlocked by the user by reaching a good score in the quiz.
 * 
 * Unlocking badges is achieved and described in the GameScreen component.
 * 
 * The BadgesContainer component only provides functions to check if the current player has unlocked any badges or not.
 * This is done by searching a combination of playerName + BadgeName in the storage.
 * 
 * The BadgesContainer component displays unlocked badges in a colorful styling and locked badges in a grayed-out styling.
 * 
 * Different players on the same device can have different badges unlocked.
 */

function BadgesContainer({storedName}) {
    /*
    * The prop 'storedName' (which is the player name) is received when this component is rendered.
    * However, in order to access this value whenever a function is called in the JS code,
    * we must assign it to a local variable (playerName).
    */
    const playerName = storedName;              // necessary for searching the player + badge combinatio in the storage
    const [badges, setBadges] = useState({});   // object used to store information about each of the 3 badges (unlocked or not).

    // LOAD player's badges from storage
    const getBadges = async () => {
        let badges = {};

        try { // Journalist
            let key = playerName + '-journalist';
            let badgeJournalist = await AsyncStorage.getItem(key);

            if (badgeJournalist != null) {
                badges.journalist = true;
            }
        } catch (e) {console.log(e);}

        try { // Researcher
            let key = playerName + '-researcher';
            let badgeResearcher = await AsyncStorage.getItem(key);

            if (badgeResearcher != null) {
                badges.researcher = true;
            }
        } catch (e) {console.log(e);}

        try { // Historian
            let key = playerName + '-historian';
            let badgeHistorian = await AsyncStorage.getItem(key);

            if (badgeHistorian != null) {
                badges.historian = true;
            }
        } catch (e) {console.log(e);}

        setBadges(badges); // set the new state
    };

    let historian;                      // use this variable in JSX below
    if (badges.historian === true) {    // depending if the badge is unlocked or not
        historian = (                   // apply different styling and text (colorful or grayed-out badge)
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Historian</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        historian =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Historian (90%)</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    let researcher;                     // use this variable in JSX below
    if (badges.researcher === true) {   // depending if the badge is unlocked or not
        researcher = (                  // apply different styling and text (colorful or grayed-out badge)
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Researcher</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        researcher =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Researcher (70%)</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    let journalist;                     // use this variable in JSX below
    if (badges.journalist === true) {   // depending if the badge is unlocked or not
        journalist = (                  // apply different styling and text (colorful or grayed-out badge)
        <>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
            <Text style={styles.badgeTextUnlocked}>Journalist</Text>
            <FontAwesome name="star" style={styles.badgeIconUnlocked} />
        </>);
    } else { 
        journalist =  (
        <>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Journalist (50%)</Text>
            <FontAwesome name="star-o" style={styles.badgeIcon} />
        </>
    )};

    useEffect(() => {
        getBadges(playerName);
    }, []); // query the badges from storage only on the first loading of the component
    
    return(
        <View style={styles.badgesContainer}>
            <View style={styles.row}>
                <Text style={styles.badges}>Badges</Text>
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
        </View>
    );
}

export default BadgesContainer;

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    introduction: {
        fontSize: Fonts.text
    },
    badgesContainer: {
        flex: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: Colors.gray400
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
        fontSize: Fonts.h3,
        marginHorizontal: 20,
        color: Colors.gray400
    },
    badgeTextUnlocked: {
        fontSize: Fonts.h3,
        marginHorizontal: 20
    },
    badges: {
        fontSize: Fonts.h3
    }
  });