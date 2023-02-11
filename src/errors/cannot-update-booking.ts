import { ApplicationError } from "@/protocols";

export function cannotUpdateBooking(): ApplicationError {
  return {
    name: "CannotUpdateBookingError",
    message: "Cannot update booking!",
  };
}
