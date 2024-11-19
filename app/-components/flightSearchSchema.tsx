import { z } from "zod";

const baseSchema = z.object({
  origin: z.object({
    iataCode: z.string(),
  }),
  destination: z.object({
    iataCode: z.string(),
  }),
  departureDate: z.date(),
  travelers: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  }),
  travelClass: z.string().optional(),
  nonStop: z.boolean(),
});

const oneWaySchema = baseSchema.extend({
  oneWay: z.literal(true),
  returnDate: z.undefined(),
});

const roundTripSchema = baseSchema.extend({
  oneWay: z.literal(false),
  returnDate: z.date(),
});

export const flightSearchSchema = z.union([oneWaySchema, roundTripSchema]);
