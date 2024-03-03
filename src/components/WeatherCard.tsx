import "../styles/weatherCard.css";
import * as MUI from "../imports/MUI-Imports";
import MenuButton from "./options/MenuButton";
import { useUrlInfo } from "../contexts/UrlInfoContext";
import { useMemo, useEffect } from "../imports/React-Imports";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useTranslation } from "../imports/Other-Imports";
import {
  fetchGeoAndWeather,
  AsyncThunkPayload,
} from "../redux/features/geoAndWeatherSlice";
import { useSnackbar } from "../contexts/SnackbarContext";
import "moment/min/locales";
import errorImg from "../assets/notFound.jpg";

export default function WeatherCard() {
  // ===== [ CUSTOM HOOKS ] ===== //
  const { urlInfo } = useUrlInfo();
  const { t, i18n } = useTranslation();
  const { showSnackbarAlert } = useSnackbar();

  // ===== [ REDUX HOOKS ] ===== //
  const showLoader = useAppSelector((state) => state.geoAndWeather.showLoader);
  const isError = useAppSelector((state) => state.geoAndWeather.isError);
  const data = useAppSelector((state) => state.geoAndWeather.data);
  const dispatch = useAppDispatch();

  // ===== [ SIDE EFFECTS ] ===== //
  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchGeoAndWeather({
        controller,
        urlInfo,
        showSnackbarAlert,
      } as AsyncThunkPayload)
    );

    return () => {
      controller.abort();
    };
    // The comment below disables ESLint (don't remove it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlInfo]);

  const dynamicSign = useMemo(() => {
    switch (urlInfo!.unit) {
      case "metric":
        return "°C";
      case "imperial":
        return "°F";
      default:
        return "°K";
    }
    // The comment below disables ESLint (don't remove it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlInfo!.unit]);

  return (
    <div className="weather-card" dir={i18n.dir(i18n.language)}>
      {!isError ? (
        <>
          {/* ===== [ LOADER ] ===== */}
          {showLoader && (
            <span
              className="loader"
              style={{ margin: "150px 0", display: "inline-block" }}
            ></span>
          )}

          {/* ===== [ CONTENT ] ===== */}
          {!showLoader && (
            <>
              <div className="weather-card-header border-bottom">
                <div className="location-and-date-container">
                  <div className="location-container">
                    <MUI.Typography
                      variant="h4"
                      className="city-name"
                      sx={{ pb: i18n.language === "ar" ? "6px" : "0px" }}
                    >
                      {data.cityName}
                    </MUI.Typography>
                    <MUI.Typography>
                      {data.countryName}
                      {data.stateName}
                    </MUI.Typography>
                  </div>

                  <div className="date-container">
                    <MUI.Typography className="date">
                      {data.date}
                    </MUI.Typography>
                    <MUI.Typography>
                      {data.day}, {data.time}
                    </MUI.Typography>
                  </div>
                </div>

                <MenuButton />
              </div>

              <div className="weather-card-content">
                <div className="main-temp-and-thumbnail">
                  <img src={data.icon} alt="Weather-Thumbnail" />
                  <div className="main-temp ltr">
                    <MUI.Typography variant="h3">{data.temp}</MUI.Typography>
                    <span className="main-temp-unit">{dynamicSign}</span>
                  </div>
                </div>

                <div className="description-and-feels-like">
                  <MUI.Typography className="regular-font">
                    {data.desc}
                  </MUI.Typography>
                  <MUI.Typography className="regular-font">
                    {t("Feels Like")}{" "}
                    <span className="ltr">
                      {data.feelsLike}
                      {dynamicSign}
                    </span>
                  </MUI.Typography>
                </div>
              </div>

              <div className="weather-card-details regular-font">
                <div className="start-details-container">
                  <div className="high-temp border-bottom">
                    <MUI.Typography>{t("High")}</MUI.Typography>
                    <span className="ltr">
                      {data.hiTemp}
                      {dynamicSign}
                    </span>
                  </div>

                  <div className="low-temp border-bottom">
                    <MUI.Typography>{t("Low")}</MUI.Typography>
                    <span className="ltr">
                      {data.loTemp}
                      {dynamicSign}
                    </span>
                  </div>

                  <div className="humidity">
                    <MUI.Typography>{t("Humidity")}</MUI.Typography>
                    <span>{data.humidity}</span>
                  </div>
                </div>

                <div className="end-details-container">
                  <div className="visibility border-bottom">
                    <MUI.Typography>{t("Visibility")}</MUI.Typography>
                    <span className="ltr">{data.visibility} km</span>
                  </div>

                  <div className="wind border-bottom">
                    <MUI.Typography>{t("Wind")}</MUI.Typography>
                    <span className="ltr">
                      {dynamicSign === "°F"
                        ? data.wind + " mph"
                        : data.wind + " km/h"}
                    </span>
                  </div>

                  <div className="pressure">
                    <MUI.Typography>{t("Pressure")}</MUI.Typography>
                    <span className="ltr">{data.pressure} mb</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* ===== [ ERROR CONTENT ] ===== */}
          <MUI.Typography>{t(data.desc)}</MUI.Typography>
          <img
            src={errorImg}
            alt="Error Thumbnail"
            style={{ width: "51.5%" }}
          />
        </>
      )}
    </div>
  );
}
