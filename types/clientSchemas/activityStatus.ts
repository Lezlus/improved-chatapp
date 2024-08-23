import { z } from 'zod';

export const changeActivityStatus = z.object({
  id: z.string(),
  activityStatus: z.enum(["ONLINE", "OFFLINE", "AWAY", "DO NOT DISTURB", "IDLE"]),
})

export const changeOnlineActivity = z.object({
  id: z.string(),
  
})

export const validateChangeActivityStatus = (input: any) => {
  return changeActivityStatus.safeParseAsync(input);
}

export const validateChangeOnlineActivity = (input: any) => {
  return changeOnlineActivity.safeParseAsync(input);
} 

export type changeActivityStatusType = z.infer<typeof changeActivityStatus>;
export type changeOnlineActivityType = z.infer<typeof changeOnlineActivity>;
