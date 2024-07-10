import { z } from 'zod';
import { userUnpopulatedSchema } from './userUnpopulated';

export const groupMembershipsSchema = z.object({
  group: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: userUnpopulatedSchema,
});

export const createGroupMembershipsSchema = z.object({
  group: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.string(),
})

export type GroupMembershipType = z.infer<typeof groupMembershipsSchema>;
export type CreateGroupMembershipType = z.infer<typeof createGroupMembershipsSchema>;

