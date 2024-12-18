import { Suspense } from "react";
import FlightSearchForm from "./_components/flightSearchForm/FlightSearchForm";
import { FlightSearchResults } from "./_components/flightSearchResults/FlightSearchResults";

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
    <div className="w-full flex flex-col p-4 overflow-auto items-center">
      <Suspense fallback={<div>Loading Flight Search Form...</div>}>
        <FlightSearchForm />
      </Suspense>
      <Suspense fallback={<div>Loading Flight Search Results...</div>}>
        <FlightSearchResults />
      </Suspense>
    </div>
  );
}
