import * as MUI from "../../imports/MUI-Imports";
import { useTranslation } from "../../imports/Other-Imports";
import { InitialState } from "../../redux/features/menuOptionsSlice";

// ===== [ INTERFACE DECLARATION ] ===== //
interface RadioDialogProps {
  open: InitialState["options"]["openRadio"];
  title: InitialState["options"]["title"];
  radioOptions: InitialState["options"]["options"];
  selectedValue: InitialState["options"]["selectedValue"];
  change: (newValue: string) => void;
  confirme: () => void;
  close: () => void;
}

export default function RadioDialog(props: RadioDialogProps) {
  const { open, title, radioOptions, selectedValue, change, confirme, close } =
    props;

  const { t, i18n } = useTranslation();

  // ===== [ EVENT HANDLER ] ===== //
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <MUI.DialogTitle textAlign={"center"}>{t(title!)}</MUI.DialogTitle>

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
          {radioOptions!.map((option) => (
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
