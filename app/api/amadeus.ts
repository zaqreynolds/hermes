import { AmadeusTokenDataDTO, getTokenData, setTokenData } from "@/lib/amadeus";
import { NextApiRequest, NextApiResponse } from "next";

const fetchAmadeusToken = async () => {
  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Amadeus API credentials");
  }

  const response = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Amadeus token");
  }

  const data: AmadeusTokenDataDTO = await response.json();
  setTokenData(data);

  return response.json();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { access_token, expires_in } = getTokenData();

    if (!access_token || expires_in < Date.now()) {
      await fetchAmadeusToken();
    }

    res.status(200).json({ access_token });
  } catch {
    res.status(500).json({ error: "Error fetching Amadeus token" });
  }
}
