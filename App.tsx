import React, { useState, useCallback, useEffect } from 'react';
import PlanForm from './components/PlanForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateRunningPlan, generateFeedback } from './services/geminiService';
import { RunningPlan, DailyWorkout } from './types';
import { RunnerIcon, XIcon } from './components/IconComponents';

const PLAN_STORAGE_KEY = 'pacePerfectPlan';
const START_DATE_STORAGE_KEY = 'pacePerfectPlanStartDate';

const App: React.FC = () => {
  const [race, setRace] = useState<string>('');
  const [paceMinutes, setPaceMinutes] = useState<string>('');
  const [paceSeconds, setPaceSeconds] = useState<string>('');
  const [goalDate, setGoalDate] = useState<string>('');
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [planStartDate, setPlanStartDate] = useState<string>('');

  // New states for feedback feature
  const [feedback, setFeedback] = useState<{ [week: number]: string }>({});
  const [isFeedbackLoading, setIsFeedbackLoading] = useState<number | null>(null); // weekIndex that is loading
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Load plan from local storage on initial mount
  useEffect(() => {
    try {
      const savedPlanJSON = localStorage.getItem(PLAN_STORAGE_KEY);
      const savedStartDate = localStorage.getItem(START_DATE_STORAGE_KEY);
      if (savedPlanJSON && savedStartDate) {
        setPlan(JSON.parse(savedPlanJSON));
        setPlanStartDate(savedStartDate);
      }
    } catch (e) {
      console.error("Failed to load plan from local storage:", e);
      localStorage.removeItem(PLAN_STORAGE_KEY);
      localStorage.removeItem(START_DATE_STORAGE_KEY);
    }
  }, []);

  // Save plan to local storage whenever it changes
  useEffect(() => {
    try {
      if (plan && planStartDate) {
        localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
        localStorage.setItem(START_DATE_STORAGE_KEY, planStartDate);
      } else {
        localStorage.removeItem(PLAN_STORAGE_KEY);
        localStorage.removeItem(START_DATE_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save plan to local storage:", e);
    }
  }, [plan, planStartDate]);


  const handleGeneratePlan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!race || !paceMinutes || !paceSeconds || !goalDate) return;

    setIsLoading(true);
    setError(null);
    setPlan(null);

    const todayDate = new Date().toISOString().split('T')[0];
    setPlanStartDate(todayDate);

    const fullPace = `${paceMinutes} minutes and ${paceSeconds} seconds`;
    
    try {
      const generatedPlan = await generateRunningPlan(race, fullPace, goalDate, todayDate);
      setPlan(generatedPlan);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [race, paceMinutes, paceSeconds, goalDate]);
  
  const handleGetFeedback = useCallback(async (weekIndex: number) => {
    if (!plan) return;
    setIsFeedbackLoading(weekIndex);
    setFeedbackError(null);
    try {
      const advice = await generateFeedback(plan, weekIndex);
      setFeedback(prev => ({ ...prev, [weekIndex]: advice }));
    } catch (err: unknown) {
      if (err instanceof Error) {
          setFeedbackError(err.message);
      } else {
          setFeedbackError("An unexpected error occurred while getting feedback.");
      }
    } finally {
      setIsFeedbackLoading(null);
    }
  }, [plan]);

  const handleUpdateWorkout = useCallback((weekIndex: number, dayIndex: number, status: DailyWorkout['status'], actualWorkout?: string) => {
    setPlan(currentPlan => {
      if (!currentPlan) return null;

      const newPlan = JSON.parse(JSON.stringify(currentPlan));
      const workout = newPlan.weeks[weekIndex].dailyWorkouts[dayIndex];
      
      workout.status = status;
      workout.actualWorkout = actualWorkout;
      
      return newPlan;
    });
  }, []);

  const handleResetPlan = () => {
    // Clear state
    setPlan(null);
    setPlanStartDate('');
    setError(null);
    setRace('');
    setPaceMinutes('');
    setPaceSeconds('');
    setGoalDate('');
    
    // Clear feedback state
    setFeedback({});
    setIsFeedbackLoading(null);
    setFeedbackError(null);
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-3">
          <RunnerIcon className="w-10 h-10 text-sky-500"/>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Pace<span className="text-sky-500">Perfect</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
          Your personalized AI-powered running plan is just a few clicks away.
        </p>
      </header>

      <main className="w-full">
        {plan && !isLoading && (
          <div className="text-center mb-6">
            <button
              onClick={handleResetPlan}
              className="bg-red-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Start a new plan"
            >
              Start a New Plan
            </button>
          </div>
        )}

        {feedbackError && (
          <div className="max-w-2xl mx-auto p-4 mb-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-center relative">
            <h3 className="font-bold">Feedback Error</h3>
            <p>{feedbackError}</p>
            <button onClick={() => setFeedbackError(null)} className="absolute top-2 right-2 text-yellow-800 hover:text-yellow-900" aria-label="Close error">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {!plan && (
            <PlanForm
            race={race}
            setRace={setRace}
            goalDate={goalDate}
            setGoalDate={setGoalDate}
            paceMinutes={paceMinutes}
            setPaceMinutes={setPaceMinutes}
            paceSeconds={paceSeconds}
            setPaceSeconds={setPaceSeconds}
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
            />
        )}

        <div className="mt-10 w-full">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="max-w-2xl mx-auto p-6 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
              <h3 className="font-bold">Oops! Something went wrong.</h3>
              <p>{error}</p>
            </div>
          )}
          {plan && planStartDate && (
            <PlanDisplay 
              plan={plan} 
              planStartDate={planStartDate} 
              onUpdateWorkout={handleUpdateWorkout} 
              onGetFeedback={handleGetFeedback}
              feedback={feedback}
              isFeedbackLoading={isFeedbackLoading}
            />
          )}
        </div>
      </main>

      <footer className="text-center mt-16 py-4">
        <p className="text-sm text-slate-500">
          Powered by Google's Gemini API. Train smart, run strong.
        </p>
      </footer>
    </div>
  );
};

export default App;
