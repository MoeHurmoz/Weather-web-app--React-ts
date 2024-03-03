import { createContext, useContext, useState } from "../imports/React-Imports";

// ===== [ INTERFACE DECLARATIONS ] ===== //
export interface Location {
  cityName: string;
  countryCode: string;
}

interface InitialData {
  lang: string;
  unit: string;
  location: Location;
  type: string;
}

export interface UrlContext {
  urlInfo?: InitialData;
  setUrlInfo?: React.Dispatch<React.SetStateAction<InitialData>>;
}

interface UrlInfoProviderProps {
  children: React.ReactNode;
}

// ===== [ CONTEXT ] ===== //
const UrlInfoContext = createContext<UrlContext>({});

// CUSTOM HOOK:
export const useUrlInfo = () => useContext(UrlInfoContext);

// INITIAL DATA:
const initialData = {
  lang:
    localStorage.getItem("Lang") ??
    navigator.language.match(/^[a-z]{2}(?=-)*/)![0] ??
    "en",
  unit: localStorage.getItem("Unit") ?? "metric",
  location: JSON.parse(localStorage.getItem("Location") as string) as Location,
  type: "location",
};

// PROVIDER COMPONENT:
export function UrlInfoProvider({ children }: UrlInfoProviderProps) {
  const [urlInfo, setUrlInfo] = useState<InitialData>(initialData);

  return (
    <UrlInfoContext.Provider value={{ urlInfo, setUrlInfo }}>
      {children}
    </UrlInfoContext.Provider>
  );
}
