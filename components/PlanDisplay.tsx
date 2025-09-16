import React, { useMemo, useState } from 'react';
import { RunningPlan, DailyWorkout } from '../types';
import { CheckIcon, XIcon, PencilIcon, SparkleIcon } from './IconComponents';

interface PlanDisplayProps {
  plan: RunningPlan;
  planStartDate: string;
  onUpdateWorkout: (
    weekIndex: number,
    dayIndex: number,
    status: DailyWorkout['status'],
    actualWorkout?: string,
    distance?: number,
    timeMinutes?: number,
    timeSeconds?: number
  ) => void;
  onGetFeedback: (weekIndex: number) => void;
  feedback: { [week: number]: string };
  isFeedbackLoading: number | null;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

interface DailyWorkoutCardProps {
  workout: DailyWorkout;
  date: Date;
  weekIndex: number;
  dayIndex: number;
  onUpdate: PlanDisplayProps['onUpdateWorkout'];
}

const DailyWorkoutCard: React.FC<DailyWorkoutCardProps> = ({ workout, date, weekIndex, dayIndex, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(workout.actualWorkout || '');
  const [distance, setDistance] = useState(workout.distance?.toString() || '');
  const [timeMinutes, setTimeMinutes] = useState(workout.timeMinutes?.toString() || '');
  const [timeSeconds, setTimeSeconds] = useState(workout.timeSeconds?.toString() || '');


  const handleStartEditing = () => {
    setEditText(workout.actualWorkout || '');
    setDistance(workout.distance?.toString() || '');
    setTimeMinutes(workout.timeMinutes?.toString() || '');
    setTimeSeconds(workout.timeSeconds?.toString() || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(
        weekIndex, 
        dayIndex, 
        'completed', 
        editText,
        distance ? parseFloat(distance) : undefined,
        timeMinutes ? parseInt(timeMinutes, 10) : undefined,
        timeSeconds ? parseInt(timeSeconds, 10) : undefined
    );
    setIsEditing(false);
  };
  
  const handleSkip = () => {
    onUpdate(weekIndex, dayIndex, 'skipped');
    setIsEditing(false);
  };
  
  const handleClearStatus = () => {
    onUpdate(weekIndex, dayIndex, undefined, undefined, undefined, undefined, undefined);
    setIsEditing(false);
  };

  const calculatedPace = useMemo(() => {
    if (workout.status !== 'completed' || !workout.distance || workout.distance <= 0) return null;
    
    const totalSeconds = (workout.timeMinutes || 0) * 60 + (workout.timeSeconds || 0);
    if (totalSeconds <= 0) return null;

    const paceInSecondsPerMile = totalSeconds / workout.distance;
    const paceMinutes = Math.floor(paceInSecondsPerMile / 60);
    const paceSeconds = Math.round(paceInSecondsPerMile % 60);
    
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} / mile`;
  }, [workout]);


  const statusStyles = {
    completed: 'bg-emerald-50 border-emerald-200',
    skipped: 'bg-red-50 border-red-200',
    default: 'bg-slate-50 border-slate-200',
  };
  
  const baseClasses = "p-4 rounded-lg transition-all duration-300 relative group";
  const currentStatus = workout.status || 'default';
  const cardClasses = `${baseClasses} ${statusStyles[currentStatus]}`;

  return (
    <li className={cardClasses}>
      <div className="flex justify-between items-baseline">
        <p className="font-semibold text-slate-700">{workout.day}</p>
        <p className="text-sm font-medium text-slate-500">{formatDate(date)}</p>
      </div>
      
      <p className="text-slate-600 text-sm mt-1 pr-14">
        <span className="font-semibold text-slate-700">Plan:</span> {workout.workout}
      </p>

      {!isEditing && workout.status === 'completed' && (
        <div className="mt-2 space-y-1 text-sm text-slate-600 animate-fade-in pr-14">
           {(workout.distance || calculatedPace) && (
              <p>
                <span className="font-semibold text-slate-700">Actual:</span>
                {workout.distance && ` ${workout.distance} mi`}
                {workout.timeMinutes !== undefined && workout.timeSeconds !== undefined && ` in ${workout.timeMinutes || 0}m ${workout.timeSeconds || 0}s`}
                {calculatedPace && <span className="font-bold text-sky-600"> ({calculatedPace})</span>}
            </p>
           )}
          {workout.actualWorkout && (
            <p className="italic text-slate-500"><span className="font-semibold text-slate-700 not-italic">Notes:</span> "{workout.actualWorkout}"</p>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-3 space-y-3 animate-fade-in">
           <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Log Actuals</label>
              <div className="grid grid-cols-3 gap-2">
                 <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="Dist." aria-label="Distance in miles" className="w-full p-2 text-sm rounded-md border-slate-300 focus:ring-sky-500 focus:border-sky-500" min="0" step="0.01" />
                 <input type="number" value={timeMinutes} onChange={e => setTimeMinutes(e.target.value)} placeholder="Mins" aria-label="Time in minutes" className="w-full p-2 text-sm rounded-md border-slate-300 focus:ring-sky-500 focus:border-sky-500" min="0"/>
                 <input type="number" value={timeSeconds} onChange={e => setTimeSeconds(e.target.value)} placeholder="Secs" aria-label="Time in seconds" className="w-full p-2 text-sm rounded-md border-slate-300 focus:ring-sky-500 focus:border-sky-500" min="0" max="59"/>
              </div>
            </div>
          <div>
            <label htmlFor={`actual-${weekIndex}-${dayIndex}`} className="block text-sm font-semibold text-slate-700 mb-1">
              Notes (optional):
            </label>
            <textarea
              id={`actual-${weekIndex}-${dayIndex}`}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 text-sm text-slate-700 bg-white rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              rows={2}
              placeholder="e.g., Felt strong, beautiful weather."
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-3 py-1 bg-sky-600 text-white text-xs font-semibold rounded-md hover:bg-sky-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-300">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!isEditing && !workout.status && (
          <>
            <button onClick={handleStartEditing} aria-label="Complete workout" className="w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 transition-colors">
              <CheckIcon className="w-4 h-4" />
            </button>
            <button onClick={handleSkip} aria-label="Skip workout" className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
              <XIcon className="w-4 h-4" />
            </button>
          </>
        )}
        {!isEditing && workout.status && (
          <>
            <button onClick={handleStartEditing} aria-label="Edit workout" className="w-7 h-7 flex items-center justify-center bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors">
              <PencilIcon className="w-4 h-4" />
            </button>
             <button onClick={handleClearStatus} aria-label="Clear status" className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
              <XIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </li>
  );
};


const PlanDisplay: React.FC<PlanDisplayProps> = ({
  plan,
  planStartDate,
  onUpdateWorkout,
  onGetFeedback,
  feedback,
  isFeedbackLoading,
}) => {
  const startDate = useMemo(() => {
    if (!planStartDate) return null;
    return new Date(`${planStartDate}T00:00:00`);
  }, [planStartDate]);

  if (!startDate) {
    return null;
  }

  // This is a small helper component specific to PlanDisplay
  const FeedbackSection: React.FC<{ weekIndex: number }> = ({ weekIndex }) => {
    if (weekIndex === 0) return null; // No feedback for the first week

    const prevWeekWorkouts = plan.weeks[weekIndex - 1].dailyWorkouts;
    const isPrevWeekLogged = prevWeekWorkouts.some(w => w.status);
    
    const feedbackForWeek = feedback[weekIndex];

    if (feedbackForWeek) {
      return (
        <blockquote className="mt-4 p-4 bg-sky-50 border-l-4 border-sky-400 animate-fade-in">
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-sky-500" />
            <h4 className="font-semibold text-sky-700">AI Coach Feedback</h4>
          </div>
          <p className="mt-2 text-sm text-slate-700 italic">"{feedbackForWeek}"</p>
        </blockquote>
      );
    }

    if (isFeedbackLoading === weekIndex) {
      return (
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 py-2">
           <div className="w-5 h-5 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
          <span>Analyzing your progress...</span>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <button
          onClick={() => onGetFeedback(weekIndex)}
          disabled={!isPrevWeekLogged || isFeedbackLoading !== null}
          className="px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-100 rounded-lg hover:bg-sky-200 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <SparkleIcon className="w-4 h-4" />
          Get AI Feedback
        </button>
        {!isPrevWeekLogged && <p className="text-xs text-slate-400 mt-1 italic">Log a workout from Week {weekIndex} to enable feedback.</p>}
      </div>
    );
  };

  let currentDatePointer = new Date(startDate);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
      <div className="text-center mb-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200/80">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{plan.title}</h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">{plan.introduction}</p>
      </div>

      <div className="space-y-6">
        {plan.weeks.map((week, weekIndex) => {
          const weekStartDate = new Date(currentDatePointer);
          const daysInWeek = week.dailyWorkouts.length;
          
          if (daysInWeek === 0) return null; // Avoid rendering empty weeks
          
          const weekEndDate = addDays(weekStartDate, daysInWeek - 1);
          
          // Move pointer for the next week's start
          currentDatePointer = addDays(weekEndDate, 1);

          return (
            <div key={week.weekNumber} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/60 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-sky-600">
                Week {week.weekNumber}
                <span className="ml-3 font-normal text-slate-500 text-base">
                  ({formatDate(weekStartDate)} - {formatDate(weekEndDate)})
                </span>
              </h3>
              <p className="text-slate-500 mt-1 mb-4 text-sm">{week.summary}</p>
              
              <FeedbackSection weekIndex={weekIndex} />

              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {week.dailyWorkouts.map((workout, dayIndex) => {
                  const workoutDate = addDays(weekStartDate, dayIndex);
                  return (
                    <DailyWorkoutCard 
                        key={`${workout.day}-${dayIndex}`}
                        workout={workout}
                        date={workoutDate}
                        weekIndex={weekIndex}
                        dayIndex={dayIndex}
                        onUpdate={onUpdateWorkout}
                    />
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