import { StyleSheet, Text, TextInput, View, Image, Pressable } from 'react-native';

function StartScreen({onInputChange, onPress}) {
    return (
        <View style={styles.container}>
          <Image 
            source={require('../assets/undraw/welcome_cats.png')}
            style={styles.welcomeImage}
            resizeMode='contain'
          />

          <Text style={styles.question}>What's your name?</Text>
          
          <TextInput 
            style={styles.input}
            onChangeText={onInputChange}
          />
    
          <Pressable 
            style={styles.button}
            onPress={onPress}
          >
            <Text style={styles.white}>Save my name!</Text>
          </Pressable>    
        </View>
    );
}

export default StartScreen;

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
      borderColor: '#575DD9',
      alignSelf: 'stretch',
      margin: 32,
      height: 64,
      borderRadius: 6,
      paddingHorizontal: 16,
      fontSize: 24
    },
    button: {
      backgroundColor: '#575DD9',
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