import { StyleSheet, View, Text } from 'react-native';

import Colors from '../constants/colors';

function GameScreen() {
    
    return(
        <View style={styles.container}>
            <View style={styles.inner}>
                <Text>GameScreen</Text>
            </View>
        </View>
    );
}

export default GameScreen;

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
    }
});