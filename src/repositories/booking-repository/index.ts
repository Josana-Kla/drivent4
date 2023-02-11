import { prisma } from "@/config";

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function findRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    }
  });
}

async function newBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function updateBooking(bookingId: number, roomId: number,  userId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    }, 
    data: {
      userId,
      roomId
    }
  });
}

const bookingRepository = {
  findBookings,
  findRoom,
  newBooking,
  updateBooking
};
  
export default bookingRepository;
