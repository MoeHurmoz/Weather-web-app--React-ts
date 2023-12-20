import * as MUI from "../../imports/MUI-Imports";
import { useTranslation, PropTypes } from "../../imports/Other-Imports";

export default function RadioDialog(props) {
  const { open, title, radioOptions, selectedValue, change, confirme, close } =
    props;

  const { t, i18n } = useTranslation();

  // ===== [ EVENT HANDLER ] ===== //
  const handleChange = (event) => {
    change(event.target.value);
  };

  return (
    <MUI.Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={close}
    >
      {/* ===== [ TITLE ] ===== */}
      <MUI.DialogTitle textAlign={"center"}>{t(title)}</MUI.DialogTitle>

      {/* ===== [ CONTENT ] ===== */}
      <MUI.DialogContent dividers sx={{ p: "16px 19px" }}>
        <MUI.RadioGroup
          aria-label={title}
          name={title}
          value={selectedValue}
          onChange={handleChange}
          row
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {radioOptions.map((option) => (
            <MUI.FormControlLabel
              key={option.label}
              label={option.label}
              value={option.value}
              control={<MUI.Radio />}
              labelPlacement="top"
            />
          ))}
        </MUI.RadioGroup>
      </MUI.DialogContent>

      {/* ===== [ ACTIONS ] ===== */}
      <MUI.DialogActions dir={i18n.dir(i18n.language)}>
        <MUI.Button onClick={close}>{t("Cancel")}</MUI.Button>
        <MUI.Button onClick={confirme}>{t("Ok")}</MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
}

// PROPTYPES CONFIGURATION:
RadioDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  radioOptions: PropTypes.array.isRequired,
  selectedValue: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  confirme: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};
