import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import emailSettingsReducer from "../features/emailSettingsSlice";

// Creating the Redux store with emailSettingsReducer
const store = configureStore({
  reducer: {
    emailSettings: emailSettingsReducer,
  },
});

// Defining RootState type to represent the global state structure
export type RootState = ReturnType<typeof store.getState>;

// Defining AppDispatch type for dispatching actions
export type AppDispatch = typeof store.dispatch;

// Custom hooks for using dispatch and selector with proper types
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; // Exporting the configured store
