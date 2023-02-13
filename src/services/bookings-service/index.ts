import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { TicketStatus } from "@prisma/client";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { cannotBookingRoom } from "@/errors/cannot-booking-room";
import { cannotUpdateBooking } from "@/errors/cannot-update-booking";

async function getBookings(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if(ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
    throw cannotListHotelsError();
  }

  const booking = await bookingRepository.findBookings(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if(ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
    throw cannotListHotelsError();
  }

  const room = await bookingRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  if(room.Booking.length >= room.capacity) {
    throw cannotBookingRoom();
  }

  const booking = await bookingRepository.newBooking(userId, roomId);

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) {
    throw notFoundError();
  }

  if(ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false) {
    throw cannotListHotelsError();
  }

  const room = await bookingRepository.findRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  if(room.Booking.length >= room.capacity) {
    throw cannotBookingRoom();
  }

  const booking = await bookingRepository.findBookings(userId);
  if(!booking || booking.userId !== userId) {
    throw cannotUpdateBooking();
  }

  const toUpdate = {
    id: bookingId, 
    roomId, 
    userId
  };
  
  const bookingUpdated = await bookingRepository.updateBooking(toUpdate.id, toUpdate.roomId, toUpdate.userId);

  return bookingUpdated;
}

const bookingsService = {
  getBookings,
  createBooking,
  updateBooking
};

export default bookingsService;
