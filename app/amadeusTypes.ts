import * as http from "node:http";
import * as https from "node:https";
import {
  OutgoingHttpHeaders,
  IncomingHttpHeaders,
  IncomingMessage,
} from "http";
import { RequestOptions } from "https";
import { OutgoingHttpHeaders as OutgoingHttpHeaders$1 } from "http2";

type Verb = "GET" | "POST" | "PUT" | "DELETE";

interface IRequest {
  host: string;
  port: number;
  ssl: boolean;
  scheme: string;
  verb: Verb;
  path: string;
  params: any;
  queryPath: string;
  bearerToken: string | null;
  clientVersion: string;
  languageVersion: string;
  appId: string | null;
  appVersion: string | null;
  headers: OutgoingHttpHeaders;
}

declare class Request implements IRequest {
  appId: string | null;
  appVersion: string | null;
  bearerToken: string | null;
  clientVersion: string;
  headers: OutgoingHttpHeaders$1;
  host: string;
  languageVersion: string;
  params: any;
  path: string;
  port: number;
  queryPath: string;
  scheme: string;
  ssl: boolean;
  verb: Verb;
  constructor(options: Omit<IRequest, "headers" | "scheme" | "queryPath">);
  options(): RequestOptions;
  body(): any;
  private userAgent;
  private fullQueryPath;
  private addAuthorizationHeader;
  private addContentTypeHeader;
  private addHTTPOverrideHeader;
}

declare class Response<T = unknown, K = unknown> implements IResponse<T, K> {
  headers: IncomingHttpHeaders;
  statusCode: number | undefined;
  body: string;
  result: T | null;
  data: K | null;
  parsed: boolean;
  request: Request;
  private error;
  constructor(http_response: IncomingMessage | Error, request: Request);
  addChunk(chunk: string): void;
  parse(): void;
  success(): boolean;
  private isJson;
  returnResponseError(): ReturnedResponseError;
  returnResponseSuccess(): ReturnedResponseSuccess<T, K>;
}

interface IResponse<T, K> {
  headers: IncomingHttpHeaders;
  statusCode: number | undefined;
  body: string;
  result: T | null;
  data: K | null;
  parsed: boolean;
  request: Request;
}
type ReturnedResponseError<T = unknown, K = unknown> = Omit<
  Response<T, K>,
  | "addChunk"
  | "parse"
  | "success"
  | "returnResponseError"
  | "returnResponseSuccess"
  | "error"
>;
type ReturnedResponseSuccess<T, K> = Omit<
  ReturnedResponseError<T, K>,
  "result" | "data" | "statusCode"
> & {
  statusCode: number;
  result: T;
  data: K;
};

declare class Client implements Options {
  private accessToken;
  version: string;
  clientId: string;
  clientSecret: string;
  logger: Console;
  logLevel: LogLevel;
  hostname: Hostname;
  host: string;
  ssl: boolean;
  port: number;
  http: Network;
  customAppId?: string;
  customAppVersion?: string;
  constructor(options?: Options);
  get<T, K = unknown>(
    path: string,
    params?: object
  ): Promise<ReturnedResponseSuccess<T, K>>;
  post<T, K = unknown>(
    path: string,
    params?: object | string
  ): Promise<ReturnedResponseSuccess<T, K>>;
  delete<T, K>(
    path: string,
    params?: object
  ): Promise<ReturnedResponseSuccess<T, K>>;
  request<T, K>(
    verb: Verb,
    path: string,
    params?: object | string
  ): Promise<ReturnedResponseSuccess<T, K>>;
  unauthenticatedRequest<T, K>(
    verb: Verb,
    path: string,
    params?: object | string,
    bearerToken?: string | null
  ): Promise<ReturnedResponseSuccess<T, K>>;
  private execute;
  private buildRequest;
  private buildPromise;
  log(request: Request): void;
  debug(): boolean;
  warn(): boolean;
}

type Issue = {
  status?: number;
  code?: number;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    example?: string;
  };
};
type CollectionMeta = {
  count?: number;
  oneWayCombinations?: OneWayCombinations;
};
type OneWayCombinations = {
  originDestinationId?: string;
  flightOfferIds?: string[];
}[];
type CollectionMetaLink = {
  count?: number;
  links?: CollectionLinks;
};
type CollectionLinks = {
  self?: string;
  next?: string;
  previous?: string;
  last?: string;
  first?: string;
  up?: string;
};
type LocationValue$2 = {
  cityCode?: string;
  countryCode?: string;
};
type LocationEntry = Record<string, LocationValue$2>;
type AircraftEntry = Record<string, string>;
type CurrencyEntry = Record<string, string>;
type CarrierEntry = Record<string, string>;
type FlightSegment = {
  departure: FlightEndPoint;
  arrival: FlightEndPoint;
  carrierCode: string;
  number: string;
  aircraft: AircraftEquipment$1;
  operating: OperatingFlight$1;
  duration: string;
  stops?: FlightStop[];
};
type FlightEndPoint = {
  iataCode: string;
  terminal?: string;
  at: string;
};
type OriginalFlightStop = {
  iataCode: string;
  duration: string;
};
type FlightStop = OriginalFlightStop & {
  arrivalAt: string;
  departureAt: string;
};
type AircraftEquipment$1 = {
  code: string;
};
type OperatingFlight$1 = {
  carrierCode: string;
};
type CurrencyCode =
  | "CAD"
  | "HKD"
  | "ISK"
  | "PHP"
  | "DKK"
  | "HUF"
  | "CZK"
  | "AUD"
  | "RON"
  | "SEK"
  | "IDR"
  | "INR"
  | "BRL"
  | "RUB"
  | "HRK"
  | "JPY"
  | "THB"
  | "EUR"
  | "CHF"
  | "SGD"
  | "PLN"
  | "BGN"
  | "TRY"
  | "CNY"
  | "NOK"
  | "NZD"
  | "ZAR"
  | "USD"
  | "MXN"
  | "ILS"
  | "GBP"
  | "KRW"
  | "MYR";
type Price$5 = {
  currency: string;
  total: string;
  base: string;
  fees: Fee$2[];
  taxes?: Tax$3[];
  refundableTaxes?: string;
};
type ExtendedPrice = {
  margin?: string;
  grandTotal?: string;
  billingCurrency?: string;
  additionalServices?: {
    amount?: string;
    type?: AdditionalServiceType;
  }[];
} & Price$5;
type AdditionalServiceType =
  | "CHECKED_BAGS"
  | "MEALS"
  | "SEATS"
  | "OTHER_SERVICES";
type Fee$2 = {
  amount: string;
  type: FeeType;
};
type FeeType = "TICKETING" | "FORM_OF_PAYMENT" | "SUPPLIER";
type Tax$3 = {
  amount?: string;
  code?: string;
};
type Co2Emission = {
  weight?: number;
  weightUnit?: string;
  cabin?: TravelClass;
};
type TravelClass = "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
type DateTimeType = {
  date: string;
  time?: string;
};
type CarrierRestrictions = {
  blacklistedInEUAllowed?: boolean;
  excludedCarrierCodes?: string[];
  includedCarrierCodes?: string[];
};
type ConnectionRestriction = {
  maxNumberOfConnections?: number;
  nonStopPreferred?: boolean;
  airportChangeAllowed?: boolean;
  technicalStopsAllowed?: boolean;
};
type CabinRestriction = {
  cabin?: TravelClass;
  originDestinationIds?: string[];
};
type FlightOffer = {
  type: string;
  id: string;
  source: FlightOfferSource;
  instantTicketingRequired: boolean;
  disablePricing?: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  paymentCardRequired?: boolean;
  lastTicketingDate?: string;
  lastTicketingDateTime?: string;
  numberOfBookableSeats: number;
  itineraries: {
    duration: string;
    segments: Segment$1[];
  }[];
  price: ExtendedPrice;
  pricingOptions?: {
    fareType?: PricingOptionsFareType;
    includedCheckedBagsOnly?: boolean;
    refundableFare?: boolean;
    noRestrictionFare?: boolean;
    noPenaltyFare?: boolean;
  };
  validatingAirlineCodes?: string[];
  travelerPricings?: {
    travelerId: string;
    fareOption: TravelerPricingFareOption;
    travelerType: TravelerType;
    associatedAdultId?: string;
    price?: Price$5;
    fareDetailsBySegment: {
      segmentId: string;
      cabin?: TravelClass;
      fareBasis?: string;
      brandedFare?: string;
      class?: string;
      isAllotment?: boolean;
      allotmentDetails?: AllotmentDetails;
      sliceDiceIndicator?: SliceDiceIndicator;
      includedCheckedBags?: BaggageAllowance;
      additionalServices?: {
        chargeableCheckedBags?: ChargeableCheckdBags;
        chargeableSeat?: ChargeableSeat;
        chargeableSeatNumber?: string;
        otherServices?: ServiceName[];
      };
    }[];
  }[];
  fareRules?: FareRules;
};
type Segment$1 = {
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  co2Emissions?: Co2Emission[];
} & FlightSegment;
type TravelerType =
  | "ADULT"
  | "CHILD"
  | "SENIOR"
  | "YOUNG"
  | "HELD_INFANT"
  | "SEATED_INFANT"
  | "STUDENT";
type FlightOfferSource = "GDS";
type TravelerPricingFareOption =
  | "STANDARD"
  | "INCLUSIVE_TOUR"
  | "SPANISH_MELILLA_RESIDENT"
  | "SPANISH_CEUTA_RESIDENT"
  | "SPANISH_CANARY_RESIDENT"
  | "SPANISH_BALEARIC_RESIDENT"
  | "AIR_FRANCE_METROPOLITAN_DISCOUNT_PASS"
  | "AIR_FRANCE_DOM_DISCOUNT_PASS"
  | "AIR_FRANCE_COMBINED_DISCOUNT_PASS"
  | "AIR_FRANCE_FAMILY"
  | "ADULT_WITH_COMPANION"
  | "COMPANION";
type SliceDiceIndicator =
  | "LOCAL_AVAILABILITY"
  | "SUB_OD_AVAILABILITY_1"
  | "SUB_OD_AVAILABILITY_2";
type Dictionaries$3 = {
  locations?: LocationEntry;
  aircraft?: AircraftEntry;
  currencies?: CurrencyEntry;
  carriers?: CarrierEntry;
};
type AllotmentDetails = {
  tourName?: string;
  tourReference?: string;
};
type TravelerInfo = {
  id: string;
  travelerType: TravelerType;
  associatedAdultId?: string;
};
type ChargeableCheckdBags = BaggageAllowance & {
  id?: string;
};
type ChargeableSeat = {
  id?: string;
  number?: string;
};
type BaggageAllowance = {
  quantity?: number;
  weight?: number;
  weightUnit?: string;
};
type ServiceName = "PRIORITY_BOARDING" | "AIRPORT_CHECKIN";
type PricingOptionsFareType = ("PUBLISHED" | "NEGOTIATED" | "CORPORATE")[];
type Stakeholder = {
  id?: string;
  dateOfBirth?: string;
  gender?: StakeholderGender;
  name?: Name$1;
  documents?: IdentityDocument[];
};
type StakeholderGender = "MALE" | "FEMALE";
type IdentityDocument = Document & {
  documentType?: DocumentType;
  validityCountry?: string;
  birthCountry?: string;
  holder?: boolean;
};
type Document = {
  number?: string;
  issuanceDate?: string;
  expiryDate?: string;
  issuanceCountry?: string;
  issuanceLocation?: string;
  nationality?: string;
  birthPlace?: string;
};
type DocumentType =
  | "VISA"
  | "PASSPORT"
  | "IDENTITY_CARD"
  | "KNOWN_TRAVELER"
  | "REDRESS";
type EmergencyContact = {
  addresseeName?: string;
  countryCode?: string;
  number?: string;
  text?: string;
};
type LoyaltyProgram = {
  programOwner?: string;
  id?: string;
};
type Discount = {
  subType?: DiscountType;
  cityName?: string;
  travelerType?: DiscountTravelerType;
  cardNumber?: string;
  certificateNumber?: string;
};
type DiscountType =
  | "SPANISH_RESIDENT"
  | "AIR_FRANCE_DOMESTIC"
  | "AIR_FRANCE_COMBINED"
  | "AIR_FRANCE_METROPOLITAN";
type DiscountTravelerType =
  | "SPANISH_CITIZEN"
  | "EUROPEAN_CITIZEN"
  | "GOVERNMENT_WORKER"
  | "MILITARY"
  | "MINOR_WITHOUT_ID";
type Name$1 = BaseName & {
  secondLastName?: string;
};
type BaseName = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
};
type ElementaryPrice = {
  amount?: string;
  currencyCode?: CurrencyCode;
};
type Traveler = Stakeholder & {
  emergencyContact?: EmergencyContact;
  loyaltyPrograms?: LoyaltyProgram[];
  discountEligibility?: Discount[];
  contact?: Contact$2;
};
type Contact$2 = ContactDictionary & {
  phones?: Phone[];
  companyName?: string;
  emailAddress?: string;
};
type ContactPurpose = "STANDARD" | "INVOICE" | "STANDARD_WITHOUT_TRANSMISSION";
type ContactDictionary = {
  addresseeName?: Name$1;
  address?: Address$5;
  language?: string;
  purpose?: ContactPurpose;
};
type Address$5 = {
  lines?: string[];
  postalCode?: string;
  countryCode?: string;
  cityName?: string;
  stateName?: string;
  postalBox?: string;
};
type Phone = {
  deviceType?: PhoneDeviceType;
  countryCallingCode?: string;
  number?: string;
};
type PhoneDeviceType = "MOBILE" | "LANDLINE" | "FAX";
type Remarks = {
  general?: GeneralRemark[];
  airline?: AirlineRemark[];
};
type GeneralRemark = {
  subType: GeneralRemarkType;
  category?: string;
  text: string;
  travelerIds?: string[];
  flightOfferIds?: string[];
};
type GeneralRemarkType =
  | "GENERAL_MISCELLANEOUS"
  | "CONFIDENTIAL"
  | "INVOICE"
  | "QUALITY_CONTROL"
  | "BACKOFFICE"
  | "FULFILLMENT"
  | "ITINERARY"
  | "TICKETING_MISCELLANEOUS"
  | "TOUR_CODE";
type AirlineRemark = {
  subType: AirlineRemarkType;
  keyword?: string;
  airlineCode: string;
  text: string;
  travelerIds?: string[];
  flightOfferIds?: string[];
};
type AirlineRemarkType =
  | "OTHER_SERVICE_INFORMATION"
  | "KEYWORD"
  | "OTHER_SERVICE"
  | "CLIENT_ID"
  | "ADVANCED_TICKET_TIME_LIMIT";
type TicketingAgreement = {
  option?: TicketingAgreementOption;
  delay?: string;
  dateTime?: string;
  segmentIds?: string[];
};
type TicketingAgreementOption =
  | "CONFIRM"
  | "DELAY_TO_QUEUE"
  | "DELAY_TO_CANCEL";
type AssociatedRecordCommon = {
  reference?: string;
  creationDate?: string;
  originSystemCode?: string;
};
type AssociatedRecord = AssociatedRecordCommon & {
  flightOfferId?: string;
};
type FlightOrder$1 = {
  type: "flight-order";
  id?: string;
  queuingOfficeId?: string;
  ownerOfficeId?: string;
  associatedRecords?: AssociatedRecord[];
  flightOffers: FlightOffer[];
  travelers?: Traveler[];
  remarks?: Remarks;
  formOfPayments?: FormOfPayment[];
  ticketingAgreement?: TicketingAgreement;
  automatedProcess?: AutomatedProcess[];
  contacts?: Contact$2[];
  tickets?: AirTravelDocument[];
  formOfIdentifications?: FormOfIdentification[];
};
type FormOfIdentification = {
  identificationType?:
    | "DRIVERS_LICENSE"
    | "PASSPORT"
    | "NATIONAL_IDENTITY_CARD"
    | "BOOKING_CONFIRMATION"
    | "TICKET"
    | "OTHER_ID";
  carrierCode?: string;
  number?: string;
  travelerIds?: string[];
  flightOfferIds?: string[];
};
type AutomatedProcessCommon = {
  code?: AutomatedProcessCode;
  queue?: {
    number?: string;
    category?: string;
  };
  text?: string;
};
type AutomatedProcess = AutomatedProcessCommon & {
  delay?: string;
  officeId?: string;
  dateTime?: string;
};
type AutomatedProcessCode = "IMMEDIATE" | "DELAYED" | "ERROR";
type FormOfPayment = {
  b2bWallet?: B2BWallet;
  creditCard?: CreditCard$1;
  other?: OtherMethod;
};
type B2BWallet = {
  cardId?: string;
  cardUsageName?: string;
  cardFriendlyName?: string;
  reportingData?: {
    name?: string;
    value?: string;
  }[];
  virtualCreditCardDetails?: VirtualCreditCardDetails;
  flightOfferIds?: string[];
};
type VirtualCreditCardDetails = CreditCardCommon & ElementaryPrice;
type CreditCard$1 = CreditCardCommon & {
  securityCode?: string;
  flightOfferIds?: string[];
};
type CreditCardCommon = {
  brand?: CreditCardBrand;
  holder?: string;
  number?: string;
  expiryDate?: string;
};
type CreditCardBrand =
  | "VISA"
  | "AMERICAN_EXPRESS"
  | "MASTERCARD"
  | "VISA_ELECTRON"
  | "VISA_DEBIT"
  | "MASTERCARD_DEBIT"
  | "MAESTRO"
  | "DINERS"
  | "EASYPAY";
type OtherMethod = {
  method?: OtherPaymentMethod;
  flightOfferIds?: string[];
};
type OtherPaymentMethod = "ACCOUNT" | "CHECK" | "CASH" | "NONREFUNDABLE";
type AirTravelDocument = AirTravelDocumentCommon & {
  travelerId?: string;
  segmentIds?: string[];
};
type AirTravelDocumentCommon = {
  documentType?: "ETICKET" | "PTICKET" | "EMD" | "MCO";
  documentNumber?: string;
  documentStatus?: "ISSUED" | "REFUNDED" | "VOID" | "ORIGINAL" | "EXCHANGED";
};
type FareRules = {
  currency?: string;
  rules?: TermAndCondition[];
};
type TermAndCondition = {
  category?:
    | "REFUND"
    | "EXCHANGE"
    | "REVALIDATION"
    | "REISSUE"
    | "REBOOK"
    | "CANCELLATION";
  circumstances?: string;
  notApplicable?: boolean;
  maxPenaltyAmount?: string;
  descriptions?: {
    descriptionType?: string;
    text?: string;
  }[];
};
type PaymentBrand =
  | "VISA"
  | "AMERICAN_EXPRESS"
  | "MASTERCARD"
  | "VISA_ELECTRON"
  | "VISA_DEBIT"
  | "MASTERCARD_DEBIT"
  | "MAESTRO"
  | "DINERS"
  | "MASTERCARD_IXARIS"
  | "VISA_IXARIS"
  | "MASTERCARD_AIRPLUS"
  | "UATP_AIRPLUS";
type Defaults$1 = {
  departureDate?: string;
  oneWay?: boolean;
  duration?: string;
  nonStop?: boolean;
  maxPrice?: number;
  viewBy?: "COUNTRY" | "DATE" | "DESTINATION" | "DURATION" | "WEEK";
};
type Links$4 = {
  self?: string;
};
type Meta$7 = {
  currency?: string;
  links?: Links$4;
  defaults?: Defaults$1;
};
type Distance$2 = {
  value?: number;
  unit?: "KM" | "MI";
};
type GeoCode = {
  latitude?: number;
  longitude?: number;
};
type Analytics$5 = {
  flights?: Flights$2;
  travelers?: Travelers$2;
};
type Flights$2 = {
  score?: number;
};
type Travelers$2 = {
  score?: number;
};
type Locations$1 = {
  type?: string;
  subtype?: string;
  name?: string;
  iataCode?: string;
  geoCode?: {
    latitude?: number;
    longitude?: number;
  };
  address?: {
    countryName?: string;
    countryCode?: string;
    stateCode?: string;
    regionCode?: string;
  };
  timeZone?: {
    offSet?: string;
    referenceLocalDateTime?: string;
  };
  metrics?: {
    relevance?: number;
  };
};
type Amenities =
  | "SWIMMING_POOL"
  | "SPA"
  | "FITNESS_CENTER"
  | "AIR_CONDITIONING"
  | "RESTAURANT"
  | "PARKING"
  | "PETS_ALLOWED"
  | "AIRPORT_SHUTTLE"
  | "BUSINESS_CENTER"
  | "DISABLED_FACILITIES"
  | "WIFI"
  | "MEETING_ROOMS"
  | "NO_KID_ALLOWED"
  | "TENNIS"
  | "GOLF"
  | "KITCHEN"
  | "ANIMAL_WATCHING"
  | "BABY_SITTING"
  | "BEACH"
  | "CASINO"
  | "JACUZZI"
  | "SAUNA"
  | "SOLARIUM"
  | "MASSAGE"
  | "VALET_PARKING"
  | "BAR"
  | "LOUNGE"
  | "KIDS_WELCOME"
  | "NO_PORN_FILMS"
  | "MINIBAR"
  | "TELEVISION"
  | "WI-FI_IN_ROOM"
  | "ROOM_SERVICE"
  | "GUARDED_PARKG"
  | "SERV_SPEC_MENU";
type QualifiedFreeText = {
  text?: string;
  lang?: string;
};
type HotelProductPaymentPolicy = {
  creditCards?: string[];
  methods?: (
    | "CREDIT_CARD"
    | "CREDIT_CARD_AGENCY"
    | "CREDIT_CARD_TRAVELER"
    | "VCC_BILLBACK"
    | "VCC_B2B_WALLET"
    | "TRAVEL_AGENT_ID"
    | "AGENCY_ACCOUNT"
    | "CORPORATE_ID"
    | "CHECK"
    | "ADVANCE_DEPOSIT"
    | "COMPANY_ADDRESS"
    | "HOTEL_GUEST_ID"
    | "MISC_CHARGE_ORDER"
    | "DEFERED_PAYMENT"
    | "TRAVEL_AGENT_IMMEDIATE"
  )[];
};
type HotelProductDepositPolicy = {
  amount?: string;
  deadline?: string;
  description?: QualifiedFreeText;
  acceptedPayments?: HotelProductPaymentPolicy;
};

type Airline$1 = {
  type?: string;
  iataCode?: string;
  icaoCode?: string;
  businessName?: string;
  commonName?: string;
};
type ReferenceDataAirlinesParams = {
  airlineCodes?: string;
};
type ReferenceDataAirlinesResult = {
  warnings?: Issue[];
  data: Airline$1[];
  meta?: CollectionMetaLink;
};
type ReferenceDataAirlinesReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataAirlinesResult,
  ReferenceDataAirlinesResult["data"]
>;

declare class Airlines {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataAirlinesParams
  ): Promise<ReferenceDataAirlinesReturnedResponse>;
}

type Location$8 = {
  id?: string;
  self?: Links$3;
  type?: string;
  subType?: "AIRPORT" | "CITY" | "POINT_OF_INTEREST" | "DISTRICT";
  name?: string;
  detailedName?: string;
  timeZoneOffset?: string;
  iataCode?: string;
  geoCode?: GeoCode;
  address?: Address$4;
  distance?: Distance$2;
  analytics?: Analytics$5;
  relevance?: number;
  category?:
    | "SIGHTS"
    | "BEACH_PARK"
    | "HISTORICAL"
    | "NIGHTLIFE"
    | "RESTAURANT"
    | "SHOPPING";
  tags?: string[];
  rank?: string;
};
type Address$4 = {
  cityName?: string;
  cityCode?: string;
  countryName?: string;
  countryCode?: string;
  stateCode?: string;
  regionCode?: string;
};
type Links$3 = {
  href: string;
  methods?: ("GET" | "PUT" | "DELETE" | "POST" | "PATCH")[];
  count?: number;
};
type ReferenceDataLocationsParams = {
  subType: "AIRPORT" | "CITY" | "AIRPORT,CITY";
  keyword: string;
  countryCode?: string;
  page?: {
    limit?: number;
    offset?: number;
  };
  sort?: "analytics.travelers.score";
  view?: "FULL" | "LIGHT";
};
type ReferenceDataLocationsResult = {
  meta?: CollectionMetaLink;
  data: Location$8[];
};
type ReferenceDataLocationsReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsResult,
  ReferenceDataLocationsResult["data"]
>;

declare class Location$7 {
  private client;
  private locationId;
  constructor(client: Client, locationId: string);
  get(params?: object): Promise<ReferenceDataLocationsReturnedResponse>;
}

type Location$6 = {
  type?: string;
  subType?: "AIRPORT" | "CITY" | "POINT_OF_INTEREST" | "DISTRICT";
  name?: string;
  detailedName?: string;
  timeZoneOffset?: string;
  iataCode?: string;
  geoCode?: GeoCode;
  address?: Address$3;
  distance?: Distance$2;
  analytics?: Analytics$5;
  relevance?: number;
};
type Address$3 = {
  cityName?: string;
  cityCode?: string;
  countryName?: string;
  countryCode?: string;
  stateCode?: string;
  regionCode?: string;
};
type ReferenceDataLocationsAirportsParams = {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: {
    limit?: number;
    offset?: number;
  };
  sort?:
    | "relevance"
    | "distance"
    | "analytics.travelers.score"
    | "analytics.flights.score";
};
type ReferenceDataLocationsAirportsResult = {
  meta?: CollectionMetaLink;
  data: Location$6[];
};
type ReferenceDataLocationsAirportsReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsAirportsResult,
  ReferenceDataLocationsAirportsResult["data"]
>;

declare class Airports {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsAirportsParams
  ): Promise<ReferenceDataLocationsAirportsReturnedResponse>;
}

type Location$5 = {
  type?: string;
  relationships?: {
    id?: string;
    type?: string;
    href?: string;
  }[];
} & {
  subtype?: string;
  name?: string;
  iataCode?: string;
  address?: {
    postalCode?: string;
    countryCode?: string;
    stateCode?: string;
  };
  geoCode?: GeoCode;
};
type Meta$6 = {
  count?: number;
  links?: {
    self?: string;
  };
};
type ReferenceDataLocationsCitiesParams = {
  countryCode?: string;
  keyword: string;
  max?: number;
  include?: "Airports"[];
};
type ReferenceDataLocationsCitiesResult = {
  meta?: Meta$6;
  data: Location$5[];
  warnings?: Issue[];
  included?: {
    airports?: Record<string, Location$5>;
  };
};
type ReferenceDataLocationsCitiesReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsCitiesResult,
  ReferenceDataLocationsCitiesResult["data"]
>;

declare class Cities {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsCitiesParams
  ): Promise<ReferenceDataLocationsCitiesReturnedResponse>;
}

type SubType = "HOTEL_LEISURE" | "HOTEL_GDS";
type ReferenceDataLocationsHotelParams = {
  keyword: string;
  subType: SubType | (string & {});
  countryCode?: string;
  lang?: string;
  max?: number;
};
type ReferenceDataLocationsHotelResult = {
  data: {
    id: number;
    type: string;
    name: string;
    iataCode: string;
    hotelIds: string;
    subType: SubType | (string & {});
    address?: {
      cityName: string;
      stateCode?: string;
      countryCode: string;
    };
    geoCode?: Required<GeoCode>;
    relevance?: number;
  }[];
};
type ReferenceDataLocationsHotelReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsHotelResult,
  ReferenceDataLocationsHotelResult["data"]
>;

declare class Hotel$2 {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsHotelParams
  ): Promise<ReferenceDataLocationsHotelReturnedResponse>;
}

type Hotel$1 = ({
  subtype?: string;
  name?: string;
  timeZoneName?: string;
  iataCode?: string;
  address?: {
    countryCode?: string;
  };
  geoCode?: GeoCode;
} & {
  hotelId?: string;
  chainCode?: string;
  name?: string;
} & object) & {
  distance?: {
    unit?:
      | "NIGHT"
      | "PIXELS"
      | "KILOGRAMS"
      | "POUNDS"
      | "CENTIMETERS"
      | "INCHES"
      | "BITS_PER_PIXEL"
      | "KILOMETERS"
      | "MILES"
      | "BYTES"
      | "KILOBYTES";
    value?: number;
    displayValue?: string;
    isUnlimited?: string;
  };
  last_update?: string;
};
type HotelScore = "BEDBANK" | "DIRECTCHAIN" | "ALL";
type ReferenceDataLocationsHotelsByHotelsParams = {
  hotelIds: string;
};
type ReferenceDataLocationsHotelsByCityParams = {
  cityCode: string;
  radius?: number;
  radiusUnit?: "MILE" | "KM";
  chainCodes?: string;
  amenities?: Amenities | (string & {});
  ratings?: string;
  hotelScore?: HotelScore;
};
type ReferenceDataLocationsHotelsByGeoCodeParams = {
  latitude: number;
  longitude: number;
  radius?: number;
  radiusUnit?: "MILE" | "KM";
  chainCodes?: string;
  amenities?: Amenities | (string & {});
  ratings?: string;
  hotelScore?: HotelScore;
};
type ReferenceDataLocationsHotelsResult = {
  data: Hotel$1[];
  meta?: CollectionMetaLink;
};
type ReferenceDataLocationsHotelsReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsHotelsResult,
  ReferenceDataLocationsHotelsResult["data"]
>;

declare class byCity {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsHotelsByCityParams
  ): Promise<ReferenceDataLocationsHotelsReturnedResponse>;
}

declare class byGeocode {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsHotelsByGeoCodeParams
  ): Promise<ReferenceDataLocationsHotelsReturnedResponse>;
}

declare class byHotels {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsHotelsByHotelsParams
  ): Promise<ReferenceDataLocationsHotelsReturnedResponse>;
}

declare class Hotels {
  private client;
  byCity: byCity;
  byGeocode: byGeocode;
  byHotels: byHotels;
  constructor(client: Client);
}

type Location$4 = {
  id?: string;
  self?: Links$2;
  type?: string;
  subType?: "AIRPORT" | "CITY" | "POINT_OF_INTEREST" | "DISTRICT";
  name?: string;
  geoCode?: GeoCode;
  category?:
    | "SIGHTS"
    | "BEACH_PARK"
    | "HISTORICAL"
    | "NIGHTLIFE"
    | "RESTAURANT"
    | "SHOPPING";
  tags?: string[];
  rank?: string;
};
type Links$2 = {
  href?: string;
  methods?: ("GET" | "PUT" | "DELETE" | "POST" | "PATCH")[];
};
type ReferenceDataLocationsPoisParams = {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: {
    limit?: number;
    offset?: number;
  };
  categories?:
    | "SIGHTS"
    | "NIGHTLIFE"
    | "RESTAURANT"
    | "SHOPPING"
    | (string & {});
};
type ReferenceDataLocationsPoisResult = {
  meta?: CollectionMetaLink;
  data: Location$4[];
};
type ReferenceDataLocationsPoisReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsPoisResult,
  ReferenceDataLocationsPoisResult["data"]
>;

type ReferenceDataLocationsPoisBySquareParams = {
  north: number;
  west: number;
  south: number;
  east: number;
  page?: {
    limit?: number;
    offset?: number;
  };
  categories?:
    | "SIGHTS"
    | "NIGHTLIFE"
    | "RESTAURANT"
    | "SHOPPING"
    | (string & {});
};

declare class BySquare$1 {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsPoisBySquareParams
  ): Promise<ReferenceDataLocationsPoisReturnedResponse>;
}

declare class PointsOfInterest {
  private client;
  bySquare: BySquare$1;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsPoisParams
  ): Promise<ReferenceDataLocationsPoisReturnedResponse>;
}

type ReferenceDataLocationsPoisPoiResult = {
  meta?: CollectionMetaLink;
  data: Location;
};
type ReferenceDataLocationsPoisPoiReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataLocationsPoisPoiResult,
  ReferenceDataLocationsPoisPoiResult["data"]
>;

declare class PointOfInterest {
  private client;
  private poiId;
  constructor(client: Client, poiId: string);
  get(): Promise<ReferenceDataLocationsPoisPoiReturnedResponse>;
}

declare class Locations {
  private client;
  airports: Airports;
  cities: Cities;
  hotel: Hotel$2;
  hotels: Hotels;
  pointsOfInterest: PointsOfInterest;
  constructor(client: Client);
  get(
    params: ReferenceDataLocationsParams
  ): Promise<ReferenceDataLocationsReturnedResponse>;
  pointOfInterest(poiId: string): PointOfInterest;
}

type Meta$5 = {
  count?: number;
  links?: {
    self?: string;
  };
};
type RecommendedLocation = {
  subtype?: string;
  name?: string;
  iataCode?: string;
  geoCode?: {
    latitude?: number;
    longitude?: number;
  };
} & {
  type?: string;
  relevance?: number;
};
type RecommendedLocationsParams = {
  cityCodes: string;
  travelerCountryCode?: string;
  destinationCountryCodes?: string;
};
type RecommendedLocationsResult = {
  meta?: Meta$5;
  data: RecommendedLocation[];
  warnings?: Issue[];
};
type RecommendedLocationsReturnedResponse = ReturnedResponseSuccess<
  RecommendedLocationsResult,
  RecommendedLocationsResult["data"]
>;

declare class RecommendedLocations {
  private client;
  constructor(client: Client);
  get(
    params: RecommendedLocationsParams
  ): Promise<RecommendedLocationsReturnedResponse>;
}

type CheckinLink = {
  type: string;
  id: string;
  href: string;
  channel: "Mobile" | "Web" | "All";
  parameters?: Record<string, Parameter>;
};
type Parameter = {
  description?: string;
  type: string;
  format?: string;
};
type ReferenceDataCheckinLinksParams = {
  airlineCode: string;
  language?: string;
};
type ReferenceDataCheckinLinksResult = {
  warnings?: Issue[];
  data: CheckinLink[];
  meta?: CollectionMetaLink;
};
type ReferenceDataCheckinLinksReturnedResponse = ReturnedResponseSuccess<
  ReferenceDataCheckinLinksResult,
  ReferenceDataCheckinLinksResult["data"]
>;

declare class CheckinLinks {
  private client;
  constructor(client: Client);
  get(
    params: ReferenceDataCheckinLinksParams
  ): Promise<ReferenceDataCheckinLinksReturnedResponse>;
}

declare class Urls {
  private client;
  checkinLinks: CheckinLinks;
  constructor(client: Client);
}

declare class ReferenceData {
  private client;
  urls: Urls;
  locations: Locations;
  airlines: Airlines;
  recommendedLocations: RecommendedLocations;
  constructor(client: Client);
  location(locationId: string): Location$7;
}

type Activity$1 = {
  type?: "activity";
  id?: string;
  self?: Link$1;
  name?: string;
  shortDescription?: string;
  description?: string;
  geoCode?: GeoCode;
  rating?: string;
  price?: ElementaryPrice;
  pictures?: string[];
  bookingLink?: string;
  minimumDuration?: string;
};
type Link$1 = {
  href?: string;
  methods?: ("GET" | "PUT" | "DELETE" | "POST" | "PATCH")[];
};
type ActivitiesParams = {
  latitude: number;
  longitude: number;
  radius?: number;
};
type ActivitiesResult = {
  meta?: CollectionMetaLink;
  data: Activity$1[];
  warnings?: Issue[];
};
type ActivitiesReturnedResponse = ReturnedResponseSuccess<
  ActivitiesResult,
  ActivitiesResult["data"]
>;

type ActivitiesBySquareParams = {
  north: number;
  west: number;
  south: number;
  east: number;
};

declare class BySquare {
  private client;
  constructor(client: Client);
  get(params: ActivitiesBySquareParams): Promise<ActivitiesReturnedResponse>;
}

declare class Activities {
  private client;
  bySquare: BySquare;
  constructor(client: Client);
  get(params: ActivitiesParams): Promise<ActivitiesReturnedResponse>;
}

type ActivityResult = {
  meta?: CollectionMetaLink;
  data: Activity$1;
  warnings?: Issue[];
};
type ActivityReturnedResponse = ReturnedResponseSuccess<
  ActivityResult,
  ActivityResult["data"]
>;

declare class Activity {
  private client;
  private activityId;
  constructor(client: Client, activityId: string);
  get(): Promise<ActivityReturnedResponse>;
}

type ExtendedOriginDestinationLight = OriginDestinationLight$1 & {
  departureDateTime?: DateTimeType;
  arrivalDateTime?: DateTimeType;
};
type OriginDestinationLight$1 = {
  id?: string;
  originLocationCode?: string;
  destinationLocationCode?: string;
  includedConnectionPoints?: string[];
  excludedConnectionPoints?: string[];
};
type SearchCriteriaLight = {
  excludeAllotments?: boolean;
  flightFilters?: FlightFiltersLight;
};
type ExtendedSearchCriteria = SearchCriteriaLight & {
  includeClosedContent?: boolean;
  class?: string;
};
type FlightFiltersLight = {
  carrierRestrictions?: CarrierRestrictions;
  cabinRestrictions?: CabinRestriction[];
  connectionRestriction?: Omit<ConnectionRestriction, "technicalStopsAllowed">;
};
type FlightAvailability = {
  type: string;
  id: string;
  originDestinationId?: string;
  source: FlightOfferSource;
  instantTicketingRequired?: boolean;
  paymentCardRequired?: boolean;
  duration?: string;
  segments: ExtendedSegment[];
};
type ExtendedSegment = {
  closedStatus?: "CANCELLED" | "DEPARTED" | "NOT_AVAILABLE";
  availabilityClasses?: AvailabilityClass[];
} & Segment$1;
type AvailabilityClass = {
  numberOfBookableSeats?: number;
  class?: string;
  closedStatus?: "WAITLIST_OPEN" | "WAITLIST_CLOSED" | "ON_REQUEST";
  tourAllotment?: TourAllotment;
};
type TourAllotment = AllotmentDetails & {
  mode?: "FREE" | "FORCED";
  remainingSeats?: number;
};
type CollectionMetaAvailSearch = {
  count?: number;
};
type FlightAvailabilitiesParams = {
  originDestinations: ExtendedOriginDestinationLight[];
  travelers: TravelerInfo[];
  sources: FlightOfferSource[];
  searchCriteria?: ExtendedSearchCriteria;
};
type FlightAvailabilitiesResult = {
  warnings?: Issue[];
  meta?: CollectionMetaAvailSearch;
  data: FlightAvailability[];
  dictionaries?: Dictionaries$3;
};
type FlightAvailabilitiesReturnedResponse = ReturnedResponseSuccess<
  FlightAvailabilitiesResult,
  FlightAvailabilitiesResult["data"]
>;

declare class FlightAvailabilities {
  private client;
  constructor(client: Client);
  post(
    params: FlightAvailabilitiesParams
  ): Promise<FlightAvailabilitiesReturnedResponse>;
}

declare class Availability {
  private client;
  flightAvailabilities: FlightAvailabilities;
  constructor(client: Client);
}

type Price$4 = {
  total?: string;
};
type LocationValue$1 = {
  subType?: "AIRPORT" | "CITY";
  detailedName?: string;
};
type LocationDictionary$1 = Record<string, LocationValue$1>;
type CurrencyDictionary$1 = Record<string, string>;
type FlightDate = {
  type?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  price?: Price$4;
  links?: {
    flightDestinations?: string;
    flightOffers?: string;
  };
};
type Dictionaries$2 = {
  currencies?: CurrencyDictionary$1;
  locations?: LocationDictionary$1;
};
type FlightDatesParams = {
  origin: string;
  destination: string;
} & Defaults$1;
type FlightDatesResult = {
  data: FlightDate[];
  dictionaries?: Dictionaries$2;
  meta?: Meta$7;
  warnings?: Issue[];
};
type FlightDatesReturnedResponse = ReturnedResponseSuccess<
  FlightDatesResult,
  FlightDatesResult["data"]
>;

declare class FlightDates {
  private client;
  constructor(client: Client);
  get(params: FlightDatesParams): Promise<FlightDatesReturnedResponse>;
}

type Price$3 = {
  total?: string;
};
type LocationValue = {
  subType?: "AIRPORT" | "CITY";
  detailedName?: string;
};
type LocationDictionary = Record<string, LocationValue>;
type CurrencyDictionary = Record<string, string>;
type FlightDestination = {
  type?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  price?: Price$3;
  links?: {
    flightDates?: string;
    flightOffers?: string;
  };
};
type Dictionaries$1 = {
  currencies?: CurrencyDictionary;
  locations?: LocationDictionary;
};
type FlightDestinationsParams = {
  origin: string;
} & Defaults$1;
type FlightDestinationsResult = {
  data: FlightDestination[];
  dictionaries?: Dictionaries$1;
  meta?: Meta$7;
  warnings?: Issue[];
};
type FlightDestinationsReturnedResponse = ReturnedResponseSuccess<
  FlightDestinationsResult,
  FlightDestinationsResult["data"]
>;

declare class FlightDestinations {
  private client;
  constructor(client: Client);
  get(
    params: FlightDestinationsParams
  ): Promise<FlightDestinationsReturnedResponse>;
}

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OriginDestination = OriginDestinationLight & {
  originRadius?: number;
  alternativeOriginsCodes?: string[];
  destinationRadius?: number;
  alternativeDestinationsCodes?: string[];
  departureDateTimeRange?: DateTimeRange;
  arrivalDateTimeRange?: DateTimeRange;
};
type OriginDestinationLight = {
  id?: string;
  originLocationCode?: string;
  destinationLocationCode?: string;
  includedConnectionPoints?: string[];
  excludedConnectionPoints?: string[];
};
type DateTimeRange = UtilRequiredKeys<DateTimeType, "date"> & {
  dateWindow?: string;
  timeWindow?: string;
};
type ExtendedTravelerInfo = UtilRequiredKeys<
  TravelerInfo,
  "id" | "travelerType"
>;
type SearchCriteria = {
  excludeAllotments?: boolean;
  addOneWayOffers?: boolean;
  maxFlightOffers?: number;
  maxPrice?: number;
  allowAlternativeFareOptions?: boolean;
  oneFlightOfferPerDay?: boolean;
  additionalInformation?: {
    chargeableCheckedBags?: boolean;
    brandedFares?: boolean;
  };
  pricingOptions?: ExtendedPricingOptions;
  flightFilters?: FlightFilters;
};
type ExtendedCabinRestriction = CabinRestriction & {
  coverage?: Coverage;
};
type FlightFilters = {
  crossBorderAllowed?: boolean;
  moreOvernightsAllowed?: boolean;
  returnToDepartureAirport?: boolean;
  railSegmentAllowed?: boolean;
  busSegmentAllowed?: boolean;
  maxFlightTime?: number;
  carrierRestrictions?: CarrierRestrictions;
  cabinRestrictions?: ExtendedCabinRestriction[];
  connectionRestriction?: ConnectionRestriction;
};
type ExtendedPricingOptions = {
  includedCheckedBagsOnly?: boolean;
  refundableFare?: boolean;
  noRestrictionFare?: boolean;
  noPenaltyFare?: boolean;
};
type Coverage = "MOST_SEGMENTS" | "AT_LEAST_ONE_SEGMENT" | "ALL_SEGMENTS";
type FlightOffersSearchPostParams = {
  currencyCode?: CurrencyCode;
  originDestinations: OriginDestination[];
  travelers: ExtendedTravelerInfo[];
  sources: FlightOfferSource[];
  searchCriteria?: SearchCriteria;
};
type FlightOffersSearchPostResult = {
  meta?: CollectionMeta;
  warnings?: Issue[];
  data: FlightOffer[];
  dictionaries?: Dictionaries$3;
};
type FlightOffersSearchGetParams = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: TravelClass;
  includedAirlineCodes?: string;
  excludedAirlineCodes?: string;
  nonStop?: boolean;
  currencyCode?: CurrencyCode;
  maxPrice?: number;
  max?: number;
};
type FlightOffersSearchGetResult = {
  meta?: CollectionMetaLink;
  warnings?: Issue[];
  data: FlightOffer[];
  dictionaries?: Dictionaries$3;
};
type FlightOffersSearchGetReturnedResponse = Promise<
  ReturnedResponseSuccess<
    FlightOffersSearchGetResult,
    FlightOffersSearchGetResult["data"]
  >
>;
type FlightOffersSearchPostReturnedResponse = Promise<
  ReturnedResponseSuccess<
    FlightOffersSearchPostResult,
    FlightOffersSearchPostResult["data"]
  >
>;

declare class FlightOffersSearch {
  private client;
  constructor(client: Client);
  get(
    params: FlightOffersSearchGetParams
  ): FlightOffersSearchGetReturnedResponse;
  post(
    params: FlightOffersSearchPostParams
  ): FlightOffersSearchPostReturnedResponse;
}

type FlightOffersPredictionParams = FlightOffersSearchGetResult;
type FlightOffersPredictionResult = {
  warnings?: Issue[];
  meta?: CollectionMetaLink & {
    oneWayCombinations?: OneWayCombinations;
  };
  data: FlightOffer[];
  dictionaries?: Dictionaries$3;
};
type FlightOffersPredictionReturnedResponse = ReturnedResponseSuccess<
  FlightOffersPredictionResult,
  FlightOffersPredictionResult["data"]
>;

declare class FlightChoicePrediction {
  private client;
  constructor(client: Client);
  post(
    params: FlightOffersPredictionParams
  ): Promise<FlightOffersPredictionReturnedResponse>;
}

type FlightOfferPricingIn = {
  type: "flight-offers-pricing";
  flightOffers: FlightOffer[];
  payments?: {
    brand?: PaymentBrand;
    binNumber?: number;
    flightOfferIds?: string[];
  }[];
  travelers?: Traveler[];
};
type FlightOfferPricingOut = {
  type: string;
  flightOffers: FlightOffer[];
  bookingRequirements?: {
    invoiceAddressRequired?: boolean;
    mailingAddressRequired?: boolean;
    emailAddressRequired?: boolean;
    phoneCountryCodeRequired?: boolean;
    mobilePhoneNumberRequired?: boolean;
    phoneNumberRequired?: boolean;
    postalCodeRequired?: boolean;
    travelerRequirements?: {
      travelerId?: string;
      genderRequired?: boolean;
      documentRequired?: boolean;
      documentIssuanceCityRequired?: boolean;
      dateOfBirthRequired?: boolean;
      redressRequiredIfAny?: boolean;
      airFranceDiscountRequired?: boolean;
      spanishResidentDiscountRequired?: boolean;
      residenceRequired?: boolean;
    }[];
  };
};
type CreditCardFee = {
  brand?: PaymentBrand;
  amount?: string;
  currency?: string;
  flightOfferId?: string;
};
type DetailedFareRules = {
  fareBasis?: string;
  name?: string;
  fareNotes?: TermAndCondition;
  segmentId?: string;
};
type Bags = BaggageAllowance & {
  name?: string;
  price?: ElementaryPrice;
  bookableByItinerary?: boolean;
  segmentIds?: string[];
  travelerIds?: string[];
};
type OtherServices = {
  name?: ServiceName;
  price?: ElementaryPrice;
  bookableByTraveler?: boolean;
  bookableByItinerary?: boolean;
  segmentIds?: string[];
  travelerIds?: string[];
};
type FlightOffersPricingParams = {
  data: FlightOfferPricingIn;
};
type FlightOffersPricingAdditionalParams = {
  include?: string | string[];
  forceClass?: boolean;
};
type FlightOffersPricingResult = {
  data: FlightOfferPricingOut;
  warnings?: Issue[];
  included?: {
    "credit-card-fees": Record<string, CreditCardFee>;
    bags: Record<string, Bags>;
    "other-services": Record<string, OtherServices>;
    "detailed-fare-rules": Record<string, DetailedFareRules>;
  };
  dictionaries?: Dictionaries$3;
};
type FlightOffersPricingReturnedResponse = ReturnedResponseSuccess<
  FlightOffersPricingResult,
  FlightOffersPricingResult["data"]
>;

declare class Pricing {
  private client;
  constructor(client: Client);
  post(
    params: FlightOffersPricingParams,
    additionalParams?: FlightOffersPricingAdditionalParams
  ): Promise<FlightOffersPricingReturnedResponse>;
}

type Payment$2 = {
  brand?: PaymentBrand;
  binNumber?: number;
  flightOfferIds?: string[];
};
type FlightOfferUpsellIn = {
  type: "flight-offers-upselling";
  flightOffers: FlightOffer[];
  payments?: Payment$2[];
};
type CollectionMetaUpsell = {
  count?: number;
  oneWayUpselledCombinations?: {
    flightOfferId?: string;
    upselledFlightOfferIds?: string[];
  }[];
};
type FlightOffersUpsellingParams = {
  data: FlightOfferUpsellIn;
};
type FlightOffersUpsellingResult = {
  meta?: CollectionMetaUpsell;
  warnings?: Issue[];
  data: FlightOffer[];
  dictionaries?: Dictionaries$3;
};
type FlightOffersUpsellingReturnedResponse = ReturnedResponseSuccess<
  FlightOffersUpsellingResult,
  FlightOffersUpsellingResult["data"]
>;

declare class Upselling {
  private client;
  constructor(client: Client);
  post(
    params: FlightOffersUpsellingParams
  ): Promise<FlightOffersUpsellingReturnedResponse>;
}

declare class FlightOffers {
  private client;
  prediction: FlightChoicePrediction;
  pricing: Pricing;
  upselling: Upselling;
  constructor(client: Client);
}

type HotelOffers = {
  type?: "hotel-offers";
  available?: boolean;
  self?: string;
  offers?: HotelOffer$1[];
  hotel?: Hotel;
};
type Hotel = {
  hotelId?: string;
  chainCode?: string;
  brandCode?: string;
  dupeId?: string;
  name?: string;
  cityCode?: string;
};
type HotelOffer$1 = {
  type?: Type;
  id: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomQuantity?: string;
  rateCode: string;
  rateFamilyEstimated?: HotelProductRateFamily;
  category?: string;
  description?: QualifiedFreeText;
  commission?: HotelProductCommission;
  boardType?: BoardType;
  room: HotelProductRoomDetails;
  guests?: HotelProductGuests;
  price: HotelProductHotelPrice;
  policies?: HotelProductPolicyDetails;
  self?: string;
};
type BoardType =
  | "ROOM_ONLY"
  | "BREAKFAST"
  | "HALF_BOARD"
  | "FULL_BOARD"
  | "ALL_INCLUSIVE"
  | "BUFFET_BREAKFAST"
  | "CARIBBEAN_BREAKFAST"
  | "CONTINENTAL_BREAKFAST"
  | "ENGLISH_BREAKFAST"
  | "FULL_BREAKFAST"
  | "DINNER_BED_AND_BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "FAMILY_PLAN"
  | "AS_BROCHURED"
  | "SELF_CATERING"
  | "BERMUDA"
  | "AMERICAN"
  | "FAMILY_AMERICAN"
  | "MODIFIED";
type HotelProductCancellationPolicy = {
  type?: CancellationType;
  amount?: string;
  numberOfNights?: number;
  percentage?: string;
  deadline?: string;
  description?: QualifiedFreeText;
};
type HotelProductCheckInOutPolicy = {
  checkIn?: string;
  checkInDescription?: QualifiedFreeText;
  checkOut?: string;
  checkOutDescription?: QualifiedFreeText;
};
type HotelProductCommission = {
  percentage?: string;
  amount?: string;
  description?: QualifiedFreeText;
};
type HotelProductEstimatedRoomType = {
  category?: string;
  beds?: number;
  bedType?: string;
};
type HotelProductGuaranteePolicy = {
  description?: QualifiedFreeText;
  acceptedPayments?: HotelProductPaymentPolicy;
};
type HotelProductGuests = {
  adults?: number;
  childAges?: number[];
};
type HotelProductHoldPolicy = {
  deadline: string;
};
type HotelProductHotelPrice = {
  currency?: string;
  sellingTotal?: string;
  total?: string;
  base?: string;
  taxes?: Tax$2[];
  markups?: Markup[];
  variations?: HotelProductPriceVariations;
};
type HotelProductPolicyDetails = {
  paymentType?: PaymentType;
  guarantee?: HotelProductGuaranteePolicy;
  deposit?: HotelProductDepositPolicy;
  prepay?: HotelProductDepositPolicy;
  holdTime?: HotelProductHoldPolicy;
  cancellations?: HotelProductCancellationPolicy[];
  checkInOut?: HotelProductCheckInOutPolicy;
};
type HotelProductPriceVariation = {
  startDate: string;
  endDate: string;
  currency?: string;
  sellingTotal?: string;
  total?: string;
  base?: string;
  markups?: Markup[];
};
type HotelProductPriceVariations = {
  average?: Price$2;
  changes?: HotelProductPriceVariation[];
};
type HotelProductRateFamily = {
  code?: string;
  type?: string;
};
type HotelProductRoomDetails = {
  type?: string;
  typeEstimated?: HotelProductEstimatedRoomType;
  description?: QualifiedFreeText;
};
type Markup = {
  amount?: string;
};
type PaymentType = "GUARANTEE" | "DEPOSIT" | "PREPAY" | "HOLDTIME";
type Price$2 = {
  currency?: string;
  sellingTotal?: string;
  total?: string;
  base?: string;
  markups?: Markup[];
};
type Tax$2 = {
  amount?: string;
  currency?: string;
  code?: string;
  percentage?: string;
  included?: boolean;
  description?: string;
  pricingFrequency?: string;
  pricingMode?: string;
};
type Type = "hotel-offer";
type CancellationType = "FULL_STAY";
type HotelOffersSearchParams = {
  hotelIds: string;
  adults?: number;
  checkInDate?: string;
  checkOutDate?: string;
  countryOfResidence?: string;
  priceRange?: string;
  currencyCode?: CurrencyCode;
  paymentPolicy?: "GUARANTEE" | "DEPOSIT" | "NONE";
  boardType?:
    | "ROOM_ONLY"
    | "BREAKFAST"
    | "HALF_BOARD"
    | "FULL_BOARD"
    | "ALL_INCLUSIVE";
  includeClosed?: boolean;
  bestRateOnly?: boolean;
  lang?: string;
};
type HotelOffersSearchResult = {
  data: HotelOffers[];
};
type HotelOffersSearchReturnedResponse = ReturnedResponseSuccess<
  HotelOffersSearchResult,
  HotelOffersSearchResult["data"]
>;

type HotelOfferSearchParams = {
  lang?: string;
};
type HotelOfferSearchResult = {
  data: HotelOffers;
};
type HotelOfferSearchReturnedResponse = ReturnedResponseSuccess<
  HotelOfferSearchResult,
  HotelOfferSearchResult["data"]
>;

declare class HotelOfferSearch {
  private client;
  private offerId;
  constructor(client: Client, offerId: string);
  get(
    params?: HotelOfferSearchParams
  ): Promise<HotelOfferSearchReturnedResponse>;
}

declare class HotelOffersSearch {
  private client;
  constructor(client: Client);
  get(
    params: HotelOffersSearchParams
  ): Promise<HotelOffersSearchReturnedResponse>;
}

type OperatingFlight = {
  carrierCode?: string;
  number?: string;
  suffix?: string;
};
type Price$1 = {
  currency?: string;
  total?: string;
  base?: string;
  fees?: Fee$2[];
  taxes?: Tax$3[];
};
type SeatMap = {
  type?: string;
  id?: string;
  self?: Link;
  departure?: FlightEndPoint;
  arrival?: FlightEndPoint;
  carrierCode?: string;
  number?: string;
  operating?: OperatingFlight;
  aircraft?: AircraftEquipment$1;
  class?: string;
  flightOfferId?: string;
  segmentId?: string;
  decks?: Deck[];
  aircraftCabinAmenities?: AircraftCabinAmenities;
  availableSeatsCounters?: AvailableSeatsCounter[];
};
type Deck = {
  deckType?: "UPPER" | "MAIN" | "LOWER";
  deckConfiguration?: DeckConfiguration;
  facilities?: Facility[];
  seats?: Seat$2[];
};
type DeckConfiguration = {
  width?: number;
  length?: number;
  startSeatRow?: number;
  endSeatRow?: number;
  startWingsX?: number;
  endWingsX?: number;
  startWingsRow?: number;
  endWingsRow?: number;
  exitRowsX?: number[];
};
type Facility = {
  code?: string;
  column?: string;
  row?: string;
  position?: "FRONT" | "REAR" | "SEAT";
  coordinates?: Coordinates;
};
type Seat$2 = {
  cabin?: string;
  number?: string;
  characteristicsCodes?: string[];
  travelerPricing?: SeatmapTravelerPricing[];
  coordinates?: Coordinates;
};
type Coordinates = {
  x?: number;
  y?: number;
};
type AvailableSeatsCounter = {
  travelerId?: string;
  value?: number;
};
type SeatmapTravelerPricing = {
  travelerId?: string;
  seatAvailabilityStatus?: "AVAILABLE" | "BLOCKED" | "OCCUPIED";
  price?: Price$1;
};
type AircraftCabinAmenities = {
  power?: AircraftCabinAmenitiesPower;
  seat?: AmenitySeat;
  wifi?: AircraftCabinAmenitiesWifi;
  entertainment?: AircraftCabinAmenitiesEntertainment[];
  food?: AircraftCabinAmenitiesFood;
  beverage?: AircraftCabinAmenitiesBeverage;
};
type AircraftCabinAmenitiesBeverage = Amenity & {
  beverageType?: "ALCOHOLIC" | "NON_ALCOHOLIC" | "ALCOHOLIC_AND_NON_ALCOHOLIC";
};
type AircraftCabinAmenitiesPower = Amenity & {
  powerType?: "PLUG" | "USB_PORT" | "ADAPTOR" | "PLUG_OR_USB_PORT";
  usbType?: "USB_A" | "USB_C" | "USB_A_AND_USB_C";
};
type AircraftCabinAmenitiesFood = Amenity & {
  foodType?: "MEAL" | "FRESH_MEAL" | "SNACK" | "FRESH_SNACK";
};
type AircraftCabinAmenitiesEntertainment = Amenity & {
  entertainmentType?:
    | "LIVE_TV"
    | "MOVIES"
    | "AUDIO_VIDEO_ON_DEMAND"
    | "TV_SHOWS"
    | "IP_TV";
};
type AircraftCabinAmenitiesWifi = Amenity & {
  wifiCoverage?: "FULL" | "PARTIAL";
};
type Amenity = {
  isChargeable?: boolean;
};
type AmenitySeat = {
  legSpace?: number;
  spaceUnit?: "INCHES" | "CENTIMENTERS";
  tilt?: "FULL_FLAT" | "ANGLE_FLAT" | "NORMAL";
  amenityType?: "SEAT";
  medias?: AmenityMedia[];
};
type AmenityMedia = {
  title?: string;
  href?: string;
  description?: QualifiedFreeText;
  mediaType?:
    | "application"
    | "audio"
    | "font"
    | "example"
    | "image"
    | "message"
    | "model"
    | "multipart"
    | "text"
    | "video";
};
type FacilityDictionary = Record<string, string>;
type SeatCharacteristicDictionary = Record<string, string>;
type Link = {
  href: string;
  methods?: ("GET" | "PUT" | "DELETE" | "POST" | "PATCH")[];
  count?: number;
};
type Dictionaries = {
  locations?: LocationEntry;
  facility?: FacilityDictionary;
  seatCharacteristics?: SeatCharacteristicDictionary;
};
type SeatmapsGetParams = {
  "flight-orderId": string;
};
type SeatmapsGetResult = {
  meta?: CollectionMetaLink;
  warnings?: Issue[];
  data: SeatMap[];
  dictionaries: Dictionaries;
};
type SeatmapsGetReturnedResponse = ReturnedResponseSuccess<
  SeatmapsGetResult,
  SeatmapsGetResult["data"]
>;
type SeatmapsPostParams = {
  data: FlightOffer[];
  included?: {
    travelers: {
      [key: string]: Traveler;
    };
  };
};
type SeatmapsPostResult = {
  meta?: CollectionMetaLink;
  warnings?: Issue[];
  data: SeatMap[];
  dictionaries: Dictionaries;
};
type SeatmapsPostReturnedResponse = ReturnedResponseSuccess<
  SeatmapsPostResult,
  SeatmapsPostResult["data"]
>;

declare class Seatmaps {
  private client;
  constructor(client: Client);
  get(params: SeatmapsGetParams): Promise<SeatmapsGetReturnedResponse>;
  post(params: SeatmapsPostParams): Promise<SeatmapsPostReturnedResponse>;
}

type TransferOffer = {
  transferType:
    | "PRIVATE"
    | "SHARED"
    | "TAXI"
    | "HOURLY"
    | "AIRPORT_EXPRESS"
    | "AIRPORT_BUS";
  start: Location$3;
  end?: Location$3;
  stopOvers?: StopOver$1[];
  passenegerCharacteristics?: PassengerCharacteristics$1[];
  duration?: string;
  vehicle: Vehicle$1;
  serviceProvider: ServiceProvider$1;
  partnerInfo?: PartnerInfo$1;
  quotation: Quotation$1;
  converted?: Quotation$1;
  extraServices?: ExtraService$1[];
  equipment?: Equipment$1[];
  cancellationRules?: CancellationRule$1[];
  methodsOfPaymentAccepted: ("CREDIT_CARD" | "INVOICE" | "TRAVEL_ACCOUNT")[];
  discountCodes?: DiscountCode$1[];
  language?: string;
  distance?: Distance$1;
} & {
  type: string;
  id: string;
};
type TransferOfferPost = TransferOffer & {
  startConnectedSegment?: TravelSegment$1;
} & {
  endConnectedSegment?: TravelSegment$1;
};
type AddressCommon$1 = {
  line?: string;
  zip?: string;
  countryCode?: string;
  cityName?: string;
  stateCode?: string;
};
type Address$2 = {
  line?: string;
  zip?: string;
  countryCode?: string;
  cityName?: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
};
type Baggage$1 = {
  count?: number;
  size?: "S" | "M" | "L";
};
type CancellationRule$1 = {
  ruleDescription?: string;
  feeType?: "PERCENTAGE" | "VALUE";
  feeValue?: string;
  currencyCode?: string;
  metricType?: "MINUTES" | "HOURS" | "DAYS" | "YEARS";
  metricMin?: string;
  metricMax?: string;
};
type Contact$1 = {
  phoneNumber?: string;
  email?: string;
};
type DiscountCode$1 = {
  type?: "CD" | "PC";
  value?: string;
};
type Distance$1 = {
  value?: number;
  unit?: "KM" | "MI";
};
type Equipment$1 = {
  code:
    | "BBS"
    | "BYC"
    | "CBB"
    | "CBF"
    | "CBS"
    | "CSB"
    | "CSI"
    | "CST"
    | "SBR"
    | "SKB"
    | "SKR"
    | "TAB "
    | "WAR"
    | "WHC"
    | "WIF"
    | "CNT";
  itemId?: string;
  description?: string;
  quotation?: Quotation$1;
  converted?: Quotation$1;
  isBookable?: boolean;
  taxIncluded?: boolean;
  includedInTotal?: boolean;
};
type ExtraService$1 = {
  code: "DSL" | "EWT" | "MAG" | "FLM" | "NWS" | "CAI" | "WNR";
  itemId?: string;
  description?: string;
  metricType?: "YEARS" | "DAYS" | "HOURS" | "MINUTES";
  metricValue?: string;
  quotation?: Quotation$1;
  converted?: Quotation$1;
  isBookable?: boolean;
  taxIncluded?: boolean;
  includedInTotal?: boolean;
};
type Fee$1 = PointsAndCash$1 & {
  currencyCode?: string;
  indicator?: string;
};
type Location$3 = {
  dateTime?: string;
  locationCode?: string;
  address?: Address$2;
  name?: string;
  googlePlaceId?: string;
  uicCode?: string;
};
type StopOver$1 = {
  duration?: string;
  sequenceNumber?: number;
  location?: Location$3;
};
type PassengerCharacteristics$1 = {
  passengerTypeCode?: string;
  age?: number;
};
type PartnerInfo$1 = {
  serviceProvider?: ServiceProvider$1;
};
type PointsAndCash$1 = {
  monetaryAmount?: string;
};
type Quotation$1 = PointsAndCash$1 & {
  currencyCode?: string;
  isEstimated?: boolean;
  base?: PointsAndCash$1;
  discount?: PointsAndCash$1;
  taxes?: Tax$1[];
  fees?: Fee$1[];
  totalTaxes?: PointsAndCash$1;
  totalFees?: PointsAndCash$1;
};
type Seat$1 = {
  count?: number;
  row?: string;
  size?: string;
};
type ServiceProvider$1 = {
  code: string;
  name: string;
  logoUrl: string;
  termsUrl?: string;
  isPreferred?: boolean;
  contacts?: ContactWithAddress$1;
  settings?: (
    | "BILLING_ADDRESS_REQUIRED"
    | "FLIGHT_NUMBER_REQUIRED"
    | "CVV_NUMBER_REQUIRED"
  )[];
  businessIdentification?: {
    vatRegistrationNumber?: string;
  };
};
type Tax$1 = {
  monetaryAmount?: string;
} & {
  indicator?: string;
  natureCode?: string;
  countryCode?: string;
  rate?: string;
};
type TransportationType$1 = "FLIGHT" | "TRAIN";
type TravelSegment$1 = {
  transportationType?: TransportationType$1;
  transportationNumber?: string;
  departure?: TravelSegmentLocation$1;
  arrival?: TravelSegmentLocation$1;
};
type TravelSegmentLocation$1 = {
  uicCode?: string;
  iataCode?: string;
  localDateTime?: string;
};
type Vehicle$1 = {
  code:
    | "MBR"
    | "CAR"
    | "SED"
    | "WGN"
    | "ELC"
    | "VAN"
    | "SUV"
    | "LMS"
    | "TRN"
    | "BUS";
  category: "ST" | "BU" | "FC";
  description: string;
  seats: Seat$1[];
  baggages?: Baggage$1[];
  imageURL?: string;
};
type ContactWithAddress$1 = Contact$1 & {
  address?: AddressCommon$1;
};
type ShoppingTransferOffersParams = {
  startDateTime: string;
  passengers?: number;
  startLocationCode: string;
  startUicCode?: string;
  startAddressLine?: string;
  startZipCode?: string;
  startCountryCode?: string;
  startCityName?: string;
  startStateCode?: string;
  startGeoCode?: string;
  startName?: string;
  startGooglePlaceId?: string;
  endLocationCode?: string;
  endUicCode?: string;
  endAddressLine?: string;
  endZipCode?: string;
  endCountryCode?: string;
  endCityName?: string;
  endStateCode?: string;
  endGeoCode?: string;
  endName?: string;
  endGooglePlaceId?: string;
  transferType?: TransferOffer["transferType"];
  duration?: string;
  language?: string;
  currency?: string;
  vehicleCategory?: "ST" | "BU" | "FC";
  vehicleCode?: Vehicle$1["code"];
  providerCodes?: string;
  baggages?: number;
  discountNumbers?: string;
  extraServiceCodes?: ExtraService$1["code"];
  equipmentCodes?: Equipment$1["code"];
  reference?: string;
  stopOvers?: StopOver$1[] | any;
  startConnectedSegment?: TravelSegment$1;
  endConnectedSegment?: TravelSegment$1;
  passengerCharacteristics?: PassengerCharacteristics$1[];
};
type ShoppingTransferOffersResult = {
  data: TransferOfferPost[];
  warnings?: Issue[];
};
type ShoppingTransferOffersReturnedResponse = ReturnedResponseSuccess<
  ShoppingTransferOffersResult,
  ShoppingTransferOffersResult["data"]
>;

declare class TransferOffers {
  private client;
  constructor(client: Client);
  post(
    params: ShoppingTransferOffersParams
  ): Promise<ShoppingTransferOffersReturnedResponse>;
}

declare class Shopping {
  private client;
  flightDestinations: FlightDestinations;
  flightOffers: FlightOffers;
  flightOffersSearch: FlightOffersSearch;
  flightDates: FlightDates;
  seatmaps: Seatmaps;
  hotelOffersSearch: HotelOffersSearch;
  activities: Activities;
  availability: Availability;
  transferOffers: TransferOffers;
  constructor(client: Client);
  hotelOfferSearch(offerId: string): HotelOfferSearch;
  activity(activityId: string): Activity;
}

type FlightOrderGetResult = {
  meta?: CollectionMetaLink;
  warnings?: Issue[];
  data: FlightOrder$1;
  dictionaries?: Dictionaries$3;
};
type FlightOrderGetReturenedResponse = ReturnedResponseSuccess<
  FlightOrderGetResult,
  FlightOrderGetResult["data"]
>;

declare class FlightOrder {
  private client;
  private orderId;
  constructor(client: Client, orderId: string);
  get(): Promise<FlightOrderGetReturenedResponse>;
  delete(): Promise<ReturnedResponseSuccess<null, null>>;
}

type FlightOrdersParams = {
  data: FlightOrder$1;
};
type FlightOrdersResult = {
  meta?: CollectionMetaLink;
  warnings?: Issue[];
  data: FlightOrder$1;
  dictionaries?: Dictionaries$3;
};
type FlightOrdersReturnedResponse = ReturnedResponseSuccess<
  FlightOrdersResult,
  FlightOrdersResult["data"]
>;

declare class FlightOrders {
  private client;
  constructor(client: Client);
  post(params: FlightOrdersParams): Promise<FlightOrdersReturnedResponse>;
}

type Guest$1 = {
  id: number;
  name: {
    title: string;
    firstName: string;
    lastName: string;
  };
  contact: {
    phone: string;
    email: string;
  };
};
type Payment$1 = {
  id: number;
  method: string;
  card: {
    vendorCode: string;
    cardNumber: string;
    expiryDate: string;
  };
};
type HotelBookingParams = {
  data: {
    offerId: string;
    guests: Guest$1[];
    payments: Payment$1[];
  };
};

declare class HotelBookings {
  private client;
  constructor(client: Client);
  post(
    params: HotelBookingParams
  ): Promise<ReturnedResponseSuccess<unknown, unknown>>;
}

type Guest = {
  frequentTraveler?: {
    airlineCode: string;
    frequentTravelerId: string;
  }[];
  phone?: string;
  email?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  childAge?: number;
};
type HotelOrder = {
  hotelBookings: HotelBooking[];
  associatedRecords: {
    reference: string;
    originSystemCode: string;
  }[];
  self: string;
  type: string;
  guests: Guests;
  id: string;
};
type HotelBooking = {
  type: string;
  id: string;
  bookingStatus?:
    | "CONFIRMED"
    | "PENDING"
    | "CANCELLED"
    | "ON_HOLD"
    | "PAST"
    | "UNCONFIRMED"
    | "DENIED"
    | "GHOST"
    | "DELETED";
  roomAssociations: RoomAssociation[];
  hotelOffer: HotelOffer;
  hotel: {
    hotelId: string;
    chainCode: string;
    name: string;
    self?: string;
  };
  hotelProviderInformation: {
    hotelProviderCode: string;
    confirmationNumber: string;
    cancellationNumber?: string;
    onRequestNumber?: string;
  }[];
  payment?: PaymentOutput;
  travelAgentId: string;
  arrivalInformation?: {
    arrivalFlightDetails?: ArrivalFlightDetails;
  };
};
type RoomAssociation = {
  guestReferences: {
    guestReference: string;
    hotelLoyaltyId?: string;
  }[];
  specialRequest?: string;
  hotelOfferId: string;
};
type PaymentOutput = {
  iataTravelAgency?: {
    iataNumber: string;
  };
  billBack?: {
    travelAgencyId?: string;
    bookerId?: string;
    paymentInstructions?: string;
    billbackProviderDeploymentId: string;
    billbackProviderCode: string;
    billbackProviderAccountNumber: string;
    hotelSupplierInformation?: HotelContact;
  };
  method:
    | "CREDIT_CARD"
    | "CREDIT_CARD_AGENCY"
    | "CREDIT_CARD_TRAVELER"
    | "AGENCY_ACCOUNT"
    | "VCC_BILLBACK"
    | "VCC_B2B_WALLET"
    | "TRAVEL_AGENT_ID";
  b2bWallet?: {
    virtualCreditCardId: string;
    paymentProvider: string;
  };
  paymentCard?: {
    paymentCardInfo: {
      vendorCode: string;
      holderName: string;
      cardNumber: string;
      expiryDate: string;
    };
    cardOwnerType?: "TravelAgency" | "Guest" | "Corporation";
    VCC?: boolean;
    address?: Address$1;
  };
};
type PaymentInput = {
  iataTravelAgency?: {
    iataNumber?: string;
  };
  method: "CREDIT_CARD";
  paymentCard?: {
    paymentCardInfo: {
      vendorCode: string;
      holderName: string;
      cardNumber: string;
      securityCode?: string;
      expiryDate: string;
    };
    address?: Address$1;
  };
};
type Price = {
  currency?: string;
  sellingTotal?: string;
  total?: string;
  base?: string;
  markups?: {
    amount?: string;
  }[];
};
type ArrivalFlightDetails = {
  carrierCode: string;
  number: string;
  departure: {
    iataCode: string;
  };
  arrival?: {
    iataCode: string;
    terminal: string;
    at: string;
  };
};
type Guests = ({
  tid?: number;
  id: number;
} & Guest)[];
type HotelProductsGuests = {
  adults?: number;
  childAges?: number[];
};
type Address$1 = {
  lines?: string[];
  postalCode: string;
  countryCode: string;
  cityName: string;
  stateCode?: string;
};
type HotelContact = {
  phone?: string;
  fax: string;
  email?: string;
};
type HotelOffer = {
  type?: "hotel-offer";
  id: string;
} & HotelProduct;
type HotelProduct = {
  checkInDate?: string;
  checkOutDate?: string;
  roomQuantity?: number;
  rateCode: string;
  category?: string;
  commission?: {
    percentage?: string;
    amount?: string;
    description?: QualifiedFreeText;
  };
  room: {
    type?: string;
    description?: QualifiedFreeText;
  };
  guests?: HotelProductsGuests;
  price: Price & {
    taxes?: {
      currency?: string;
      amount?: string;
      code?: string;
      percentage?: string;
      included?: boolean;
      description?: string;
      pricingFrequency?: string;
      pricingMode?: string;
    }[];
    variations?: {
      changes?: ({
        startDate: string;
        endDate: string;
      } & Price)[];
    };
  };
  policies?: {
    paymentType?: "GUARANTEE" | "DEPOSIT" | "PREPAY" | "HOLDTIME";
    guarantee?: {
      description?: QualifiedFreeText;
      acceptedPayments?: HotelProductPaymentPolicy;
    };
    deposit?: HotelProductDepositPolicy;
    prepay?: HotelProductDepositPolicy;
    holdTime?: {
      deadline: string;
    };
    checkInOut?: {
      checkIn?: string;
      checkInDescription?: QualifiedFreeText;
      checkOut?: string;
      checkOutDescription?: QualifiedFreeText;
    };
    cancellations?: {
      type?: "FULL_STAY";
      amount?: string;
      numberOfNights?: number;
      percentage?: string;
      deadline?: string;
      description?: QualifiedFreeText;
    }[];
  };
  rateFamilyEstimated?: {
    code?: string;
    type?: string;
  };
};
type Warning = {
  code: number;
  title: string;
  detail?: string;
  source?: {
    parameter?: string;
    pointer?: string;
    example?: string;
  };
  documentation?: string;
  sources?: any[];
  relationships?: {
    collection?: {
      id?: string;
      type?: string;
      ref?: string;
      targetSchema?: string;
      targetMediaType?: string;
      hrefSchema?: string;
      href?: string;
      methods?: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS")[];
      rel?: string;
    }[];
  };
};
type HotelOrdersParams = {
  data: {
    type: "hotel-order";
    guests: {
      tid: number;
      frequentTraveler?: {
        airlineCode: string;
        frequentTravelerId: string;
      }[];
      phone?: string;
      email?: string;
      title?: string;
      firstName?: string;
      lastName?: string;
      childAge?: number;
    }[];
    arrivalInformation?: {
      arrivalFlightDetails?: ArrivalFlightDetails;
    };
    payment?: PaymentInput;
    roomAssociations?: RoomAssociation[];
    travelAgent: {
      contact: {
        email: string;
        fax?: string;
        phone?: string;
      };
      travelAgentId?: string;
    };
  };
};
type HotelOrdersResult = {
  data: HotelOrder;
  warnings?: Warning[];
};
type HotelOrdersReturnedResponse = ReturnedResponseSuccess<
  HotelOrdersResult,
  HotelOrdersResult["data"]
>;

declare class HotelOrders {
  private client;
  constructor(client: Client);
  post(params: HotelOrdersParams): Promise<HotelOrdersReturnedResponse>;
}

declare class Booking {
  private client;
  flightOrders: FlightOrders;
  hotelBookings: HotelBookings;
  hotelOrders: HotelOrders;
  constructor(client: Client);
  flightOrder(orderId: string): FlightOrder;
}

type AirTraffic$2 = {
  type?: "air-traffic";
  subType?: string;
  destination?: string;
  analytics?: Analytics$4;
};
type Analytics$4 = {
  flights?: Flights$1;
  travelers?: Travelers$1;
};
type Flights$1 = {
  score?: number;
};
type Travelers$1 = {
  score?: number;
};
type TravelAnalayticsAirTrafficTraveledParams = {
  originCityCode: string;
  period: string;
  max?: number;
  fields?: string;
  page?: {
    offset?: number;
    limit?: number;
  };
  sort?: "analytics.flights.score" | "analytics.travelers.score";
};
type TravelAnalayticsAirTrafficTraveledResult = {
  warnings?: Issue[];
  meta?: CollectionMetaLink;
  data: AirTraffic$2[];
};
type TravelAnalayticsAirTrafficTraveledReturnedResponse =
  ReturnedResponseSuccess<
    TravelAnalayticsAirTrafficTraveledResult,
    TravelAnalayticsAirTrafficTraveledResult["data"]
  >;

declare class Traveled {
  private client;
  constructor(client: Client);
  get(
    params: TravelAnalayticsAirTrafficTraveledParams
  ): Promise<TravelAnalayticsAirTrafficTraveledReturnedResponse>;
}

declare class Booked {
  private client;
  constructor(client: Client);
  get(
    params: TravelAnalayticsAirTrafficTraveledParams
  ): Promise<TravelAnalayticsAirTrafficTraveledReturnedResponse>;
}

type AirTraffic$1 = {
  type?: "air-traffic";
  period?: string;
  analytics?: Analytics$3;
};
type Analytics$3 = {
  travelers?: Travelers;
};
type Travelers = {
  score?: number;
};
type TravelAnalayticsAirTrafficBusiestPeriodParams = {
  cityCode: string;
  period: string;
  direction?: "ARRIVING" | "DEPARTING";
};
type TravelAnalayticsAirTrafficBusiestPeriodResult = {
  warnings?: Issue[];
  meta?: CollectionMetaLink;
  data: AirTraffic$1[];
};
type TravelAnalayticsAirTrafficBusiestPeriodReturnedResponse =
  ReturnedResponseSuccess<
    TravelAnalayticsAirTrafficBusiestPeriodResult,
    TravelAnalayticsAirTrafficBusiestPeriodResult["data"]
  >;

declare class BusiestPeriod {
  private client;
  constructor(client: Client);
  get(
    params: TravelAnalayticsAirTrafficBusiestPeriodParams
  ): Promise<TravelAnalayticsAirTrafficBusiestPeriodReturnedResponse>;
}

declare class AirTraffic {
  private client;
  traveled: Traveled;
  booked: Booked;
  busiestPeriod: BusiestPeriod;
  constructor(client: Client);
}

declare class Analytics$2 {
  private client;
  airTraffic: AirTraffic;
  constructor(client: Client);
}

type PredictionResultType$2 =
  | "LESS_THAN_30_MINUTES"
  | "BETWEEN_30_AND_60_MINUTES"
  | "BETWEEN_60_AND_120_MINUTES"
  | "OVER_120_MINUTES_OR_CANCELLED";
type DelayPrediction = {
  type?: string;
  subType?: string;
  id?: string;
  result?: PredictionResultType$2;
  probability?: string;
};
type FlightDelayPredictionParams = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  aircraftCode: string;
  carrierCode: string;
  flightNumber: string;
  duration: string;
};
type FlightDelayPredictionResult = {
  data: DelayPrediction[];
  meta?: CollectionMetaLink;
};
type FlightDelayPredictionReturnedResponse = ReturnedResponseSuccess<
  FlightDelayPredictionResult,
  FlightDelayPredictionResult["data"]
>;

declare class FlightDelay {
  private client;
  constructor(client: Client);
  get(
    params: FlightDelayPredictionParams
  ): Promise<FlightDelayPredictionReturnedResponse>;
}

type Meta$4 = {
  links?: Links$1;
  defaults?: Defaults;
};
type PurposePrediction = {
  type?: "prediction";
  subType?: string;
  id?: string;
  result?: PredictionResultType$1;
  probability?: string;
};
type PredictionResultType$1 = "BUSINESS" | "LEISURE";
type Links$1 = {
  self?: string;
  related?: string;
  type?: string;
};
type Defaults = {
  searchDate?: string;
};
type TripPurposeParams = {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate: string;
  searchDate?: string;
};
type TripPurposeResult = {
  data?: PurposePrediction;
  meta?: Meta$4;
};
type TripPurposesReturnedResponse = ReturnedResponseSuccess<
  TripPurposeResult,
  TripPurposeResult["data"]
>;

declare class TripPurpose {
  private client;
  constructor(client: Client);
  get(params: TripPurposeParams): Promise<TripPurposesReturnedResponse>;
}

declare class Predictions$1 {
  private client;
  tripPurpose: TripPurpose;
  flightDelay: FlightDelay;
  constructor(client: Client);
}

declare class Travel {
  analytics: Analytics$2;
  predictions: Predictions$1;
  constructor(client: Client);
}

type HotelSentiment = {
  hotelId: string;
  type?: "hotelSentiment";
  overallRating: Score;
  numberOfRatings: number;
  numberOfReviews: number;
  sentiments?: {
    sleepQuality?: Score;
    service?: Score;
    facilities?: Score;
    roomComforts?: Score;
    valueForMoney?: Score;
    catering?: Score;
    swimmingPool?: Score;
    location?: Score;
    internet?: Score;
    pointsOfInterest?: Score;
    staff?: Score;
  };
};
type Score = number;
type HotelSentimentsParams = {
  hotelIds: string;
};
type HotelSentimentsResult = {
  warnings?: (Issue & {
    documentation?: string;
  })[];
  data?: HotelSentiment[];
  meta?: CollectionMetaLink;
};
type HotelSentimentReturnedResponse = ReturnedResponseSuccess<
  HotelSentimentsResult,
  HotelSentimentsResult["data"]
>;

declare class HotelSentiments {
  private client;
  constructor(client: Client);
  get(params: HotelSentimentsParams): Promise<HotelSentimentReturnedResponse>;
}

declare class EReputation {
  private client;
  hotelSentiments: HotelSentiments;
  constructor(client: Client);
}

declare class Files {
  private client;
  constructor(client: Client);
}

declare class Media {
  private client;
  files: Files;
  constructor(client: Client);
}

type TransferCancellation = {
  confirmNbr?: string;
  reservationStatus?: "CANCELLED" | "CONFIRMED";
};
type OrderingTransferCancellationResult = {
  data: TransferCancellation;
};
type OrderingTransferCancellationReturnedResponse = ReturnedResponseSuccess<
  OrderingTransferCancellationResult,
  OrderingTransferCancellationResult["data"]
>;

declare class Cancellation {
  private client;
  private orderId;
  constructor(client: Client, orderId: string);
  post(
    body: object,
    confirmNbr: string
  ): Promise<OrderingTransferCancellationReturnedResponse>;
}

declare class Transfers {
  private client;
  private orderId;
  cancellation: Cancellation;
  constructor(client: Client, orderId: string);
}

declare class TransferOrder$1 {
  private client;
  private orderId;
  transfers: Transfers;
  constructor(client: Client, orderId: string);
}

type Transfer = {
  transferType:
    | "PRIVATE"
    | "SHARED"
    | "TAXI"
    | "HOURLY"
    | "AIRPORT_EXPRESS"
    | "AIRPORT_BUS";
  start: Location$2;
  end?: Location$2;
  stopOvers?: StopOver[];
  passenegerCharacteristics?: PassengerCharacteristics[];
  duration?: string;
  vehicle: Vehicle;
  serviceProvider: ServiceProvider;
  partnerInfo?: PartnerInfo;
  quotation: Quotation;
  converted?: Quotation;
  extraServices?: ExtraService[];
  equipment?: Equipment[];
  cancellationRules?: CancellationRule[];
  methodsOfPaymentAccepted: (
    | "CREDIT_CARD"
    | "INVOICE"
    | "TRAVEL_ACCOUNT"
    | "PAYMENT_SERVICE_PROVIDER"
  )[];
  discountCodes?: DiscountCode[];
  distance?: Distance;
};
type TransferReservation = {
  confirmNbr?: string;
  status?: "CONFIRMED" | "CANCELLED";
  note?: string;
  methodOfPayment?:
    | "CREDIT_CARD"
    | "INVOICE"
    | "TRAVEL_ACCOUNT"
    | "PAYMENT_SERVICE_PROVIDER";
  paymentServiceProvider?: "STRIPE_CONNECT";
  offerId?: string;
} & Transfer;
type TransferOrder = {
  type: string;
  id: string;
  reference?: string;
  transfers: TransferReservation[];
  passengers?: Passenger[];
  agency?: Agency;
};
type AddressCommon = {
  line?: string;
  zip?: string;
  countryCode?: string;
  cityName?: string;
  stateCode?: string;
};
type Address = {
  line?: string;
  zip?: string;
  countryCode?: string;
  cityName?: string;
  stateCode?: string;
  latitude?: number;
  longitude?: number;
};
type Agency = {
  contacts?: {
    email?: {
      address?: string;
    };
  }[];
};
type Baggage = {
  count?: number;
  size?: "S" | "M" | "L";
};
type CancellationRule = {
  ruleDescription?: string;
  feeType?: "PERCENTAGE" | "VALUE";
  feeValue?: string;
  currencyCode?: string;
  metricType?: "MINUTES" | "HOURS" | "DAYS" | "YEARS";
  metricMin?: string;
  metricMax?: string;
};
type Contact = {
  phoneNumber?: string;
  email?: string;
};
type Corporation = {
  address?: AddressCommon;
  info?: Record<string, string>;
};
type CreditCard = {
  number: string;
  holderName: string;
  vendorCode: string;
  expiryDate: string;
  cvv?: string;
};
type DiscountCode = {
  type?: "CD" | "PC";
  value?: string;
};
type Distance = {
  value?: number;
  unit?: "KM" | "MI";
};
type Equipment = {
  code:
    | "BBS"
    | "BYC"
    | "CBB"
    | "CBF"
    | "CBS"
    | "CSB"
    | "CSI"
    | "CST"
    | "SBR"
    | "SKB"
    | "SKR"
    | "TAB "
    | "WAR"
    | "WHC"
    | "WIF"
    | "CNT";
  itemId?: string;
  description?: string;
  quotation?: Quotation;
  converted?: Quotation;
  isBookable?: boolean;
  taxIncluded?: boolean;
  includedInTotal?: boolean;
};
type ExtraService = {
  code: "DSL" | "EWT" | "MAG" | "FLM" | "NWS" | "CAI" | "WNR";
  itemId?: string;
  description?: string;
  metricType?: "YEARS" | "DAYS" | "HOURS" | "MINUTES";
  metricValue?: string;
  quotation?: Quotation;
  converted?: Quotation;
  isBookable?: boolean;
  taxIncluded?: boolean;
  includedInTotal?: boolean;
};
type Fee = PointsAndCash & {
  currencyCode?: string;
  indicator?: string;
};
type Location$2 = {
  dateTime?: string;
  locationCode?: string;
  address?: Address;
  name?: string;
  googlePlaceId?: string;
  uicCode?: string;
};
type StopOver = {
  duration?: string;
  sequenceNumber?: number;
  location?: Location$2;
};
type PassengerCharacteristics = {
  passengerTypeCode?: string;
  age?: number;
};
type LoyaltyNumber = {
  program?: string;
  value?: string;
};
type Name = {
  type?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
};
type Passenger = Name & {
  contacts?: Contact;
  billingAddress?: AddressCommon;
};
type Payment = {
  methodOfPayment?:
    | "CREDIT_CARD"
    | "TRAVEL_ACCOUNT"
    | "PAYMENT_SERVICE_PROVIDER";
  paymentReference?: string;
  paymentServiceProvider?: "STRIPE_CONNECT";
  creditCard?: CreditCard;
};
type PartnerInfo = {
  serviceProvider?: ServiceProvider;
};
type PointsAndCash = {
  monetaryAmount?: string;
};
type Quotation = PointsAndCash & {
  currencyCode?: string;
  isEstimated?: boolean;
  base?: PointsAndCash;
  discount?: PointsAndCash;
  taxes?: Tax[];
  fees?: Fee[];
  totalTaxes?: PointsAndCash;
  totalFees?: PointsAndCash;
};
type Seat = {
  count?: number;
  row?: string;
  size?: string;
};
type ServiceProvider = {
  code: string;
  name: string;
  logoUrl: string;
  termsUrl?: string;
  isPreferred?: boolean;
  contacts?: ContactWithAddress;
  settings?: (
    | "BILLING_ADDRESS_REQUIRED"
    | "FLIGHT_NUMBER_REQUIRED"
    | "CVV_NUMBER_REQUIRED"
  )[];
  businessIdentification?: {
    vatRegistrationNumber?: string;
  };
};
type Tax = {
  monetaryAmount?: string;
} & {
  indicator?: string;
  natureCode?: string;
  countryCode?: string;
  rate?: string;
};
type TransportationType = "FLIGHT" | "TRAIN";
type TravelSegment = {
  transportationType?: TransportationType;
  transportationNumber?: string;
  departure?: TravelSegmentLocation;
  arrival?: TravelSegmentLocation;
};
type TravelSegmentLocation = {
  uicCode?: string;
  iataCode?: string;
  localDateTime?: string;
};
type Vehicle = {
  code:
    | "CAR"
    | "SED"
    | "WGN"
    | "ELC"
    | "VAN"
    | "SUV"
    | "LMS"
    | "MBR"
    | "TRN"
    | "BUS";
  category: "ST" | "BU" | "FC";
  description: string;
  seats: Seat[];
  baggages?: Baggage[];
  imageURL?: string;
};
type ContactWithAddress = Contact & {
  address?: AddressCommon;
};
type OrderingTransferOrdersParams = {
  data: {
    note?: string;
    flightNumber?: string;
    passengers: Passenger[];
    agency?: Agency;
    payment: Payment;
    equipment?: Equipment[];
    extraServices?: ExtraService[];
    loyaltyNumber?: LoyaltyNumber;
    corporation?: Corporation;
    startConnectedSegment?: TravelSegment;
    endConnectedSegment?: TravelSegment;
  };
};
type OrderingTransferOrdersResult = {
  data: TransferOrder;
  warnings?: Issue[];
};
type OrderingTransferOrdersReturnedResponse = ReturnedResponseSuccess<
  OrderingTransferOrdersResult,
  OrderingTransferOrdersResult["data"]
>;

declare class TransferOrders {
  private client;
  constructor(client: Client);
  post(
    body: OrderingTransferOrdersParams,
    offerId: string
  ): Promise<OrderingTransferOrdersReturnedResponse>;
}

declare class Ordering {
  private client;
  transferOrders: TransferOrders;
  transferOrder: (orderId: string) => TransferOrder$1;
  constructor(client: Client);
}

type Meta$3 = {
  count?: number;
  links?: {
    self?: string;
  };
};
type AirportDirectDestinationParams = {
  departureAirportCode: string;
  max?: number;
  arrivalCountryCode?: string;
};
type AirportDirectDestinationResult = {
  warnings?: Issue[];
  data: Locations$1[];
  meta?: Meta$3;
};
type AirportDirectDestinationReturnedResponse = ReturnedResponseSuccess<
  AirportDirectDestinationResult,
  AirportDirectDestinationResult["data"]
>;

declare class DirectDestinations {
  private client;
  constructor(client: Client);
  get(
    params: AirportDirectDestinationParams
  ): Promise<AirportDirectDestinationReturnedResponse>;
}

type Meta$2 = {
  links?: Links;
};
type OnTimePrediction = {
  type?: "prediction";
  subType?: string;
  id?: string;
  result?: PredictionResultType;
  probability?: string;
};
type PredictionResultType = string;
type Links = {
  self?: string;
  related?: string;
  type?: string;
};
type AirpoerPredictionsOnTimeParams = {
  airportCode: string;
  date: string;
};
type AirpoerPredictionsOnTimeResult = {
  data: OnTimePrediction;
  meta?: Meta$2;
};
type AirportOnTimePredictionReturnedResponse = ReturnedResponseSuccess<
  AirpoerPredictionsOnTimeResult,
  AirpoerPredictionsOnTimeResult["data"]
>;

declare class OnTime {
  private client;
  constructor(client: Client);
  get(
    params: AirpoerPredictionsOnTimeParams
  ): Promise<AirportOnTimePredictionReturnedResponse>;
}

declare class Predictions {
  private client;
  onTime: OnTime;
  constructor(client: Client);
}

declare class Airport {
  private client;
  directDestinations: DirectDestinations;
  predictions: Predictions;
  constructor(client: Client);
}

type PageName = "next" | "previous" | "first" | "last";

declare class Pagination {
  private client;
  constructor(client: Client);
  page(
    pageName: PageName,
    response: ReturnedResponseSuccess<any, any>
  ): Promise<any>;
  private call;
  private pageNumber;
  private nullPromise;
}

type DatedFlight = {
  type?: string;
  scheduledDepartureDate?: string;
  flightDesignator?: FlightDesignator;
  flightPoints?: FlightPoint[];
  segments?: Segment[];
  legs?: Leg[];
};
type FlightDesignator = {
  carrierCode?: string;
  flightNumber?: number;
  operationalSuffix?: string;
};
type FlightPoint = {
  iataCode?: string;
  departure?: Departure;
  arrival?: Arrival;
};
type Segment = {
  boardPointIataCode?: string;
  offPointIataCode?: string;
  scheduledSegmentDuration?: string;
  partnership?: Partnership;
};
type Partnership = {
  operatingFlight?: FlightDesignator;
};
type Leg = {
  boardPointIataCode?: string;
  offPointIataCode?: string;
  aircraftEquipment?: AircraftEquipment;
  scheduledLegDuration?: string;
};
type Departure = {
  terminal?: Terminal;
  gate?: Gate;
  timings?: Timing[];
};
type Arrival = {
  terminal?: Terminal;
  gate?: Gate;
  timings?: Timing[];
};
type Terminal = {
  code?: string;
};
type Gate = {
  mainGate?: string;
};
type Timing = {
  qualifier?: string;
  value?: string;
  delays?: Delay[];
};
type Delay = {
  duration?: string;
};
type AircraftEquipment = {
  aircraftType?: string;
};
type ScheduleFlightsParams = {
  carrierCode: string;
  flightNumber: string;
  scheduledDepartureDate: string;
  operationalSuffix?: string;
};
type ScheduleFlightsResult = {
  meta?: CollectionMetaLink;
  data: DatedFlight[];
  warnings?: Issue[];
};
type ScheduleFlightsReturnedResponse = ReturnedResponseSuccess<
  ScheduleFlightsResult,
  ScheduleFlightsResult["data"]
>;

declare class Flights {
  private client;
  constructor(client: Client);
  get(params: ScheduleFlightsParams): Promise<ScheduleFlightsReturnedResponse>;
}

declare class Schedule {
  private client;
  flights: Flights;
  constructor(client: Client);
}

type ItineraryPriceMetric = {
  type?: string;
  origin?: {
    iataCode?: string;
  };
  destination?: {
    iataCode?: string;
  };
  departureDate?: string;
  transportType?: "FLIGHT";
  currencyCode?: CurrencyCode;
  oneWay?: boolean;
  priceMetrics?: {
    amount?: string;
    quartileRanking?: "MINIMUM" | "FIRST" | "MEDIUM" | "THIRD" | "MAXIMUM";
  }[];
};
type ItineraryPriceMetricsParams = {
  originIataCode: string;
  destinationIataCode: string;
  departureDate: string;
  currencyCode?: CurrencyCode;
  oneWay?: boolean;
};
type ItineraryPriceMetricsResult = {
  warnings?: Issue[];
  data: ItineraryPriceMetric[];
  meta?: CollectionMetaLink;
};
type ItineraryPriceMetricsReturnedResponse = ReturnedResponseSuccess<
  ItineraryPriceMetricsResult,
  ItineraryPriceMetricsResult["data"]
>;

declare class ItineraryPriceMetrics {
  private client;
  constructor(client: Client);
  get(
    params: ItineraryPriceMetricsParams
  ): Promise<ItineraryPriceMetricsReturnedResponse>;
}

declare class Analytics$1 {
  private client;
  itineraryPriceMetrics: ItineraryPriceMetrics;
  constructor(client: Client);
}

type Meta$1 = {
  count?: number;
  links?: {
    self?: string;
  };
};
type AirlineDestinationsParams = {
  airlineCode: string;
  max?: number;
  arrivalCountryCode?: string;
};
type AirlineDestinationsResult = {
  warnings?: Issue[];
  data: Locations$1[];
  meta?: Meta$1;
};
type AirlineDestinationsReturnedResponse = ReturnedResponseSuccess<
  AirlineDestinationsResult,
  AirlineDestinationsResult["data"]
>;

declare class Destinations {
  private client;
  constructor(client: Client);
  get(
    params: AirlineDestinationsParams
  ): Promise<AirlineDestinationsReturnedResponse>;
}

declare class Airline {
  private client;
  destinations: Destinations;
  constructor(client: Client);
}

interface IAmadeus {
  referenceData: ReferenceData;
  shopping: Shopping;
  booking: Booking;
  travel: Travel;
  eReputation: EReputation;
  media: Media;
  ordering: Ordering;
  airport: Airport;
  pagination: Pagination;
  schedule: Schedule;
  analytics: Analytics$1;
  airline: Airline;
}
type LogLevel = "debug" | "warn" | "silent";
type Hostname = "production" | "test";
type Network = typeof http | typeof https;
type Options = {
  clientId?: string;
  clientSecret?: string;
  logger?: Console;
  logLevel?: LogLevel;
  hostname?: Hostname;
  host?: string;
  ssl?: boolean;
  port?: number;
  customAppId?: string;
  customAppVersion?: string;
  http?: Network;
};
type LocationType = {
  airport: "AIRPORT";
  city: "CITY";
  any: "AIRPORT,CITY";
};
type DirectionType = {
  arriving: "ARRIVING";
  departing: "DEPARTING";
};

type ErrorCodes =
  | "NetworkError"
  | "ParserError"
  | "ServerError"
  | "ClientError"
  | "AuthenticationError"
  | "NotFoundError"
  | "UnknownError";

declare class ResponseError {
  response: ReturnedResponseError;
  code: ErrorCodes;
  description: Issue[];
  constructor(response: Response);
  private determineDescription;
}

type CategoryRatedAreas$1 = {
  geoCode?: GeoCode;
  radius?: number;
  categoryScores?: {
    sight?: {
      overall?: number;
      historical?: number;
      beachAndPark?: number;
    };
    restaurant?: {
      overall?: number;
      vegetarian?: number;
    };
    shopping?: {
      overall?: number;
      luxury?: number;
    };
    nightLife?: {
      overall?: number;
    };
  };
} & {
  type?: string;
};
type Meta = {
  count?: number;
  links?: {
    self?: string;
  };
};
type CategoryRatedAreaParams = {
  latitude: number;
  longitude: number;
};
type CategoryRatedAreaResult = {
  meta?: Meta;
  data: CategoryRatedAreas$1[];
  warnings?: Issue[];
};
type CategoryRatedAreasReturnedResponse = ReturnedResponseSuccess<
  CategoryRatedAreaResult,
  CategoryRatedAreaResult["data"]
>;

declare class CategoryRatedAreas {
  private client;
  constructor(client: Client);
  get(
    params: CategoryRatedAreaParams
  ): Promise<CategoryRatedAreasReturnedResponse>;
}

declare class Analytics {
  private client;
  categoryRatedAreas: CategoryRatedAreas;
  constructor(client: Client);
}

declare class Location$1 {
  private client;
  analytics: Analytics;
  constructor(client: Client);
}

declare class Amadeus implements IAmadeus {
  private client;
  private version;
  referenceData: ReferenceData;
  shopping: Shopping;
  booking: Booking;
  travel: Travel;
  eReputation: EReputation;
  media: Media;
  ordering: Ordering;
  airport: Airport;
  pagination: Pagination;
  schedule: Schedule;
  analytics: Analytics$1;
  location: Location$1;
  airline: Airline;
  static location: LocationType;
  static direction: DirectionType;
  constructor(options?: Options);
  previous(response: ReturnedResponseSuccess<any, any>): Promise<unknown>;
  next(response: ReturnedResponseSuccess<any, any>): Promise<unknown>;
  first(response: ReturnedResponseSuccess<any, any>): Promise<unknown>;
  last(response: ReturnedResponseSuccess<any, any>): Promise<unknown>;
}

export {
  type ActivitiesBySquareParams,
  type ActivitiesResult as ActivitiesBySquareResult,
  type ActivitiesParams,
  type ActivitiesResult,
  type ActivityResult,
  type AirlineDestinationsParams,
  type AirlineDestinationsResult,
  type AirpoerPredictionsOnTimeParams,
  type AirpoerPredictionsOnTimeResult,
  type AirportDirectDestinationParams,
  type AirportDirectDestinationResult,
  type CategoryRatedAreaParams,
  type CategoryRatedAreaResult,
  type CreditCardBrand,
  type CurrencyCode,
  type DiscountTravelerType,
  type DiscountType,
  type DocumentType,
  type FlightAvailabilitiesParams,
  type FlightAvailabilitiesResult,
  type FlightDatesParams,
  type FlightDatesResult,
  type FlightDelayPredictionParams,
  type FlightDelayPredictionResult,
  type FlightDestinationsParams,
  type FlightDestinationsResult,
  type FlightOffer,
  type FlightOffersPredictionParams,
  type FlightOffersPredictionResult,
  type FlightOffersPricingAdditionalParams,
  type FlightOffersPricingParams,
  type FlightOffersPricingResult,
  type FlightOffersSearchGetParams,
  type FlightOffersSearchGetResult,
  type FlightOffersSearchPostParams,
  type FlightOffersSearchPostResult,
  type FlightOffersUpsellingParams,
  type FlightOffersUpsellingResult,
  type FlightOrderGetResult,
  type FlightOrdersParams,
  type FlightOrdersResult,
  type HotelBookingParams,
  type HotelOfferSearchParams,
  type HotelOfferSearchResult,
  type HotelOffersSearchParams,
  type HotelOffersSearchResult,
  type HotelOrdersParams,
  type HotelOrdersResult,
  type ItineraryPriceMetricsParams,
  type ItineraryPriceMetricsResult,
  type OrderingTransferCancellationResult,
  type OrderingTransferOrdersParams,
  type OrderingTransferOrdersResult,
  type PaymentBrand,
  type RecommendedLocationsParams,
  type RecommendedLocationsResult,
  type ReferenceDataAirlinesParams,
  type ReferenceDataAirlinesResult,
  type ReferenceDataCheckinLinksParams,
  type ReferenceDataCheckinLinksResult,
  type ReferenceDataLocationsAirportsParams,
  type ReferenceDataLocationsAirportsResult,
  type ReferenceDataLocationsCitiesParams,
  type ReferenceDataLocationsCitiesResult,
  type ReferenceDataLocationsHotelParams,
  type ReferenceDataLocationsHotelResult,
  type ReferenceDataLocationsHotelsByCityParams,
  type ReferenceDataLocationsHotelsResult as ReferenceDataLocationsHotelsByCityResult,
  type ReferenceDataLocationsHotelsByGeoCodeParams,
  type ReferenceDataLocationsHotelsResult as ReferenceDataLocationsHotelsByGeoCodeResult,
  type ReferenceDataLocationsHotelsByHotelsParams,
  type ReferenceDataLocationsHotelsResult as ReferenceDataLocationsHotelsByHotelsResult,
  type ReferenceDataLocationsParams,
  type ReferenceDataLocationsPoisBySquareParams,
  type ReferenceDataLocationsPoisResult as ReferenceDataLocationsPoisBySquareResult,
  type ReferenceDataLocationsPoisParams,
  type ReferenceDataLocationsPoisPoiResult,
  type ReferenceDataLocationsPoisResult,
  type ReferenceDataLocationsResult,
  ResponseError,
  type ScheduleFlightsParams,
  type ScheduleFlightsResult,
  type SeatmapsGetParams,
  type SeatmapsGetResult,
  type SeatmapsPostParams,
  type SeatmapsPostResult,
  type ShoppingTransferOffersParams,
  type ShoppingTransferOffersResult,
  type TravelAnalayticsAirTrafficTraveledParams as TravelAnalayticsAirTrafficBookedParams,
  type TravelAnalayticsAirTrafficTraveledResult as TravelAnalayticsAirTrafficBookedResult,
  type TravelAnalayticsAirTrafficBusiestPeriodParams,
  type TravelAnalayticsAirTrafficBusiestPeriodResult,
  type TravelAnalayticsAirTrafficTraveledParams,
  type TravelAnalayticsAirTrafficTraveledResult,
  type TravelClass,
  type TravelerType,
  type TripPurposeParams,
  type TripPurposeResult,
  type Segment$1,
  type OperatingFlight$1,
  Amadeus as default,
};
