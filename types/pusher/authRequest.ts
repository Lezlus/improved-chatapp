import { z } from 'zod';

const pushAuthRequest = z.object({
  socket_id: z.string(),
  channel_name: z.string()
})

export const validatePushAuthRequest = (input: any) => {
  return pushAuthRequest.safeParseAsync(input)
}