import { toPusherKey } from "./toPusherKey";
export function sortObjectIds(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort().join(":");
  return sortedIds;
}