import { ApplicationError } from "@/protocols";

export function cannotBookingRoom(): ApplicationError {
  return {
    name: "CannotBookingRoomError",
    message: "Cannot booking room!",
  };
}
