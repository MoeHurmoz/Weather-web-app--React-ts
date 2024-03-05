import * as MUI from "../../imports/MUI-Imports";
import { useTranslation } from "../../imports/Other-Imports";
import LocationAutocomplete from "./LocationAutocomplete";

export default function FormDialog(props) {
  const { open, title, confirme, close } = props;

  const { t, i18n } = useTranslation();

  return (
    <MUI.Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={close}
      dir={i18n.dir(i18n.language)}
    >
      {/* ===== [ TITLE ] ===== */}
      <MUI.DialogTitle textAlign={"center"}>{t(title)}</MUI.DialogTitle>

      {/* ===== [ CONTENT ] ===== */}
      <MUI.DialogContent dividers>
        <LocationAutocomplete />
      </MUI.DialogContent>

      {/* ===== [ ACTIONS ] ===== */}
      <MUI.DialogActions>
        <MUI.Button onClick={close}>{t("Cancel")}</MUI.Button>
        <MUI.Button onClick={confirme}>{t("Ok")}</MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
}
