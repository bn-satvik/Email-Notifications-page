import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getMockApiResponse, patchMockApiResponse } from "../mockApi";

// Define state interface
interface EmailSettingsState {
  sendDigests: boolean;
  sendEndUserAlerts: boolean;
  showSenders: boolean;
  emailDestinations: string;
  sendRemediationAlerts: boolean;
  alertsBatchingHourlyInterval: number;
  loading: boolean;
  error: string | null;
  showResultBanner: boolean;
  saveState: "" | "RESOLVED" | "REJECTED";
}

const initialState: EmailSettingsState = {
  sendDigests: false,
  sendEndUserAlerts: true,
  showSenders: false,
  emailDestinations: "",
  sendRemediationAlerts: true,
  alertsBatchingHourlyInterval: 0,
  loading: false,
  error: null,
  showResultBanner: false,
  saveState: "",
};

// Async thunks
export const fetchEmailSettings = createAsyncThunk(
  "emailSettings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMockApiResponse();
      return {
        sendDigests: response.digestConfiguration?.sendDigests || false,
        sendEndUserAlerts: response.alertConfiguration?.sendEndUserAlerts || true,
        sendRemediationAlerts: response.alertConfiguration?.sendRemediationAlerts || true,
        alertsBatchingHourlyInterval: response.alertConfiguration?.alertsBatchingHourlyInterval || 0,
        showSenders: !!response.digestConfiguration?.emailDestinations?.length,
        emailDestinations: response.digestConfiguration?.emailDestinations
          ? response.digestConfiguration.emailDestinations.join("\n")
          : "",
      };
    } catch (error) {
      console.error("Fetch failed:", error);
      return rejectWithValue("Failed to fetch email settings");
    }
  }
);

export const updateEmailSettings = createAsyncThunk(
  "emailSettings/update",
  async (settings: Partial<EmailSettingsState>, { rejectWithValue }) => {
    try {
      const patchObj = [
        { path: "/digestConfiguration/sendDigests", op: "replace", value: settings.sendDigests },
        { path: "/alertConfiguration/sendEndUserAlerts", op: "replace", value: settings.sendEndUserAlerts },
        { path: "/alertConfiguration/sendRemediationAlerts", op: "replace", value: settings.sendRemediationAlerts },
        { path: "/alertConfiguration/alertsBatchingHourlyInterval", op: "replace", value: settings.alertsBatchingHourlyInterval },
        {
          path: "/digestConfiguration/emailDestinations",
          op: "replace",
          value: settings.showSenders && settings.emailDestinations
            ? settings.emailDestinations.trim().split("\n").map((s) => s.trim())
            : [],
        },
      ];

      await patchMockApiResponse(patchObj);
      return { ...settings, saveState: "RESOLVED" };
    } catch (error) {
      console.error("Update failed:", error);
      return rejectWithValue("Failed to update email settings");
    }
  }
);

// Create slice
const emailSettingsSlice = createSlice({
  name: "emailSettings",
  initialState,
  reducers: {
    setEmailSetting: (state, action: PayloadAction<Partial<EmailSettingsState>>) => {
      return { ...state, ...action.payload };
    },
    setShowResultBanner: (state, action: PayloadAction<boolean>) => {
      state.showResultBanner = action.payload;
    },
    handleInputChange: (state, action: PayloadAction<{ name: string; value: any }>) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
    handleBatchingIntervalChange: (state, action: PayloadAction<number>) => {
      state.alertsBatchingHourlyInterval = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEmailSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateEmailSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.showResultBanner = false;
      })
      .addCase(updateEmailSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.loading = false;
        state.error = null;
        state.showResultBanner = true;
      })
      .addCase(updateEmailSettings.rejected, (state, action) => {
        console.error("Update email settings failed:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.saveState = "REJECTED";
        state.showResultBanner = true;
      });
  },

});

// Export actions
export const { setShowResultBanner, handleInputChange, handleBatchingIntervalChange, setEmailSetting } = emailSettingsSlice.actions;

// Export reducer
export default emailSettingsSlice.reducer;
