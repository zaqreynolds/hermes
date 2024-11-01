// "use client";
// import React, { createContext, useState, useEffect, ReactNode } from "react";

// interface AmadeusContextType {
//   amadeusToken: string | null;
//   fetchAmadeusToken: () => void;
// }

// export const AmadeusContext = createContext<AmadeusContextType | undefined>(
//   undefined
// );

// export const AmadeusProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [amadeusToken, setAmadeusToken] = useState<string | null>(null);

//   const fetchAmadeusToken = async () => {
//     try {
//       const apiKey = process.env.NEXT_PUBLIC_AMADEUS_API_KEY;
//       const apiSecret = process.env.NEXT_PUBLIC_AMADEUS_API_SECRET;

//       if (!apiKey || !apiSecret) {
//         throw new Error("Missing Amadeus API credentials");
//       }

//       const response = await fetch(
//         "https://test.api.amadeus.com/v1/security/oauth2/token",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             grant_type: "client_credentials",
//             client_id: apiKey,
//             client_secret: apiSecret,
//           }),
//         }
//       );
//       const data = await response.json();
//       setAmadeusToken(data.access_token);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAmadeusToken();

//     const interval = setInterval(fetchAmadeusToken, 29 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <AmadeusContext.Provider value={{ amadeusToken, fetchAmadeusToken }}>
//       {children}
//     </AmadeusContext.Provider>
//   );
// };
