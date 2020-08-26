import { Room } from "types/room";

/**
 * Maps rooms from Firebase to include the Room ID
 */
export const roomsWithId = (firebaseRoom: any) => {
  const roomEntries: Array<Array<any>> = Object.entries(firebaseRoom);
  const rooms: Room[] = roomEntries.map((roomEntry) => ({
    key: roomEntry[0],
    ...roomEntry[1],
  }));
  return rooms;
};

/**
 * Sort rooms by most Popular
 */
export const byMostPopular = (a: Room, z: Room) =>
  z.listeners._count - a.listeners._count;
