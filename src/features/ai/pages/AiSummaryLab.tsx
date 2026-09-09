import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import { fetchAiInsightsRequest } from '@/features/surveys/surveySlice';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import { Bot, Sparkles, UserCheck, FileText } from 'lucide-react';

export const AiSummaryLab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEmpId, setSelectedEmpId] = useState<number>(101);
  const [empSummary, setEmpSummary] = useState<string | null>(null);
  const [isEmpSummaryLoading, setIsEmpSummaryLoading] = useState(false);

  const { employees } = useSelector((state: RootState) => state.employees);
  const { aiInsights, isAiLoading } = useSelector((state: RootState) => state.surveys);

  const targetEmp = employees.find((e) => e.id === Number(selectedEmpId)) || employees[0];

  const handleGenerateEmpSummary = () => {
    if (!targetEmp) return;
    setIsEmpSummaryLoading(true);
    setEmpSummary(null);

    setTimeout(() => {
      setEmpSummary(
        `AI Executive Summary for ${targetEmp.name}:\n${targetEmp.name} is a high-performing ${targetEmp.title} in the ${targetEmp.department} department. Possessing ${targetEmp.experienceYears} years of industry experience, key technical competencies include ${targetEmp.skills.join(', ')}. Currently located in ${targetEmp.location}, ${targetEmp.name} maintains an active employee record with clean compliance verification.`
      );
      setIsEmpSummaryLoading(false);
    }, 800);
  };

  const handleGenerateSurveyInsights = () => {
    dispatch(fetchAiInsightsRequest('SURVEY-2026-Q3'));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-indigo-600 font-bold mb-1">
          <Bot className="w-6 h-6" />
          <h2 className="text-xl font-bold text-slate-900 m-0">AI-Assisted Operations Lab</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl m-0">
          Demonstrates AI summarization capabilities for employee profiles and survey insights. All AI outputs are validated and designed with human-in-the-loop review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Profile Summarizer */}
        <div className="saas-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Employee Profile Summarizer
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Generate concise executive profile summaries</p>
          </div>

          <div className="space-y-4">
            <Select
              label="Select Target Employee"
              value={selectedEmpId}
              options={employees.map((e) => ({ label: `${e.name} (${e.title})`, value: String(e.id) }))}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
            />

            <Button
              variant="primary"
              className="w-full"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
              isLoading={isEmpSummaryLoading}
              onClick={handleGenerateEmpSummary}
            >
              Generate AI Summary
            </Button>

            {empSummary && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-2 animate-fadeIn">
                <Badge variant="info">Generated Result</Badge>
                <p className="whitespace-pre-line leading-relaxed m-0">{empSummary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Survey Insights Generator */}
        <div className="saas-card p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <FileText className="w-5 h-5 text-indigo-600" /> Survey Sentiment & Insights AI
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 m-0">Synthesize organization-wide survey responses</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-900 m-0">Q3 Enterprise Employee Satisfaction Survey</p>
              <p className="text-xs text-slate-500 mt-1 m-0">437 Completed Submissions</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
              isLoading={isAiLoading}
              onClick={handleGenerateSurveyInsights}
            >
              Synthesize Survey Insights
            </Button>

            {aiInsights && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-2 animate-fadeIn">
                <Badge variant="role">AI Insights Synthesis</Badge>
                <p className="whitespace-pre-line leading-relaxed m-0">{aiInsights}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
