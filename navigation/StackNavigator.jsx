import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";

const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
