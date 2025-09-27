import { GoogleGenAI, Type } from "@google/genai";
import { RunningPlan, DailyWorkout } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy title for the training plan." },
    introduction: { type: Type.STRING, description: "A brief, encouraging introduction to the plan." },
    weeks: {
      type: Type.ARRAY,
      description: "An array of weekly training schedules.",
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER, description: "The week number, starting from 1." },
          summary: { type: Type.STRING, description: "A short summary of the focus for this week." },
          dailyWorkouts: {
            type: Type.ARRAY,
            description: "A list of workouts for each day of the week.",
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "The day of the week (e.g., 'Monday')." },
                workout: { type: Type.STRING, description: "The specific workout for the day (e.g., '3 miles easy pace', 'Rest')." },
              },
              required: ["day", "workout"],
            },
          },
        },
        required: ["weekNumber", "summary", "dailyWorkouts"],
      },
    },
    conclusion: { type: Type.STRING, description: "A final, motivational message for the runner." },
  },
  required: ["title", "introduction", "weeks", "conclusion"],
};

export const generateRunningPlan = async (race: string, pace: string, goalDate: string, todayDate: string): Promise<RunningPlan> => {
  const raceName = race === '5k' ? '5K' : race.charAt(0).toUpperCase() + race.slice(1).replace('-', ' ');
  const prompt = `You are an expert running coach. Create a personalized training plan for a runner aiming to complete a ${raceName}.
Their target race pace is ${pace} per mile.
The runner's goal race is on ${goalDate}.
Today's date is ${todayDate}.

**IMPORTANT STRUCTURE RULE:** The training plan must be structured into weeks that end on Sunday.
- The very first week should start on today's date (${todayDate}) and end on the upcoming Sunday. This means the first week might be a partial week (fewer than 7 days).
- Every subsequent week must be a full week, running from Monday to Sunday.

The plan should gradually build in intensity and mileage to prevent injury and have the runner peak for race day. The total duration of the plan must fit within the timeframe from today to the goal date. The final week should be a taper week.

Provide clear, concise descriptions for each day's workout, including a mix of easy runs, long runs, speed work (like intervals or tempo runs), and rest days.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    // In case the API wraps the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    
    const generatedPlan = JSON.parse(cleanedJsonText);
    
    return {
      ...generatedPlan,
      targetPace: pace,
    };

  } catch (error) {
    console.error("Error generating running plan:", error);
    throw new Error("Failed to generate a training plan. The model may be overloaded. Please try again later.");
  }
};


export const generateFeedback = async (plan: RunningPlan, weekIndex: number): Promise<string> => {
    // We want feedback for week with `weekIndex`, based on performance in weeks `0` to `weekIndex - 1`.
    const previousWeeks = plan.weeks.slice(0, weekIndex);

    let performanceSummary = "";
    previousWeeks.forEach(week => {
        performanceSummary += `Week ${week.weekNumber}:\n`;
        week.dailyWorkouts.forEach(workout => {
            let actual = "Not logged.";
            if (workout.status === 'completed') {
                const details = [];
                if (workout.distance && workout.distance > 0) {
                    const timeStr = `${workout.timeMinutes || 0}m ${workout.timeSeconds || 0}s`;
                    const totalSeconds = (workout.timeMinutes || 0) * 60 + (workout.timeSeconds || 0);

                    if (totalSeconds > 0) {
                         const paceInSecondsPerMile = totalSeconds / workout.distance;
                         const paceMinutes = Math.floor(paceInSecondsPerMile / 60);
                         const paceSeconds = Math.round(paceInSecondsPerMile % 60);
                         const paceStr = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} / mile`;
                         details.push(`${workout.distance} miles in ${timeStr} (Pace: ${paceStr})`);
                    } else {
                        details.push(`${workout.distance} miles`);
                    }
                }
                 if (workout.actualWorkout) {
                    details.push(`Notes: "${workout.actualWorkout}"`);
                }

                if (details.length > 0) {
                    actual = `Completed. Actual: ${details.join('. ')}`;
                } else {
                     actual = 'Logged as complete.';
                }

            } else if (workout.status === 'skipped') {
                actual = "Skipped.";
            }
            performanceSummary += `- ${workout.day}: Planned "${workout.workout}". Status: ${actual}\n`;
        });
        performanceSummary += '\n';
    });

    if (performanceSummary.trim() === "") {
        return "Log some workouts in the previous week to get feedback.";
    }

    const prompt = `You are an expert, encouraging running coach. A runner is following a training plan for a ${plan.title}.
Their goal is to run the race at a target pace of ${plan.targetPace} per mile.

Here is their logged performance from the previous weeks, including distance, time, calculated pace, and personal notes:
${performanceSummary}

The plan for the upcoming week (Week ${plan.weeks[weekIndex].weekNumber}) is:
${plan.weeks[weekIndex].dailyWorkouts.map(d => `- ${d.day}: ${d.workout}`).join('\n')}

Based *only* on the detailed performance data above, provide detailed, insightful, and prescriptive feedback for the upcoming week. Your feedback should be structured in three parts:

1.  **Overall Insight:** A brief, high-level summary of their recent training (2 sentences max).
2.  **Key Observations:** A bulleted list of 2-3 specific, data-driven observations. Analyze their consistency, pacing (especially in relation to their target pace and the nature of the planned workouts like 'easy', 'tempo', etc.), and any notes they've provided. Use asterisks for bullet points.
3.  **Focus for This Week:** A short paragraph with 1-2 actionable pieces of advice for the upcoming week. Should they push harder, ease off, focus on recovery, or adjust their approach to a specific workout?

Address the runner directly in a positive and motivational tone (e.g., "You're doing great..."). Do not simply repeat the plan. Start directly with the feedback. Use markdown for bolding (**text**).`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              temperature: 0.8,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating feedback:", error);
        throw new Error("Failed to generate feedback. The model may be busy. Please try again.");
    }
};
