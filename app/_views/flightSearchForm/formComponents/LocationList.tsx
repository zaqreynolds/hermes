import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AmadeusLocation } from "../../../types";
import { faCity, faPlaneUp } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { LoadingText } from "../LoadingText";

export const LocationList = ({
  locationData,
  error,
  isLoading,
  handleLocationSelect,
  selectedIndex,
  onChange,
}: {
  locationData: AmadeusLocation[];
  error: string | null;
  isLoading: boolean;
  handleLocationSelect: (location: AmadeusLocation) => void;
  selectedIndex: number;
  onChange: (value: AmadeusLocation) => void;
}) => {
  return (
    <div className="max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="p-3 text-center text-gray-500">
          <LoadingText isLoading={isLoading} />
        </div>
      ) : error ? (
        <div className="p-3 text-center text-red-500">{error}</div>
      ) : locationData.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {locationData.map((location) => (
            <li
              key={location.id}
              className={cn(
                "p-3 hover:bg-accent cursor-pointer hover:shadow-lg",
                selectedIndex === locationData.indexOf(location) && "bg-accent"
              )}
              onClick={() => {
                handleLocationSelect(location);
                onChange(location);
              }}
            >
              <div className="flex items-center">
                <div>
                  <p className="font-medium flex items-center">
                    {location.name}
                    <FontAwesomeIcon
                      icon={location.subType === "AIRPORT" ? faPlaneUp : faCity}
                      className="h-3 w-3 pl-2"
                    />
                  </p>
                  <p className="text-sm text-gray-500">
                    {location.address.cityName}, {location.address.countryName}
                  </p>
                </div>
                <span className="ml-auto text-sm text-gray-400">
                  {location.iataCode}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-3 text-center text-gray-500 opacity-50">
          No locations found
        </div>
      )}
    </div>
  );
};
