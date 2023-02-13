import { prisma } from "@/config";

export async function createBooking(roomId: number,  userId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}
