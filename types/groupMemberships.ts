import { z } from 'zod';
import { userUnpopulatedSchema } from './userUnpopulated';

export const groupMembershipsSchema = z.object({
  groupId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: userUnpopulatedSchema,
});

export type GroupMembershipType = z.infer<typeof groupMembershipsSchema>;
