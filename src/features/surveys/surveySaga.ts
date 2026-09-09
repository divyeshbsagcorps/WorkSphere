import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { surveyApi } from '@/api/surveyApi';
import {
  fetchSurveysRequest,
  fetchSurveysSuccess,
  fetchSurveysFailure,
  submitSurveyRequest,
  submitSurveySuccess,
  fetchAiInsightsRequest,
  fetchAiInsightsSuccess,
} from './surveySlice';
import { Survey, SurveyResponse } from '@/types';

function* handleFetchSurveys(): Generator {
  try {
    const list = (yield call(surveyApi.getSurveys)) as Survey[];
    yield put(fetchSurveysSuccess(list));
  } catch (err: any) {
    yield put(fetchSurveysFailure(err.message || 'Failed to fetch surveys'));
  }
}

function* handleSubmitSurvey(action: PayloadAction<Omit<SurveyResponse, 'id' | 'submittedAt'>>): Generator {
  try {
    const res = (yield call(surveyApi.submitSurvey, action.payload)) as SurveyResponse;
    yield put(submitSurveySuccess(res));
  } catch (err: any) {
    yield put(fetchSurveysFailure(err.message || 'Failed to submit survey'));
  }
}

function* handleFetchAiInsights(action: PayloadAction<string>): Generator {
  try {
    const insights = (yield call(surveyApi.generateAiInsights, action.payload)) as string;
    yield put(fetchAiInsightsSuccess(insights));
  } catch (err: any) {
    yield put(fetchAiInsightsSuccess('AI insights unavailable at this time.'));
  }
}

export function* surveySaga() {
  yield takeLatest(fetchSurveysRequest.type, handleFetchSurveys);
  yield takeLatest(submitSurveyRequest.type, handleSubmitSurvey);
  yield takeLatest(fetchAiInsightsRequest.type, handleFetchAiInsights);
}
