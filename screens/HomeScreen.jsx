import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import DisableKeyBoardHOC from "../components/DisableKeyBoardHOC";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { debounce } from "lodash";
import { fetchForecastData, fetchLocationsData } from "../api/weather";
import { getData, storeData } from "../utils/asyncStorage";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLocation = (location) => {
    console.log(location);
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    fetchForecastData({
      cityName: location?.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", location.name);
      console.log("get data", data);
    });
  };

  const handleSearch = (e) => {
    if (e.length > 2) {
      fetchLocationsData({ cityName: e }).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Colombo";
    if (myCity) {
      cityName = myCity;
    }
    fetchForecastData({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <DisableKeyBoardHOC>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Image
          style={styles.imageBackground}
          source={require("../assets/home-image.jpg")}
        />

        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.searchBarContainer}>
            {showSearchBar && (
              <TextInput
                onChangeText={handleTextDebounce}
                placeholder="Search City"
                placeholderTextColor={"gray"}
                style={[
                  styles.searchInput,
                  { backgroundColor: showSearchBar ? "#F8F8F8" : null },
                ]}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowSearchBar(!showSearchBar)}
              style={styles.iconContainer}
            >
              {showSearchBar ? (
                <Entypo name="cross" size={24} color="black" />
              ) : (
                <Feather
                  style={styles.searchIcon}
                  name="search"
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
            {locations?.length > 0 && showSearchBar && (
              <View style={styles.locationsContainer}>
                {locations?.map((location, index) => {
                  let showBottomBorder = index + 1 != locations.length;
                  let borderClass = showBottomBorder ? 2 : 0;
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(location)}
                      style={[
                        styles.locationTouch,
                        { borderBottomWidth: borderClass },
                      ]}
                      key={index}
                    >
                      <FontAwesome5 name="map-pin" size={24} color="#A80000" />
                      <Text style={styles.locationText}>
                        {location?.name}, {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          {loading ? (
            <ActivityIndicator
              style={styles.loadingState}
              size={80}
              color={"white"}
            />
          ) : (
            <View style={styles.forecastContainer}>
              <View style={styles.forecastTextContainer}>
                <Text style={styles.forecastTextHeadline}>
                  {location?.name} {"   "}
                  <Text style={styles.forecastTextSubHeading}>
                    {location?.country}
                  </Text>
                </Text>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: `https:` + current?.condition?.icon }}
                />
              </View>
              <View style={styles.degreeContainer}>
                <Text style={styles.degreeText}>{current?.temp_c}&#176;</Text>
                <Text style={styles.degreeWheather}>
                  {current?.condition?.text}
                </Text>
              </View>

              <View style={styles.otherStatesContainer}>
                <View style={styles.otherStatesValues}>
                  <Image
                    style={styles.otherStatesIcon}
                    source={require("../assets/icons/wind.png")}
                  />
                  <Text style={styles.otherStatesText}>
                    {current?.wind_kph}km
                  </Text>
                </View>
                <View style={styles.otherStatesValues}>
                  <Image
                    style={styles.otherStatesIcon}
                    source={require("../assets/icons/drop.png")}
                  />
                  <Text style={styles.otherStatesText}>
                    {current?.humidity}%
                  </Text>
                </View>
                <View style={styles.otherStatesValues}>
                  <Image
                    style={styles.otherStatesIcon}
                    source={require("../assets/icons/sun.png")}
                  />
                  <Text style={styles.otherStatesText}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>

              <View style={styles.dailyForcastContainer}>
                <View style={styles.dailyForecastHeadlin}>
                  <AntDesign name="calendar" size={24} color="white" />
                  <Text style={styles.dailyForecastText}>Daily Forecast</Text>
                </View>

                <ScrollView
                  contentContainerStyle={{
                    paddingHorizontal: 15,
                  }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date);
                    let options = { weekday: "long" };
                    let dayName = date.toLocaleDateString("en-US", options);
                    return (
                      <View
                        key={index}
                        style={styles.forecastForNextDaysContainer}
                      >
                        <Image
                          style={styles.forecastForNextDaysImages}
                          source={{
                            uri: `https:` + item?.day?.condition?.icon,
                          }}
                        />
                        <Text style={styles.forecastDays}>{dayName}</Text>
                        <Text style={styles.forecastForNextDaysDegree}>
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    </DisableKeyBoardHOC>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  imageBackground: {
    position: "absolute",
    height: "100%",
    width: width,
    resizeMode: "cover",
  },
  safeAreaView: {
    flex: 1,
  },
  searchBarContainer: {
    position: "relative",
    marginTop: 100,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  searchInput: {
    width: "100%",
    borderRadius: 20,
    zIndex: 99,
  },

  iconContainer: {
    position: "absolute",
    right: 1,
    backgroundColor: "#D2C9BE",
    borderRadius: 50,
    padding: 17,
    zIndex: 99,
  },
  locationsContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#E4E6E8",
    top: 65,
    left: 15,
    borderRadius: 20,
    minHeight: "auto",
    zIndex: 99,
  },
  locationTouch: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    paddingHorizontal: 10,
    marginVertical: 10,

    columnGap: 15,
  },
  locationText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  forecastContainer: {
    marginHorizontal: 4,
    flex: 1,
    marginBottom: 2,
    justifyContent: "center",
  },
  forecastTextHeadline: {
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
  },
  forecastTextSubHeading: {
    fontSize: 20,
    color: "#DDDDDD",
    fontWeight: "bold",
  },
  forecastTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  imageContainer: {
    marginHorizontal: "auto",
  },
  image: {
    width: 250,
    height: 250,
  },
  degreeContainer: {
    flexDirection: "column",
    alignItems: "center",
    rowGap: 10,
    marginTop: 30,
  },
  degreeText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 80,
    textAlign: "center",
  },
  degreeWheather: {
    color: "#DDDDDD",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  otherStatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 100,
    marginTop: 30,
    marginHorizontal: "auto",
  },
  otherStatesValues: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 7,
  },
  otherStatesIcon: {
    width: 20,
    height: 20,
  },
  otherStatesText: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
  },
  dailyForcastContainer: {
    flexDirection: "column",
    rowGap: 20,
    marginLeft: 30,
    marginTop: 70,
  },
  dailyForecastHeadlin: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  dailyForecastText: {
    fontWeight: "bold",
    color: "white",
  },
  forecastForNextDaysContainer: {
    borderRadius: 20,
    backgroundColor: "#F0EBE4",
    padding: 10,
    width: 120,
    height: 150,
    flexDirection: "column",
    rowGap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  forecastForNextDaysImages: {
    width: 50,
    height: 50,
  },
  forecastDays: {
    fontWeight: "bold",
    fontSize: 18,
  },
  forecastForNextDaysDegree: {
    fontWeight: "bold",
    fontSize: 17,
  },
  loadingState: {
    flex: 1,
  },
});
