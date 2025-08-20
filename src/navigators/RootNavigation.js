import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigation';
import { View } from 'react-native';
import Cms from '../Components/Cms';
const Stack = createNativeStackNavigator();

const RootNavigation = () => {
    return (
        <>
            <Stack.Navigator
                initialRouteName="BottomNavigation"
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
                <Stack.Screen name="Cms" component={Cms} />


            </Stack.Navigator>
            <View style={{ marginBottom: 50 }}>
            </View>
        </>
    );
};

export default RootNavigation;
