import axios from "axios";

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_API_KEY}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;

const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${process.env.EXPO_PUBLIC_API_KEY}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.error("Error", err);
    return null;
  }
};

export const fetchForecastData = (params) => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
};
export const fetchLocationsData = (params) => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
};
