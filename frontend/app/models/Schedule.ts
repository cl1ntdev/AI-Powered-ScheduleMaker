export type DayOfWeek = 
  | "Monday" 
  | "Tuesday" 
  | "Wednesday" 
  | "Thursday" 
  | "Friday" 
  | "Saturday" 
  | "Sunday";
  
export interface ScheduleBase {
  schedule: Record<DayOfWeek, ScheduleDay[]>;
}

export interface ScheduleDay {
  time: string;
  meridiem: string;
  title: string; 
}

export interface Schedule { // this the one use as result
  Monday: ScheduleDay[];
  Tuesday: ScheduleDay[];
  Wednesday: ScheduleDay[];
  Thursday: ScheduleDay[];
  Friday: ScheduleDay[];
  Saturday: ScheduleDay[];
  Sunday: ScheduleDay[];
}