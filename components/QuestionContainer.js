import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Colors from '../constants/colors';

function QuestionContainer({text, hint}) {
    const [count, setCount] = useState(100);

    let width = count;
    console.log('QuestionContainer');
    console.log(count);
    console.log(width);
    
    function barInnerStyle() {
        console.log('barInnerStyle');

        let newColor;
        let newWidth = width + '%';

        if (width > 60) {
            newColor = 'green';
        } else if (width > 30) {
            newColor = Colors.gold;
        } else {
            newColor = 'red';
        }

        return {
            backgroundColor: newColor,
            width: newWidth
        }
    }

    useEffect(() => {
        count > 0 && setTimeout(() => setCount(count - 1), 1000);
    }, [count]);

    return(
        <View>
            <Text>Points to earn: {count}</Text>
            <View style={styles.barOuter}>
                <View style={barInnerStyle()}>
                    <Text></Text>
                </View>
            </View>
            <View>
                <Text>TEST</Text>
                <Text>{text}</Text>
            </View>
            <View>
                <Text>{hint}</Text>
            </View>
        </View>
    );
}

export default QuestionContainer;

const styles = StyleSheet.create({
    barOuter: {
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.gray600,
        backgroundColor: 'white',
        alignSelf: 'stretch',
        marginHorizontal: 0,
        marginVertical: 0,
        padding: 0,
        maxWidth: '98%',
        overflow: 'hidden',
        backgroundColor: Colors.gray600
    }
});