import React, { useState, useCallback } from 'react';
import PlanForm from './components/PlanForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { generateRunningPlan } from './services/geminiService';
import { RunningPlan } from './types';
import { RunnerIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [race, setRace] = useState<string>('');
  const [paceMinutes, setPaceMinutes] = useState<string>('');
  const [paceSeconds, setPaceSeconds] = useState<string>('');
  const [goalDate, setGoalDate] = useState<string>('');
  const [plan, setPlan] = useState<RunningPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [planStartDate, setPlanStartDate] = useState<string>('');


  const handleGeneratePlan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!race || !paceMinutes || !paceSeconds || !goalDate) return;

    setIsLoading(true);
    setError(null);
    setPlan(null); // Clear previous plan

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

        <div className="mt-10 w-full">
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="max-w-2xl mx-auto p-6 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
              <h3 className="font-bold">Oops! Something went wrong.</h3>
              <p>{error}</p>
            </div>
          )}
          {plan && planStartDate && <PlanDisplay plan={plan} planStartDate={planStartDate} />}
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