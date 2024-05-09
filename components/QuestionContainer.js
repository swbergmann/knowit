import { StyleSheet, View, Text, FlatList } from 'react-native';

function QuestionContainer({text, hint}) {
    return(
        <View>
            <View>
                <Text>{text}</Text>
            </View>
            <View>
                <Text>{hint}</Text>
            </View>
        </View>
    );
}

export default QuestionContainer;