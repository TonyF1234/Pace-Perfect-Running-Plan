import React from 'react';
import { RACE_DISTANCES } from '../constants';
import { FlagIcon, RunnerIcon, CalendarIcon } from './IconComponents';

interface PlanFormProps {
  race: string;
  setRace: (race: string) => void;
  goalDate: string;
  setGoalDate: (date: string) => void;
  paceMinutes: string;
  setPaceMinutes: (minutes: string) => void;
  paceSeconds: string;
  setPaceSeconds: (seconds: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({
  race,
  setRace,
  goalDate,
  setGoalDate,
  paceMinutes,
  setPaceMinutes,
  paceSeconds,
  setPaceSeconds,
  onSubmit,
  isLoading,
}) => {
  const isFormValid = race && goalDate && paceMinutes && paceSeconds;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80 space-y-8">
        <div>
          <label className="flex items-center gap-3 text-lg font-semibold text-slate-800 mb-4">
            <FlagIcon className="w-6 h-6 text-sky-500" />
            1. Choose Your Goal
          </label>
          <div className="grid grid-cols-3 gap-3">
            {RACE_DISTANCES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setRace(d.id)}
                className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                  ${
                    race === d.id
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="flex items-center gap-3 text-lg font-semibold text-slate-800 mb-4">
            <CalendarIcon className="w-6 h-6 text-sky-500" />
            2. Select Your Goal Date
          </label>
          <input
            type="date"
            value={goalDate}
            onChange={(e) => setGoalDate(e.target.value)}
            min={today}
            className="w-full px-4 py-3 text-slate-900 bg-slate-100 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white"
            aria-label="Goal date"
          />
        </div>

        <div>
          <label className="flex items-center gap-3 text-lg font-semibold text-slate-800 mb-4">
            <RunnerIcon className="w-6 h-6 text-sky-500" />
            3. Set Your Target Pace
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <input
                type="number"
                value={paceMinutes}
                onChange={(e) => setPaceMinutes(e.target.value)}
                placeholder="8"
                className="w-full pl-4 pr-12 py-3 text-slate-900 bg-slate-100 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white"
                min="0"
                max="60"
                aria-label="Pace minutes"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 text-sm font-medium">min</span>
            </div>
            <span className="text-2xl font-light text-slate-400">:</span>
             <div className="relative w-full">
              <input
                type="number"
                value={paceSeconds}
                onChange={(e) => setPaceSeconds(e.target.value)}
                placeholder="30"
                className="w-full pl-4 pr-12 py-3 text-slate-900 bg-slate-100 rounded-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:bg-white"
                min="0"
                max="59"
                aria-label="Pace seconds"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 text-sm font-medium">sec</span>
            </div>
            <span className="text-slate-600 font-medium">/ mile</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-sky-600 text-white font-bold py-4 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Crafting Your Plan...' : 'Generate My Plan'}
        </button>
      </form>
    </div>
  );
};

export default PlanForm;