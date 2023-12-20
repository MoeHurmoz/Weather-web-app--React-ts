import { createContext, useContext, useState } from "../imports/React-Imports";

const UrlInfoContext = createContext({});

// CUSTOM HOOK:
export const useUrlInfo = () => useContext(UrlInfoContext);

// INITIAL DATA:
const initialData = {
  lang:
    localStorage.getItem("Lang") ??
    navigator.language.match(/^[a-z]{2}(?=-)*/)[0] ??
    "en",
  unit: localStorage.getItem("Unit") ?? "metric",
  location: JSON.parse(localStorage.getItem("Location")),
  type: "location",
};

// PROVIDER COMPONENT:
export function UrlInfoProvider({ children }) {
  const [urlInfo, setUrlInfo] = useState(initialData);

  return (
    <UrlInfoContext.Provider value={{ urlInfo, setUrlInfo }}>
      {children}
    </UrlInfoContext.Provider>
  );
}
