import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SurveyState, Survey, SurveyResponse } from '@/types';

const initialState: SurveyState = {
  surveys: [],
  activeSurvey: null,
  currentStep: 0,
  responses: [],
  isLoading: false,
  error: null,
  aiInsights: null,
  isAiLoading: false,
};

export const surveySlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    fetchSurveysRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSurveysSuccess: (state, action: PayloadAction<Survey[]>) => {
      state.isLoading = false;
      state.surveys = action.payload;
      if (action.payload.length > 0 && !state.activeSurvey) {
        state.activeSurvey = action.payload[0];
      }
    },
    fetchSurveysFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setActiveSurvey: (state, action: PayloadAction<Survey>) => {
      state.activeSurvey = action.payload;
      state.currentStep = 0;
    },
    setSurveyStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    submitSurveyRequest: (state, _action: PayloadAction<Omit<SurveyResponse, 'id' | 'submittedAt'>>) => {
      state.isLoading = true;
    },
    submitSurveySuccess: (state, action: PayloadAction<SurveyResponse>) => {
      state.isLoading = false;
      state.responses.push(action.payload);
      state.currentStep = 0;
    },
    fetchAiInsightsRequest: (state, _action: PayloadAction<string>) => {
      state.isAiLoading = true;
    },
    fetchAiInsightsSuccess: (state, action: PayloadAction<string>) => {
      state.isAiLoading = false;
      state.aiInsights = action.payload;
    },
  },
});

export const {
  fetchSurveysRequest,
  fetchSurveysSuccess,
  fetchSurveysFailure,
  setActiveSurvey,
  setSurveyStep,
  submitSurveyRequest,
  submitSurveySuccess,
  fetchAiInsightsRequest,
  fetchAiInsightsSuccess,
} = surveySlice.actions;

export default surveySlice.reducer;
