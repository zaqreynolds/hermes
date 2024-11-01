declare module "amadeus" {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
  }

  interface Locations {
    get(params: {
      keyword: string;
      subType: string;
    }): Promise<{ data: unknown }>;
  }

  interface ReferenceData {
    locations: Locations;
  }

  class Amadeus {
    constructor(config: AmadeusConfig);
    referenceData: ReferenceData;
  }

  export = Amadeus;
}
