import { Autocomplete, Box, TextField } from "../../imports/MUI-Imports";
import { useTranslation } from "../../imports/Other-Imports";
import { useState } from "../../imports/React-Imports";
import { useDispatch } from "../../imports/Redux-Imports";
import { reducersActions } from "../../redux/features/menuOptionsSlice";

export default function LocationAutocomplete() {
  // ===== [ CUSTOM HOOK ] ===== //
  const { t } = useTranslation();

  // ===== [ STATE ] ===== //
  const [open, setOpen] = useState(false);

  // ===== [ REDUX HOOK & ACTION ] ===== //
  const dispatch = useDispatch();
  const { changeLocation } = reducersActions;

  // ===== [ EVENT HANDLERS ] ===== //
  const handleTextFieldChange = (event) => {
    /\w/.test(event.target.value) ? setOpen(true) : setOpen(false);
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (newValue != null) {
      dispatch(changeLocation(newValue));
    }
  };

  return (
    <Autocomplete
      id="location-autocomplete"
      dir="ltr"
      noOptionsText="No locations"
      autoHighlight
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleAutocompleteChange}
      options={location}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t("Search for the city in English")}
          variant="standard"
          inputProps={{
            ...params.inputProps,
            autoComplete: "off",
          }}
          onChange={handleTextFieldChange}
        />
      )}
    />
  );
}

const location = [
  { code: "AE", label: "Abu Dhabi, United Arab Emirates" },
  { code: "AE", label: "Ajman, United Arab Emirates" },
  { code: "AE", label: "Al Ain, United Arab Emirates" },
  { code: "AE", label: "Bateen Liwa, United Arab Emirates" },
  { code: "AE", label: "Dubai, United Arab Emirates" },
  { code: "AE", label: "Fujairah, United Arab Emirates" },
  { code: "AE", label: "Ras Al Khaimah, United Arab Emirates" },
  { code: "AE", label: "Sharjah, United Arab Emirates" },
  { code: "AE", label: "Umm Al Quwain, United Arab Emirates" },

  { code: "AF", label: "Kabul, Afghanistan" },
  { code: "AL", label: "Tirana, Albania" },
  { code: "AZ", label: "Baku, Azerbaijan" },

  { code: "BD", label: "Dhaka, Bangladesh" },
  { code: "BF", label: "Ouagadougou, Burkina Faso" },
  { code: "BH", label: "Manama, Bahrain" },

  { code: "DZ", label: "Algiers, Algeria" },

  { code: "EG", label: "Alexandria, Egypt" },
  { code: "EG", label: "Asyut, Egypt" },
  { code: "EG", label: "Aswan, Egypt" },
  { code: "EG", label: "Beni Suef, Egypt" },
  { code: "EG", label: "Cairo, Egypt" },
  { code: "EG", label: "Damietta, Egypt" },
  { code: "EG", label: "Dahab, Egypt" },
  { code: "EG", label: "El Alamein, Egypt" },
  { code: "EG", label: "El Mansura, Egypt" },
  { code: "EG", label: "Faiyum, Egypt" },
  { code: "EG", label: "Hurghada, Egypt" },
  { code: "EG", label: "Luxor, Egypt" },
  { code: "EG", label: "Marsa Alam, Egypt" },
  { code: "EG", label: "Marsa Matruh, Egypt" },
  { code: "EG", label: "Port Said, Egypt" },
  { code: "EG", label: "Sharm Ash Sheikh, Egypt" },
  { code: "EG", label: "Suez, Egypt" },
  { code: "EG", label: "Suhaj, Egypt" },
  { code: "EG", label: "Safaja, Egypt" },
  { code: "EG", label: "Tanta, Egypt" },

  { code: "ID", label: "Bandung, Indonesia" },
  { code: "ID", label: "Denpasar, Indonesia" },
  { code: "ID", label: "Jakarta, Indonesia" },
  { code: "ID", label: "Jambi, Indonesia" },
  { code: "ID", label: "Klaten, Indonesia" },
  { code: "ID", label: "Kupang, Indonesia" },
  { code: "ID", label: "Mataram, Indonesia" },
  { code: "ID", label: "Malang, Indonesia" },
  { code: "ID", label: "Medan, Indonesia" },
  { code: "ID", label: "Semarang, Indonesia" },
  { code: "ID", label: "Surabaya, Indonesia" },
  { code: "ID", label: "Surakarta, Indonesia" },
  { code: "ID", label: "Padang, Indonesia" },
  { code: "ID", label: "Palembang, Indonesia" },
  { code: "ID", label: "Pekanbaru, Indonesia" },

  { code: "IQ", label: "Baghdad, Iraq" },

  { code: "JO", label: "Amman, Jordan" },

  { code: "KW", label: "Al Khiran, Kuwait" },
  { code: "KW", label: "Jahra, Kuwait" },
  { code: "KW", label: "Kuwait City, Kuwait" },

  { code: "LB", label: "Beirut, Lebanon" },
  { code: "LY", label: "Tripoli, Libya" },

  { code: "MA", label: "Casablanca, Morocco" },
  { code: "MR", label: "Nouakchott, Mauritania" },
  { code: "MY", label: "Kuala Lumpur, Malaysia" },

  { code: "OM", label: "Muscat, Oman" },
  { code: "OM", label: "Salalah, Oman" },

  { code: "PK", label: "Islamabad, Pakistan" },

  { code: "PS", label: "Al Quds, Palestine" },
  { code: "PS", label: "Gaza, Palestine" },

  { code: "QA", label: "Al Ruwais, Qatar" },
  { code: "QA", label: "Al Khor, Qatar" },
  { code: "QA", label: "Ash-Shahaniyah, Qatar" },
  { code: "QA", label: "Doha, Qatar" },
  { code: "QA", label: "Dukhan, Qatar" },
  { code: "QA", label: "Umm Bab, Qatar" },

  { code: "SA", label: "Abha, Saudi Arabia" },
  { code: "SA", label: "AlUla, Saudi Arabia" },
  { code: "SA", label: "Al Bahah, Saudi Arabia" },
  { code: "SA", label: "Al Hada, Saudi Arabia" },
  { code: "SA", label: "Al Medina, Saudi Arabia" },
  { code: "SA", label: "Ash Shafa, Saudi Arabia" },
  { code: "SA", label: "Biljurashi, Saudi Arabia" },
  { code: "SA", label: "Dammam, Saudi Arabia" },
  { code: "SA", label: "Jeddah, Saudi Arabia" },
  { code: "SA", label: "Jubail, Saudi Arabia" },
  { code: "SA", label: "Hail, Saudi Arabia" },
  { code: "SA", label: "Hafar Al Batin, Saudi Arabia" },
  { code: "SA", label: "Makkah, Saudi Arabia" },
  { code: "SA", label: "Riyadh, Saudi Arabia" },
  { code: "SA", label: "Sakaka, Saudi Arabia" },
  { code: "SA", label: "Taif, Saudi Arabia" },
  { code: "SA", label: "Tabuk, Saudi Arabia" },
  { code: "SA", label: "Yanbu, Saudi Arabia" },

  { code: "SD", label: "Khartoum, Sudan" },
  { code: "SO", label: "Mogadishu, Somalia" },

  { code: "SY", label: "Aleppo, Syria" },
  { code: "SY", label: "Damascus, Syria" },

  { code: "TM", label: "Ashgabat, Turkmenistan" },
  { code: "TN", label: "Tunis, Tunisia" },

  { code: "TR", label: "Ankara, Türkiye" },
  { code: "TR", label: "Istanbul, Türkiye" },

  { code: "UZ", label: "Tashkent, Uzbekistan" },

  { code: "YE", label: "Aden, Yemen" },
  { code: "YE", label: "Al Hudaydah, Yemen" },
  { code: "YE", label: "Al Qatan, Yemen" },
  { code: "YE", label: "Ghayl Ba Wazir, Yemen" },
  { code: "YE", label: "Haswayn, Yemen" },
  { code: "YE", label: "Mukalla, Yemen" },
  { code: "YE", label: "Sana'a, Yemen" },
  { code: "YE", label: "Seiyun, Yemen" },
  { code: "YE", label: "Tarim, Yemen" },
  { code: "YE", label: "Taizz, Yemen" },
];
