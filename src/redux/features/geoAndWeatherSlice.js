import { createSlice, createAsyncThunk } from "../../imports/Redux-Imports";
import { axios, moment } from "../../imports/Other-Imports";

export const fetchGeoAndWeather = createAsyncThunk(
  "fetchAPI/geo&weather",
  async (payload) => {
    const { urlInfo, controller } = payload;

    // GET WEATHER DATA:
    async function getWeatherData(locationObj) {
      const { countryCode, cityName } = locationObj;

      // Requesting city info in current language from "Geocoding API":
      const GEOCODING_ENDPOINT = `https://api.geoapify.com/v1/geocode/search?country=${countryCode}&city=${cityName}&lang=${urlInfo.lang}&format=json&limit=1&apiKey={YOUR API KEY}`;
      const res = await axios.get(GEOCODING_ENDPOINT, {
        signal: controller.signal,
      });

      // EXTRACTING GEOCODE DATA:
      const geoRes = res.data.results[0],
        geocode = {
          lat: geoRes.lat,
          lon: geoRes.lon,
        };

      // Requesting weather data based on geocode data from "Current Weather Data API":
      const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?lang=${urlInfo.lang}&units=${urlInfo.unit}&lat=${geocode.lat}&lon=${geocode.lon}&appid={YOUR API KEY}`;
      const response = await axios.get(WEATHER_ENDPOINT, {
        signal: controller.signal,
      });

      //   EXTRACTING THE FINAL DATA:
      const weatherRes = response.data,
        geoDataToDisplay = {
          countryName: geoRes.country,
          stateName: geoRes.state,
          cityName: geoRes.city,
        },
        geoDataForBackEnd = {
          countryCode,
          cityName,
          timezone: geoRes.timezone.name,
        };

      return { weatherRes, geoDataToDisplay, geoDataForBackEnd };
    }

    // GET THE INITIAL LOCATION FIRST AND THEN GET THE WEATHER DATA:
    async function getInitialLocationFirst() {
      // Requesting initial location from "IP Geolocation API":
      const GEOLOCATION_ENDPOINT = `https://api.geoapify.com/v1/ipinfo?apiKey={YOUR API KEY}`;
      const res = await axios.get(GEOLOCATION_ENDPOINT, {
        signal: controller.signal,
      });
      const location = {
        countryCode: res.data.country.iso_code,
        cityName: res.data.city.names.en,
      };

      // WEATHER DATA:
      return await getWeatherData(location);
    }

    let newPayload;

    if (urlInfo.location != null) {
      newPayload = await getWeatherData(urlInfo.location);
    } else {
      newPayload = await getInitialLocationFirst();
    }

    return newPayload;
  }
);

const fetchGeoAndWeatherSlice = createSlice({
  name: "fetchAPI",
  initialState: {
    showLoader: true,
    isError: false,
    data: {},
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGeoAndWeather.pending, (state, action) => {
        const { urlInfo } = action.meta.arg;

        if (urlInfo.type === "location") {
          const { showSnackbarAlert } = action.meta.arg;
          if (urlInfo.location != null) {
            switch (urlInfo.lang) {
              case "ar": {
                showSnackbarAlert({
                  message: `جاري البحث على ${urlInfo.location.cityName}`,
                  severity: "info",
                });
                break;
              }
              default: {
                showSnackbarAlert({
                  message: `Searching For ${urlInfo.location.cityName}`,
                  severity: "info",
                });
              }
            }
          } else {
            switch (urlInfo.lang) {
              case "ar": {
                showSnackbarAlert({
                  message: `جاري البحث على مدينتك`,
                  severity: "info",
                });
                break;
              }
              default: {
                showSnackbarAlert({
                  message: `Searching For Your City`,
                  severity: "info",
                });
              }
            }
          }
        }

        state.showLoader = true;
        state.isError = false;
      })
      .addCase(fetchGeoAndWeather.fulfilled, (state, action) => {
        const { urlInfo } = action.meta.arg,
          { geoDataToDisplay, geoDataForBackEnd, weatherRes } = action.payload,
          { countryCode, cityName, timezone } = geoDataForBackEnd;

        // PREPARE DATE AND TIME BASED ON TIMEZONE AND LANGUAGE:
        const dateLng = urlInfo.lang === "ar" ? "ar-tn" : urlInfo.lang,
          myDateMoment = moment().locale(dateLng).tz(timezone),
          myTimeMoment = moment().tz(timezone),
          date = myDateMoment.format("LL"),
          day = myDateMoment.format("dddd");
        let time = myTimeMoment.format("LT");

        if (dateLng === "ar-tn") {
          switch (time.match(/[a-zA-Z]+/)[0]) {
            case "AM":
              time = time.replace("AM", "ص");
              break;
            default:
              time = time.replace("PM", "م");
          }
        }
        const dateAndTimeData = { date, day, time };

        const newState = {
          ...geoDataToDisplay,
          stateName:
            geoDataToDisplay.stateName !== undefined
              ? `, ${geoDataToDisplay.stateName}`
              : "",
          ...dateAndTimeData,
          desc: weatherRes.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${weatherRes.weather[0].icon}@2x.png`,
          temp: Math.round(weatherRes.main.temp),
          feelsLike: Math.round(weatherRes.main.feels_like),
          hiTemp: Math.round(weatherRes.main.temp_max),
          loTemp: Math.round(weatherRes.main.temp_min),
          humidity: weatherRes.main.humidity + "%",
          pressure: weatherRes.main.pressure,
          visibility: weatherRes.visibility / 1000,
          wind:
            urlInfo.unit === "imperial"
              ? roundingFractions(weatherRes.wind.speed)
              : roundingFractions(weatherRes.wind.speed * 3.6),
        };

        // CONVERT NUMBER TO STRING & ROUND ONLY FRACTIONS WITHOUT WHOLE NUMBER:
        function roundingFractions(number) {
          const value = number + "";
          if (value.match(/(?<=\d+\.)\d+/) != null) {
            const fractions = value.match(/(?<=\d+\.)\d+/)[0];
            const separating = fractions.split("");
            separating.splice(1, 0, ".");
            const roundingUp = Math.round(+separating.join(""));
            const result = value.replace(/(?<=\d+\.)\d+/, "") + roundingUp;
            return result;
          }
          return value;
        }

        if (urlInfo.type === "location") {
          const { showSnackbarAlert } = action.meta.arg;

          switch (urlInfo.lang) {
            case "ar": {
              showSnackbarAlert({
                message: `تم العثور على ${geoDataToDisplay.cityName}`,
                duration: 2000,
              });
              break;
            }
            default: {
              showSnackbarAlert({
                message: `${geoDataToDisplay.cityName} Was Found`,
                duration: 2000,
              });
            }
          }
        }

        state.isError = false;
        state.data = newState;
        state.showLoader = false;

        const location = {
          countryCode,
          cityName,
        };
        localStorage.setItem("Location", JSON.stringify(location));
      })
      .addCase(fetchGeoAndWeather.rejected, (state, action) => {
        const { showSnackbarAlert } = action.meta.arg;

        showSnackbarAlert({
          message: action.error?.message ?? "Rejected",
          severity: "error",
          duration: 5000,
        });

        const newState = {
          desc: "Something is wrong, weather information cannot be found",
        };

        state.data = newState;
        state.isError = true;
        state.showLoader = false;
      });
  },
});

export default fetchGeoAndWeatherSlice.reducer;
