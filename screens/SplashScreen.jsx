import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Home");
    }, 1000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/weather-splash.png")}
      />
      <Text style={styles.text}>Weather Forecast</Text>
      <Text style={styles.subText}>Get Daily Weather Details</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 200,
  },
  text: {
    fontWeight: "bold",
    fontSize: 45,
    marginTop: 50,
  },
  subText: {
    fontWeight: "500",
    fontSize: 18,
    marginTop: 10,
    color: "gray",
  },
});
