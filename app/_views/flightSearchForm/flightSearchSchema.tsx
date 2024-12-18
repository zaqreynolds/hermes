import { z } from "zod";

const locationSchema = z.object({
  address: z.object({
    cityName: z.string(),
    cityCode: z.string(),
    countryName: z.string(),
    countryCode: z.string(),
    stateCode: z.string(),
  }),
  analytics: z.object({
    travelers: z.object({
      score: z.number(),
    }),
  }),
  detailedName: z.string(),
  geoCode: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  iataCode: z.string(),
  id: z.string(),
  name: z.string(),
  self: z.object({
    href: z.string(),
    methods: z.array(z.string()),
  }),
  subType: z.string(),
  timeZoneOffset: z.string(),
  type: z.string(),
});

const baseSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
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

export const compactFlightSearchSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  departureDate: z.date(),
  returnDate: z.date().optional(),
  travelers: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  }),
  travelClass: z.string().optional(),
  nonStop: z.boolean(),
});
