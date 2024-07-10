import { groupMembershipsSchema } from "./groupMemberships";
import { userUnpopulatedSchema } from "./userUnpopulated";
import { z } from 'zod';

export const groupsSchema = z.object({
  _id: z.string(),
  groupName: z.string(),
  createdBy: userUnpopulatedSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  groupMemberships: groupMembershipsSchema.array()
})

const createGroupSchema = z.object({
  groupName: z.string().regex(new RegExp("^[a-zA-Z](\\w|\\s){2,20}$")),
  createdBy: z.string(),
  groupMemberships: z.string().array(),
}); 

const getGroupSchema = z.object({
  groupName: z.string().min(3),
})

export const validateCreateGroupSchema = (input: any) => {
  return createGroupSchema.safeParseAsync(input);
}

export const validateGetGroupSchema = (input: any) => {
  return getGroupSchema.parse(input);
}


export type GroupSchemaType = z.infer<typeof groupsSchema>;
export type CreateGroupSchemaType = z.infer<typeof createGroupSchema>;