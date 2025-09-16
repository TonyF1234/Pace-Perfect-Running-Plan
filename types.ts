export interface DailyWorkout {
  day: string;
  workout: string;
  status?: 'completed' | 'skipped';
  actualWorkout?: string; // Notes
  distance?: number; // in miles
  timeMinutes?: number;
  timeSeconds?: number;
}

export interface WeeklyPlan {
  weekNumber: number;
  summary: string;
  dailyWorkouts: DailyWorkout[];
}

export interface RunningPlan {
  title: string;
  introduction: string;
  weeks: WeeklyPlan[];
  conclusion: string;
}