import { configureStore } from "../imports/Redux-Imports";
import geoAndWeatherSliceReducer from "./features/geoAndWeatherSlice";
import menuOptionsSliceReducer from "./features/menuOptionsSlice";
import { reducersActions } from "./features/menuOptionsSlice";

const { click, confirmeLocation, confirmeRadio } = reducersActions;

export const store = configureStore({
  reducer: {
    geoAndWeather: geoAndWeatherSliceReducer,
    menuOptions: menuOptionsSliceReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [click.type, confirmeLocation.type, confirmeRadio.type],
      },
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
