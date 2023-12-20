import { createSlice } from "../../imports/Redux-Imports";

const menuOptionsSlice = createSlice({
  name: "menuOptions",
  initialState: {
    options: {
      openLocation: false,
      openRadio: false,
    },
  },
  reducers: {
    click: (state, action) => {
      const { clickedFrom } = action.payload;

      switch (clickedFrom) {
        case "Loca": {
          state.options = {
            openRadio: false,
            openLocation: true,
            location: null,
          };
          break;
        }
        case "Unit": {
          const newState = {
            openLocation: false,
            openRadio: true,
            title: "Units",
            options: [
              { label: "°C | km/h", value: "metric" },
              { label: "°F | mph", value: "imperial" },
              { label: "°K | km/h", value: "standard" },
            ],
            selectedValue: localStorage.getItem(clickedFrom) ?? "metric",
          };
          state.options = newState;
          break;
        }
        case "Lang": {
          const { currentLang, t } = action.payload;
          const selectedValue =
            currentLang === "en" || currentLang === "ar"
              ? currentLang
              : "default";

          const newState = {
            openLocation: false,
            openRadio: true,
            title: "Language | اللغة",
            options: [
              { label: t("Default"), value: "default" },
              { label: "English", value: "en" },
              { label: "عربي", value: "ar" },
            ],
            selectedValue,
          };
          state.options = newState;
          break;
        }
        default:
          throw new Error(`"${clickedFrom}" is Unknown Action`);
      }
    },

    closeLocation: (state, action) => {
      state.options = { ...state.options, openLocation: false };
    },

    closeRadio: (state, action) => {
      state.options = { ...state.options, openRadio: false };
    },

    changeLocation: (state, action) => {
      state.options = { ...state.options, location: action.payload };
    },

    changeRadio: (state, action) => {
      state.options = { ...state.options, selectedValue: action.payload };
    },

    confirmeLocation: (state, action) => {
      const { urlInfo, setUrlInfo } = action.payload.UIC;

      if (state.options.location != null) {
        // NEW LOCATION:
        const location = {
          countryCode: state.options.location.code,
          cityName: state.options.location.label.split(",")[0],
        };

        // CURRENT LOCATION:
        const current = {
          countryCode: JSON.parse(localStorage.getItem("Location")).countryCode,
          cityName: JSON.parse(localStorage.getItem("Location")).cityName,
        };

        if (
          location.countryCode !== current.countryCode ||
          location.cityName !== current.cityName
        ) {
          setUrlInfo({ ...urlInfo, location, type: "location" });
          action.payload.handleCloseMenu();
          state.options = { openLocation: false, openRadio: false };
        } else {
          action.payload.showSnackbarAlert({
            message: `${action.payload.t("Already Chosen")} !`,
            severity: "info",
            duration: 3000,
          });
        }
      } else {
        action.payload.showSnackbarAlert({
          message: `${action.payload.t("You chose nothing")} !`,
          severity: "info",
          duration: 3000,
        });
      }
    },

    confirmeRadio: (state, action) => {
      const { UIC, showSnackbarAlert, t, i18n, handleCloseMenu } =
        action.payload;
      const { urlInfo, setUrlInfo } = UIC;

      const confirmedFrom = state.options.title.match(/^\w{4}/)[0];
      const newValue =
        state.options.selectedValue === "default"
          ? navigator.language.match(/^[a-z]{2}(?=-)*/)[0] ?? "en"
          : state.options.selectedValue;

      // CONVERT VALUE TO USER READABLE:
      const userReadable = (newValue, currentValue = false) => {
        if (currentValue) {
          // CONVERT UNIT VALUE TO SYMBOL:
          let currentUnit, newUnit;
          switch (currentValue) {
            case "metric":
              currentUnit = "°C";
              break;
            case "imperial":
              currentUnit = "°F";
              break;
            default:
              currentUnit = "°K";
          }
          switch (newValue) {
            case "metric":
              newUnit = "°C";
              break;
            case "imperial":
              newUnit = "°F";
              break;
            default:
              newUnit = "°K";
          }
          return { currentUnit, newUnit };
        } else {
          // CONVERT LANGUAGE CODE TO LANGUAGE NAME:
          let newLang;
          switch (newValue) {
            case "en":
              newLang = "English";
              break;
            case "ar":
              newLang = "Arabic";
              break;
            default:
              newLang = "Default";
          }
          return newLang;
        }
      };

      switch (confirmedFrom) {
        case "Unit": {
          if (newValue !== urlInfo.unit) {
            setUrlInfo({ ...urlInfo, unit: newValue, type: "unit" });
            const { currentUnit, newUnit } = userReadable(
              newValue,
              urlInfo.unit
            );
            showSnackbarAlert({
              message: `${t("Unit was changed from")} ${currentUnit} 
           ${t("to")} ${newUnit}`,
              duration: 2500,
            });
            state.options = { openLocation: false, openRadio: false };
            handleCloseMenu();
            localStorage.setItem(confirmedFrom, newValue);
          } else {
            showSnackbarAlert({
              message: `${t("Already Chosen")} !`,
              severity: "info",
              duration: 3000,
            });
          }
          break;
        }
        case "Lang": {
          const currentLang = urlInfo.lang;

          if (state.options.selectedValue === "default") {
            if (newValue === "en" && currentLang === "en") {
              showSnackbarAlert({
                message: "Your browser's default language is English",
                severity: "info",
                duration: 3000,
              });
              break;
            } else if (newValue === "ar" && currentLang === "ar") {
              showSnackbarAlert({
                message: "لغة متصفحك الإفتراضية هيا العربية",
                severity: "info",
                duration: 3000,
              });
              break;
            }
          }

          if (newValue !== currentLang) {
            setUrlInfo({ ...urlInfo, lang: newValue, type: "lang" });

            i18n.changeLanguage(newValue);

            const newLang = userReadable(newValue);

            switch (newValue) {
              case "ar": {
                showSnackbarAlert({
                  message: "تم تغيير اللغة إلى العربية",
                  duration: 2500,
                });
                break;
              }
              default: {
                showSnackbarAlert({
                  message: `Language has been changed to ${t(newLang)}`,
                  duration: 2500,
                });
              }
            }

            state.options = { openLocation: false, openRadio: false };
            handleCloseMenu();
            localStorage.setItem(confirmedFrom, newValue);
          } else {
            showSnackbarAlert({
              message: `${t("Already Chosen")} !`,
              severity: "info",
              duration: 3000,
            });
          }
          break;
        }
        default:
          throw new Error(
            `"${confirmedFrom}" is Unknown Action on (confirmeRadio) reducer`
          );
      }
    },
  },
});

export const reducersActions = menuOptionsSlice.actions;
export default menuOptionsSlice.reducer;
