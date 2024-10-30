export interface AmadeusTokenDataDTO {
  access_token: string | null;
  expires_in: number;
}

const amadeusTokenData: AmadeusTokenDataDTO = {
  access_token: null,
  expires_in: 0,
};

export const getTokenData = (): AmadeusTokenDataDTO => {
  return amadeusTokenData;
};

export const setTokenData = (data: AmadeusTokenDataDTO) => {
  amadeusTokenData.access_token = data.access_token;
  amadeusTokenData.expires_in = data.expires_in;
};
