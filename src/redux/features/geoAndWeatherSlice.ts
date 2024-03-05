import { createSlice, createAsyncThunk } from "../../imports/Redux-Imports";
import { axios, moment } from "../../imports/Other-Imports";
import { UrlContext, Location } from "../../contexts/UrlInfoContext";
import { ShowSnackbarAlertProps } from "../../contexts/SnackbarContext";

// ===== [ INTERFACE DECLARATIONS ] ===== //
export interface AsyncThunkPayload {
  controller: AbortController;
  urlInfo: UrlContext["urlInfo"];
  showSnackbarAlert: (config: ShowSnackbarAlertProps) => void;
}

interface GeoRes {
  datasource: {
    sourcename: string;
    attribution: string;
    license: string;
    url: string;
  };
  name: string;
  country: string;
  country_code: string;
  state: string;
  county: string;
  city: string;
  postcode: string;
  lon: number;
  lat: number;
  result_type: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: {
    name: string;
    offset_STD: string;
    offset_STD_seconds: number;
    offset_DST: string;
    offset_DST_seconds: number;
  };
  plus_code: string;
  rank: {
    importance: number;
    popularity: number;
    confidence: number;
    confidence_city_level: number;
    match_type: string;
  };
  place_id: string;
  bbox: {
    lon1: number;
    lat1: number;
    lon2: number;
    lat2: number;
  };
}

interface WeatherRes {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface AsyncThunkReturn {
  weatherRes: WeatherRes;
  geoDataToDisplay: {
    countryName: string;
    stateName: string;
    cityName: string;
  };
  geoDataForAPIOperation: {
    countryCode: string;
    cityName: string;
    timezone: string;
  };
}

interface InitialState {
  showLoader: boolean;
  isError: boolean;
  data: {
    desc: string;
    icon?: string;
    temp?: number;
    feelsLike?: number;
    hiTemp?: number;
    loTemp?: number;
    humidity?: string;
    pressure?: number;
    visibility?: number;
    wind?: string;
    date?: string;
    day?: string;
    time?: string;
    stateName?: string;
    countryName?: string;
    cityName?: string;
  };
}

// ===== [ INITIAL STATE ] ===== //
const initialState: InitialState = {
  showLoader: true,
  isError: false,
  data: {
    desc: "",
  },
};

export const fetchGeoAndWeather = createAsyncThunk(
  "fetchAPI/geo&weather",
  async (payload: AsyncThunkPayload): Promise<AsyncThunkReturn> => {
    const { urlInfo, controller } = payload;

    // GET WEATHER DATA:
    async function getWeatherData(locationObj: Location) {
      const { countryCode, cityName } = locationObj;

      // Requesting city info in current language from "Geocoding API":
      const GEOCODING_ENDPOINT = `https://api.geoapify.com/v1/geocode/search?country=${countryCode}&city=${cityName}&lang=${
        urlInfo!.lang
      }&format=json&limit=1&apiKey=f1b980d800e544268e6fb62c3bbff8cb`;
      const res = await axios.get(GEOCODING_ENDPOINT, {
        signal: controller.signal,
      });

      // EXTRACTING GEOCODE DATA:
      const geoRes: GeoRes = res.data.results[0],
        geocode = {
          lat: geoRes.lat,
          lon: geoRes.lon,
        };

      // Requesting weather data based on geocode data from "Current Weather Data API":
      const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?lang=${
        urlInfo!.lang
      }&units=${urlInfo!.unit}&lat=${geocode.lat}&lon=${
        geocode.lon
      }&appid=d96362a9b6e27c0fd1d00442679050ae`;
      const response = await axios.get(WEATHER_ENDPOINT, {
        signal: controller.signal,
      });

      //   EXTRACTING THE FINAL DATA:
      const weatherRes: WeatherRes = response.data,
        geoDataToDisplay = {
          countryName: geoRes.country,
          stateName: geoRes.state,
          cityName: geoRes.city,
        },
        geoDataForAPIOperation = {
          countryCode,
          cityName,
          timezone: geoRes.timezone.name,
        };

      return { weatherRes, geoDataToDisplay, geoDataForAPIOperation };
    }

    // GET THE INITIAL LOCATION FIRST AND THEN GET THE WEATHER DATA:
    async function getInitialLocationFirst() {
      // Requesting initial location from "IP Geolocation API":
      const GEOLOCATION_ENDPOINT = `https://api.geoapify.com/v1/ipinfo?apiKey=f1b980d800e544268e6fb62c3bbff8cb`;
      const res = await axios.get(GEOLOCATION_ENDPOINT, {
        signal: controller.signal,
      });
      const location: Location = {
        countryCode: res.data.country.iso_code,
        cityName: res.data.city.names.en,
      };

      // WEATHER DATA:
      return await getWeatherData(location);
    }

    let newPayload;

    if (urlInfo!.location != null) {
      newPayload = await getWeatherData(urlInfo!.location);
    } else {
      newPayload = await getInitialLocationFirst();
    }

    return newPayload;
  }
);

const fetchGeoAndWeatherSlice = createSlice({
  name: "fetchAPI",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGeoAndWeather.pending, (state, action) => {
        const { urlInfo } = action.meta.arg;

        if (urlInfo!.type === "location") {
          const { showSnackbarAlert } = action.meta.arg;
          if (urlInfo!.location != null) {
            switch (urlInfo!.lang) {
              case "ar": {
                showSnackbarAlert({
                  message: `جاري البحث على ${urlInfo!.location.cityName}`,
                  severity: "info",
                  duration: 10000,
                });
                break;
              }
              default: {
                showSnackbarAlert({
                  message: `Searching For ${urlInfo!.location.cityName}`,
                  severity: "info",
                  duration: 10000,
                });
              }
            }
          } else {
            switch (urlInfo!.lang) {
              case "ar": {
                showSnackbarAlert({
                  message: `جاري البحث على مدينتك`,
                  severity: "info",
                  duration: 10000,
                });
                break;
              }
              default: {
                showSnackbarAlert({
                  message: `Searching For Your City`,
                  severity: "info",
                  duration: 10000,
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
          { geoDataToDisplay, geoDataForAPIOperation, weatherRes } =
            action.payload,
          { countryCode, cityName, timezone } = geoDataForAPIOperation;

        // PREPARE DATE AND TIME BASED ON TIMEZONE AND LANGUAGE:
        const dateLang = urlInfo!.lang === "ar" ? "ar-tn" : urlInfo!.lang,
          myMoment: moment.Moment = moment().tz(timezone),
          day: string = myMoment.locale(dateLang).format("dddd");

        let time: string = myMoment.locale("en").format("LT"),
          date: string = myMoment.locale(dateLang).format("LL");

        if (dateLang === "ar-tn") {
          switch (time.match(/[a-zA-Z]+/)![0]) {
            case "AM":
              time = time.replace("AM", "ص");
              break;
            default:
              time = time.replace("PM", "م");
          }

          const tn_month: string = myMoment.locale("ar-tn").format("MMMM"),
            sa_month: string = myMoment.locale("ar-sa").format("MMMM");

          date = date.replace(tn_month, sa_month);
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
            urlInfo!.unit === "imperial"
              ? roundingFractions(weatherRes.wind.speed)
              : roundingFractions(weatherRes.wind.speed * 3.6),
        };

        // CONVERT NUMBER TO STRING & ROUND ONLY FRACTIONS WITHOUT WHOLE NUMBER:
        function roundingFractions(number: number): string {
          const value: string = number + "";
          if (value.match(/(?<=\d+\.)\d+/) != null) {
            const fractions: string = value.match(/(?<=\d+\.)\d+/)![0],
              separating: string[] = fractions.split("");
            separating.splice(1, 0, ".");
            const roundingUp: number = Math.round(+separating.join("")),
              result: string = value.replace(/(?<=\d+\.)\d+/, "") + roundingUp;
            return result;
          }
          return value;
        }

        if (urlInfo!.type === "location") {
          const { showSnackbarAlert } = action.meta.arg;

          switch (urlInfo!.lang) {
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
