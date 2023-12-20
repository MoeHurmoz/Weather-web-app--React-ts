import * as MUI from "../imports/MUI-Imports";
import WeatherCard from "./WeatherCard";
import Footer from "./Footer";
import { useEffect } from "../imports/React-Imports";
import { useTranslation } from "../imports/Other-Imports";
import { useUrlInfo } from "../contexts/UrlInfoContext";

export default function MainContent() {
  // ===== [ CUSTOM HOOKS ] ===== //
  const { i18n } = useTranslation(); // FROM I18NEXT LIBRARY
  const { urlInfo } = useUrlInfo();

  // ===== [ SIDE EFFECTS ] ===== //
  useEffect(() => {
    // LOCALIZATION:
    i18n.changeLanguage(urlInfo.lang);
    // The comment below disables ESLint (don't remove it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MUI.Container maxWidth="md" className="main-content">
      <WeatherCard />
      <Footer />
    </MUI.Container>
  );
}
