import {
  useSelector,
  useDispatch,
  TypedUseSelectorHook,
} from "../imports/Redux-Imports";
import type { RootState, AppDispatch } from "./store";

// CUSTOM HOOK:
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = useDispatch<AppDispatch>;
