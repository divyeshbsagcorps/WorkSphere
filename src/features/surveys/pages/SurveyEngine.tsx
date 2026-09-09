import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/store';
import {
  fetchSurveysRequest,
  setSurveyStep,
  submitSurveyRequest,
} from '@/features/surveys/surveySlice';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Question, SurveySection } from '@/types';
import { ClipboardList, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SurveyEngine: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { activeSurvey, currentStep, isLoading, responses } = useSelector(
    (state: RootState) => state.surveys
  );

  useEffect(() => {
    dispatch(fetchSurveysRequest());
  }, [dispatch]);

  if (isLoading || !activeSurvey) {
    return <div className="p-8 text-center text-slate-500">Loading dynamic survey engine...</div>;
  }

  const sections = activeSurvey.sections;
  const currentSection: SurveySection = sections[currentStep] || sections[0];
  const totalSteps = sections.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const buildYupSchemaForSection = (questions: Question[]) => {
    const shape: Record<string, any> = {};
    questions.forEach((q) => {
      if (q.type === 'email') {
        let v = Yup.string().email('Invalid email address');
        if (q.required) v = v.required(`${q.label} is required`);
        shape[q.id] = v;
      } else if (q.type === 'checkbox') {
        let v = Yup.array();
        if (q.required) v = v.min(1, 'Please select at least one option');
        shape[q.id] = v;
      } else {
        let v = Yup.string();
        if (q.required) v = v.required(`${q.label} is required`);
        shape[q.id] = v;
      }
    });
    return Yup.object().shape(shape);
  };

  const currentSchema = buildYupSchemaForSection(currentSection.questions);

  const initialValues: Record<string, any> = {};
  sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      initialValues[q.id] = q.type === 'checkbox' ? [] : '';
    });
  });

  const isCompleted = responses.some((r) => r.surveyId === activeSurvey.id);

  if (isCompleted) {
    return (
      <div className="saas-card p-8 text-center max-w-xl mx-auto space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 m-0">Survey Completed!</h2>
        <p className="text-xs text-slate-500 m-0">
          Thank you for participating in the {activeSurvey.title}. Your feedback has been recorded.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Title Card */}
      <div className="saas-card p-6">
        <div className="flex items-center space-x-2">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-extrabold text-slate-900 m-0">{activeSurvey.title}</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1 m-0">{activeSurvey.description}</p>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-indigo-600">
              Step {currentStep + 1} of {totalSteps}: {currentSection.title}
            </span>
            <span className="text-slate-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Form Card */}
      <div className="saas-card p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={currentSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={(values) => {
            if (currentStep < totalSteps - 1) {
              dispatch(setSurveyStep(currentStep + 1));
            } else {
              dispatch(
                submitSurveyRequest({
                  surveyId: activeSurvey.id,
                  employeeId: user?.id || 101,
                  answers: values,
                })
              );
            }
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-6">
              <div className="space-y-1 mb-4">
                <h3 className="text-base font-bold text-slate-900 m-0">{currentSection.title}</h3>
                {currentSection.description && (
                  <p className="text-xs text-slate-500 m-0">{currentSection.description}</p>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {currentSection.questions.map((q) => (
                  <div key={q.id} className="space-y-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 m-0">
                        {q.label} {q.required && <span className="text-rose-600">*</span>}
                      </label>
                      {q.helpText && (
                        <p className="text-[11px] text-slate-500 mt-1 m-0">{q.helpText}</p>
                      )}
                    </div>

                    {q.type === 'text' && (
                      <Field
                        name={q.id}
                        type="text"
                        placeholder={q.placeholder}
                        className="form-control"
                      />
                    )}

                    {q.type === 'email' && (
                      <Field
                        name={q.id}
                        type="email"
                        placeholder={q.placeholder}
                        className="form-control"
                      />
                    )}

                    {q.type === 'textarea' && (
                      <Field
                        as="textarea"
                        rows={3}
                        name={q.id}
                        placeholder={q.placeholder}
                        className="form-control"
                      />
                    )}

                    {q.type === 'radio' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, i) => {
                          const isSelected = values[q.id] === opt;
                          const isOddLast = i === q.options.length - 1 && q.options.length % 2 !== 0;
                          return (
                            <label
                              key={i}
                              className={`group relative flex items-center p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                                isSelected
                                  ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50/60'
                              } ${isOddLast ? 'sm:col-span-2' : ''}`}
                            >
                              <Field
                                type="radio"
                                name={q.id}
                                value={opt}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 transition-all duration-200 ${
                                  isSelected
                                    ? 'border-indigo-600 bg-indigo-600 ring-2 ring-indigo-100'
                                    : 'border-slate-300 bg-white group-hover:border-indigo-400'
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full bg-white transition-transform duration-200 ${
                                    isSelected ? 'scale-100' : 'scale-0'
                                  }`}
                                />
                              </div>
                              <span className="leading-snug flex-1">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'select' && q.options && (
                      <Field
                        as="select"
                        name={q.id}
                        className="form-select"
                      >
                        <option value="">Select an option...</option>
                        {q.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Field>
                    )}

                    {q.type === 'checkbox' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, i) => {
                          const isChecked = Array.isArray(values[q.id]) && values[q.id].includes(opt);
                          const isOddLast = i === q.options.length - 1 && q.options.length % 2 !== 0;
                          return (
                            <label
                              key={i}
                              className={`group relative flex items-center p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                                isChecked
                                  ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50/60'
                              } ${isOddLast ? 'sm:col-span-2' : ''}`}
                            >
                              <Field
                                type="checkbox"
                                name={q.id}
                                value={opt}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mr-3 transition-all duration-200 ${
                                  isChecked
                                    ? 'border-indigo-600 bg-indigo-600 text-white ring-2 ring-indigo-100'
                                    : 'border-slate-300 bg-white group-hover:border-indigo-400'
                                }`}
                              >
                                <svg
                                  className={`w-3 h-3 stroke-current stroke-[2.5] transition-transform duration-200 ${
                                    isChecked ? 'scale-100' : 'scale-0'
                                  }`}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <span className="leading-snug flex-1">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {touched[q.id] && errors[q.id] && (
                      <p className="text-xs text-rose-600 font-semibold mt-1 m-0">{errors[q.id] as string}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={currentStep === 0}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => dispatch(setSurveyStep(currentStep - 1))}
                >
                  Back
                </Button>

                <Button type="submit" variant="primary" icon={currentStep === totalSteps - 1 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}>
                  {currentStep === totalSteps - 1 ? 'Submit Survey' : 'Next Step'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
