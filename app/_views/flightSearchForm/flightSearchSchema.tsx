import { z } from "zod";

const locationSchema = z.object({
  address: z.object({
    cityName: z.string(),
    cityCode: z.string().optional().default(""),
    countryName: z.string(),
    countryCode: z.string().optional().default(""),
    stateCode: z.string().optional().default(""),
  }),
  analytics: z
    .object({
      travelers: z.object({
        score: z.number(),
      }),
    })
    .optional()
    .default({ travelers: { score: 0 } }),
  detailedName: z.string().optional().default(""),
  geoCode: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional()
    .default({ latitude: 0, longitude: 0 }),
  iataCode: z.string(),
  id: z.string().optional().default(""),
  name: z.string(),
  self: z
    .object({
      href: z.string(),
      methods: z.array(z.string()),
    })
    .optional(),
  subType: z.string().optional().default(""),
  timeZoneOffset: z.string().optional().default(""),
  type: z.string().optional().default(""),
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
