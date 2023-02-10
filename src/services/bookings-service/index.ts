import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { TicketStatus } from "@prisma/client";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

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
  
  console.log(booking);

  return booking;
}

const bookingsService = {
  getBookings,
};

export default bookingsService;
