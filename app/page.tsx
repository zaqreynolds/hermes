import { Suspense } from "react";
import FlightSearchForm from "./_views/flightSearchForm/FlightSearchForm";
import { FlightSearchResults } from "./_views/flightSearchResults/FlightSearchResults";
import Pricing from "./_views/pricing/Pricing";

export default function Home() {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  // and then this for the button click
  // router.push(pathname + '?' + createQueryString('key', 'value'));

  return (
    <div className="w-full flex flex-col overflow-auto items-center mt-1 px-4">
      <Suspense fallback={<div>Loading Flight Search Form...</div>}>
        <FlightSearchForm />
      </Suspense>
      <div className="flex w-full overflow-hidden">
        <Suspense fallback={<div>Loading Flight Search Results...</div>}>
          <FlightSearchResults />
        </Suspense>
        <Suspense fallback={<div>Loading Pricing and Analysis...</div>}>
          <Pricing />
        </Suspense>
      </div>
    </div>
  );
}
