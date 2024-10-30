"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debouncedValue) {
      const fetchLocations = async () => {
        // try {
        //   const response = await fetch(`https://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/US/en-US?query=${debouncedValue}&apiKey=${process.env.NEXT_PUBLIC_SKYSCANNER_API_KEY}`);
        //   const data = await response.json();
        //   console.log(data);
        // } catch (error) {
        //   console.error("Error fetching data:", error);
        // }
      };

      fetchLocations();
    }
  }, [debouncedValue]);

  return (
    <div className="flex flex-col h-full w-full items-center">
      <h1>Hello Hermes</h1>
      <Label htmlFor="origin_search">Origin:</Label>
      <Input
        id="origin_search"
        className="w-44"
        type="text"
        value={search}
        placeholder="Search for a location..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <Label htmlFor="destination_search">Destination:</Label>
      <Input
        id="destination_search"
        className="w-44"
        type="text"
        value={search}
        placeholder="Search for a location..."
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
