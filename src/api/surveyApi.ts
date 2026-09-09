import { apiCall } from './client';
import { Survey, SurveyResponse } from '@/types';
import { INITIAL_SURVEYS } from '@/utils/mockData';

let surveysDb: Survey[] = [...INITIAL_SURVEYS];
let responsesDb: SurveyResponse[] = [];

export const surveyApi = {
  getSurveys: async (): Promise<Survey[]> => {
    return apiCall(() => [...surveysDb], 300);
  },

  submitSurvey: async (response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> => {
    return apiCall(() => {
      const newResponse: SurveyResponse = {
        ...response,
        id: `RESP-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
      responsesDb = [newResponse, ...responsesDb];
      return newResponse;
    }, 500);
  },

  generateAiInsights: async (surveyId: string): Promise<string> => {
    return apiCall(() => {
      const survey = surveysDb.find((s) => s.id === surveyId);
      const title = survey ? survey.title : 'Q3 Satisfaction Survey';
      return `AI Insight Analysis for [${title}]:
• 88% of respondents report high satisfaction with overall workplace culture and peer collaboration.
• Engineering team highlighted strong approval for Redux Saga architecture and dynamic form workflows.
• Work-life balance rated 4.4/5; 64% expressed desire for expanded L&D online learning stipends.
• Leadership transparency scores increased by 14% compared to the previous quarter.`;
    }, 900);
  },
};
