import { StyleSheet, View } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function pushEventsTaskRegister(){
return (
<View style={{ ...styles.container }}>
    <Text variant='titleLarge'>pushEventsTaskRegister</Text>
</View>
);
}
const styles = StyleSheet.create({
container:{
  justifyContent: 'center',
  alignItems: 'center',
}
})
