import * as MUI from "../../imports/MUI-Imports";
import FormDialog from "./FormDialog";
import RadioDialog from "./RadioDialog";
import { useState } from "../../imports/React-Imports";
import { useUrlInfo } from "../../contexts/UrlInfoContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useTranslation } from "../../imports/Other-Imports";
import {
  reducersActions,
  ConfirmeLocationPayload,
  ConfirmeRadioPayload,
} from "../../redux/features/menuOptionsSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

const optionsArr: string[] = ["Location", "Units", "Language"];

export default function MenuButton() {
  // ===== [ CUSTOM HOOKS ] ===== //
  const UIC = useUrlInfo();
  const { showSnackbarAlert } = useSnackbar();
  const { t, i18n } = useTranslation(); // FROM I18NEXT LIBRARY

  // ===== [ REDUX HOOKS & ACTIONS ] ===== //
  const options = useAppSelector((state) => state.menuOptions.options);
  const dispatch = useAppDispatch();
  const {
    click,
    closeLocation,
    closeRadio,
    changeRadio,
    confirmeLocation,
    confirmeRadio,
  } = reducersActions;

  // ===== [ STATES ] ===== //
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openMenu = Boolean(anchorEl);

  // ===== [ EVENT HANDLERS ] ===== //
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (event: React.MouseEvent<HTMLLIElement>) => {
    dispatch(
      click({
        clickedFrom: (event.target as HTMLLIElement).id,
        currentLang: UIC.urlInfo!.lang,
        t,
      })
    );
  };

  // LOCATION HANDLERS:
  const handleCloseLocation = () => {
    dispatch(closeLocation());
  };

  const handleConfirmeLocation = () => {
    dispatch(
      confirmeLocation({
        UIC,
        handleCloseMenu,
        showSnackbarAlert,
        t,
      } as ConfirmeLocationPayload)
    );
  };

  // RADIO HANDLERS:
  const handleRadioChange = (newValue: string) => {
    dispatch(changeRadio(newValue));
  };

  const handleCloseRadio = () => {
    dispatch(closeRadio());
  };

  const handleConfirmeRadio = () => {
    dispatch(
      confirmeRadio({
        UIC,
        showSnackbarAlert,
        t,
        i18n,
        handleCloseMenu,
      } as ConfirmeRadioPayload)
    );
  };

  return (
    <>
      {/* ===== [ MENU BUTTON ] ===== */}
      <MUI.IconButton
        aria-label="more"
        id="long-button"
        aria-controls={openMenu ? "long-menu" : undefined}
        aria-expanded={openMenu ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleMenuClick}
        className="menu-button"
      >
        <MUI.MenuIcon htmlColor="black" />
      </MUI.IconButton>

      {openMenu && (
        <MUI.Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          dir={i18n.dir(i18n.language)}
          disableAutoFocusItem
        >
          {optionsArr.map((option) => (
            <MUI.MenuItem
              key={option}
              id={option.match(/^\w{4}/)![0]}
              onClick={handleOptionClick}
              autoFocus={false}
            >
              {t(option)}
            </MUI.MenuItem>
          ))}
        </MUI.Menu>
      )}

      {/* ===== [ FORM DIALOG ] ===== */}
      {options.openLocation && (
        <FormDialog
          open={options.openLocation}
          title="Location"
          confirme={handleConfirmeLocation}
          close={handleCloseLocation}
        />
      )}

      {/* ===== [ RADIO DIALOG ] ===== */}
      {options.openRadio && (
        <RadioDialog
          open={options.openRadio}
          title={options.title!}
          radioOptions={options.options!}
          selectedValue={options.selectedValue!}
          change={handleRadioChange}
          confirme={handleConfirmeRadio}
          close={handleCloseRadio}
        />
      )}
    </>
  );
}
