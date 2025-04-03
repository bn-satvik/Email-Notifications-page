import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./app/store";
import {
  fetchEmailSettings,
  updateEmailSettings,
  setShowResultBanner,
  handleInputChange,
  handleBatchingIntervalChange,
} from "./features/emailSettingsSlice";
import {
  Typography,
  Alert,
  FormControlLabel,
  Switch,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

const regexPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EmailSettingsForm = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.emailSettings);
  const {
    sendDigests,
    sendEndUserAlerts,
    showSenders,
    emailDestinations,
    sendRemediationAlerts,
    alertsBatchingHourlyInterval,
    loading,
    showResultBanner,
    saveState,
  } = formState;

  const [validEmail, setValidEmail] = useState(true);
  const [showValidationBanner, setShowValidationBanner] = useState(false);

  useEffect(() => {
    dispatch(fetchEmailSettings());
  }, [dispatch]);

  const validateEmails = useMemo(() => {
    if (!showSenders || !sendDigests) return true;
    if (!emailDestinations.trim()) return false;
    return emailDestinations.split("\n").every((email) => regexPattern.test(email.trim()));
  }, [emailDestinations, showSenders, sendDigests]);

  const handleSaveClick = useCallback(() => {
    if (!validateEmails) {
      setValidEmail(false);
      setShowValidationBanner(true);
      return;
    }
    setValidEmail(true);
    setShowValidationBanner(false);

    dispatch(updateEmailSettings(formState))
      .unwrap()
      .then(() => {
        dispatch(setShowResultBanner(true));
      })
      .catch(() => {
        dispatch(setShowResultBanner(true));
      });

    setTimeout(() => {
      dispatch(setShowResultBanner(false));
    }, 5000);
  }, [dispatch, formState, validateEmails]);

  return (
    <form className="email-settings-form">
      <Typography variant="h5">Administrator Emails</Typography>
      {showResultBanner && saveState === "RESOLVED" && <Alert severity="success">Save successful!</Alert>}
      {showResultBanner && saveState === "REJECTED" && <Alert severity="error">Save failed!</Alert>}
      {showValidationBanner && !validEmail && showSenders && sendDigests && (
        <Alert severity="error">Please enter valid email addresses</Alert>
      )}

      <FormControlLabel
        label="Send a daily email digest to all admins"
        control={<Switch color="primary" checked={sendDigests} name="sendDigests" onChange={(e) => dispatch(handleInputChange({ name: e.target.name, value: e.target.checked }))} />}
      />
      <br />

      {sendDigests && (
        <FormControlLabel
          label="Additional recipients for the daily email digest"
          control={<Switch color="primary" checked={showSenders} name="showSenders" onChange={(e) => dispatch(handleInputChange({ name: e.target.name, value: e.target.checked }))} />}
        />
      )}

      {showSenders && sendDigests && (
        <TextField
          multiline
          fullWidth
          helperText="Put each email on its own line."
          label="Admin email addresses to receive daily digest"
          name="emailDestinations"
          value={emailDestinations}
          onChange={(e) => dispatch(handleInputChange({ name: e.target.name, value: e.target.value }))}
          error={!validEmail}
        />
      )}

      <Typography variant="h5">End-User Notifications</Typography>
      <FormControlLabel
        label="Send violation alerts to end users"
        control={<Switch color="primary" checked={sendEndUserAlerts} name="sendEndUserAlerts" onChange={(e) => dispatch(handleInputChange({ name: e.target.name, value: e.target.checked }))} />}
      />
      <br />
      <FormControlLabel
        label="Send remediation notifications to end users"
        control={<Switch color="primary" checked={sendRemediationAlerts} name="sendRemediationAlerts" onChange={(e) => dispatch(handleInputChange({ name: e.target.name, value: e.target.checked }))} />}
      />

      <Typography variant="h5">Enable batching in end-user notifications with interval</Typography>
      <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
        <Select
          value={alertsBatchingHourlyInterval}
          onChange={(e: SelectChangeEvent<number>) => dispatch(handleBatchingIntervalChange(Number(e.target.value)))}
          disabled={!sendRemediationAlerts && !sendEndUserAlerts}
        >
          <MenuItem value={0}>Realtime</MenuItem>
          <MenuItem value={1}>1 hour</MenuItem>
          <MenuItem value={3}>3 hours</MenuItem>
          <MenuItem value={6}>6 hours</MenuItem>
          <MenuItem value={12}>12 hours</MenuItem>
        </Select>
      </FormControl>
      <br />
      <Button onClick={handleSaveClick} variant="contained" color="primary" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default EmailSettingsForm;