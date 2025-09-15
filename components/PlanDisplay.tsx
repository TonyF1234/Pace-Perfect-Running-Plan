import React, { useMemo } from 'react';
import { RunningPlan } from '../types';

interface PlanDisplayProps {
  plan: RunningPlan;
  planStartDate: string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, planStartDate }) => {
  const startDate = useMemo(() => {
    if (!planStartDate) return null;
    // Use T00:00:00 to handle timezone parsing consistently
    return new Date(`${planStartDate}T00:00:00`);
  }, [planStartDate]);

  if (!startDate) {
    return null; // Or a fallback UI if the start date isn't provided
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      <div className="text-center mb-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{plan.title}</h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">{plan.introduction}</p>
      </div>

      <div className="space-y-6">
        {plan.weeks.map((week, weekIndex) => {
          const weekStartDate = addDays(startDate, weekIndex * 7);
          const weekEndDate = addDays(weekStartDate, 6);

          return (
            <div key={week.weekNumber} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/60 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-sky-600">
                Week {week.weekNumber}
                <span className="ml-3 font-normal text-slate-500 text-base">
                  ({formatDate(weekStartDate)} - {formatDate(weekEndDate)})
                </span>
              </h3>
              <p className="text-slate-500 mt-1 mb-4 text-sm">{week.summary}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {week.dailyWorkouts.map((workout, dayIndex) => {
                  // The AI might not perfectly align days, so we rely on our calculated date
                  const workoutDate = addDays(weekStartDate, dayIndex);
                  return (
                    <li key={`${workout.day}-${dayIndex}`} className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex justify-between items-baseline">
                        <p className="font-semibold text-slate-700">{workout.day}</p>
                        <p className="text-sm font-medium text-slate-500">{formatDate(workoutDate)}</p>
                      </div>
                      <p className="text-slate-600 text-sm mt-1">{workout.workout}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10 bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
        <p className="text-lg text-slate-600">{plan.conclusion}</p>
        <p className="mt-4 text-2xl font-bold text-sky-600">Good luck on your race!</p>
      </div>
    </div>
  );
};

export default PlanDisplay;