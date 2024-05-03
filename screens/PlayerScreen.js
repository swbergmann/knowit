import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SimpleLineIcons } from "@expo/vector-icons";

import Colors from '../constants/colors';

function PlayerScreen({onRemove, onGetName}) {
  function eraseHandler() {
    onRemove();
    onGetName(); // update storedName to switch screens
    // setUserInput("");
  }
  return (
    <View>
      <Text>On PlayerScreen now.</Text>

      <Pressable 
          style={styles.button}
          onPress={eraseHandler}
      >
        <SimpleLineIcons name='logout' color='white'/>
        <Text style={styles.white}>Erase my name!</Text>
      </Pressable>
    </View>
  );
}

export default PlayerScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    welcomeImage: {
      width: '100%',
      height: 210,
      marginTop: 70
    },
    question: {
      fontSize: 24,
      fontWeight: '300'
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.primary300,
      alignSelf: 'stretch',
      margin: 32,
      height: 64,
      borderRadius: 6,
      paddingHorizontal: 16,
      fontSize: 24
    },
    button: {
      backgroundColor: Colors.primary300,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
      paddingVertical: 12,
      paddingHorizontal: 32,
      marginTop: 32,
      marginHorizontal: 32,
      borderRadius: 6
    },
    white: {
      color: 'white',
      fontSize: 18
    }
});