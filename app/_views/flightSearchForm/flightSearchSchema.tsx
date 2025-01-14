import { z } from "zod";

const locationSchema = z.object({
  address: z.object({
    cityName: z.string(),
    cityCode: z.string(),
    countryName: z.string(),
    countryCode: z.string(),
    stateCode: z.string().optional(),
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
  self: z
    .object({
      href: z.string(),
      methods: z.array(z.string()),
    })
    .optional(),
  subType: z.string().optional(),
  timeZoneOffset: z.string().optional(),
  type: z.string(),
});

export const flightSearchSchema = z.object({
  origin: locationSchema,
  destination: locationSchema,
  departureDate: z.date(),
  returnDate: z.date().optional(),
  travelers: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  }),
  travelClass: z.string().optional(),
  nonStop: z.boolean(),
  oneWay: z.boolean(),
});

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
