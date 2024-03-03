import "../styles/footer.css";
import { LinkedInIcon } from "../imports/MUI-Imports";
import { useTranslation } from "../imports/Other-Imports";

export default function Footer() {
  // ===== [ CUSTOM HOOK ] ===== //
  const { t, i18n } = useTranslation();

  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <span className="copyright">&copy; {currentYear}:</span>
      <a
        className="linkedin-anchor"
        href="https://www.linkedin.com/in/moehurmoz"
        dir={i18n.dir(i18n.language)}
      >
        {t("Developer")} <LinkedInIcon className="icon" />
      </a>
    </footer>
  );
}
