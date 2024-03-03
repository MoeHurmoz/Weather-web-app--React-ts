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
      getOptionLabel={(option) => option.cityName}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.countryCode.toLowerCase()}.png`}
            alt=""
          />
          {option.cityName}
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
  { countryCode: "AE", cityName: "Abu Dhabi, United Arab Emirates" },
  { countryCode: "AE", cityName: "Ajman, United Arab Emirates" },
  { countryCode: "AE", cityName: "Al Ain, United Arab Emirates" },
  { countryCode: "AE", cityName: "Bateen Liwa, United Arab Emirates" },
  { countryCode: "AE", cityName: "Dubai, United Arab Emirates" },
  { countryCode: "AE", cityName: "Fujairah, United Arab Emirates" },
  { countryCode: "AE", cityName: "Ras Al Khaimah, United Arab Emirates" },
  { countryCode: "AE", cityName: "Sharjah, United Arab Emirates" },
  { countryCode: "AE", cityName: "Umm Al Quwain, United Arab Emirates" },

  { countryCode: "AF", cityName: "Kabul, Afghanistan" },
  { countryCode: "AL", cityName: "Tirana, Albania" },
  { countryCode: "AZ", cityName: "Baku, Azerbaijan" },

  { countryCode: "BD", cityName: "Dhaka, Bangladesh" },
  { countryCode: "BF", cityName: "Ouagadougou, Burkina Faso" },
  { countryCode: "BH", cityName: "Manama, Bahrain" },

  { countryCode: "DZ", cityName: "Algiers, Algeria" },

  { countryCode: "EG", cityName: "Alexandria, Egypt" },
  { countryCode: "EG", cityName: "Asyut, Egypt" },
  { countryCode: "EG", cityName: "Aswan, Egypt" },
  { countryCode: "EG", cityName: "Beni Suef, Egypt" },
  { countryCode: "EG", cityName: "Cairo, Egypt" },
  { countryCode: "EG", cityName: "Damietta, Egypt" },
  { countryCode: "EG", cityName: "Dahab, Egypt" },
  { countryCode: "EG", cityName: "El Alamein, Egypt" },
  { countryCode: "EG", cityName: "El Mansura, Egypt" },
  { countryCode: "EG", cityName: "Faiyum, Egypt" },
  { countryCode: "EG", cityName: "Hurghada, Egypt" },
  { countryCode: "EG", cityName: "Luxor, Egypt" },
  { countryCode: "EG", cityName: "Marsa Alam, Egypt" },
  { countryCode: "EG", cityName: "Marsa Matruh, Egypt" },
  { countryCode: "EG", cityName: "Port Said, Egypt" },
  { countryCode: "EG", cityName: "Sharm Ash Sheikh, Egypt" },
  { countryCode: "EG", cityName: "Suez, Egypt" },
  { countryCode: "EG", cityName: "Suhaj, Egypt" },
  { countryCode: "EG", cityName: "Safaja, Egypt" },
  { countryCode: "EG", cityName: "Tanta, Egypt" },

  { countryCode: "ID", cityName: "Bandung, Indonesia" },
  { countryCode: "ID", cityName: "Denpasar, Indonesia" },
  { countryCode: "ID", cityName: "Jakarta, Indonesia" },
  { countryCode: "ID", cityName: "Jambi, Indonesia" },
  { countryCode: "ID", cityName: "Klaten, Indonesia" },
  { countryCode: "ID", cityName: "Kupang, Indonesia" },
  { countryCode: "ID", cityName: "Mataram, Indonesia" },
  { countryCode: "ID", cityName: "Malang, Indonesia" },
  { countryCode: "ID", cityName: "Medan, Indonesia" },
  { countryCode: "ID", cityName: "Semarang, Indonesia" },
  { countryCode: "ID", cityName: "Surabaya, Indonesia" },
  { countryCode: "ID", cityName: "Surakarta, Indonesia" },
  { countryCode: "ID", cityName: "Padang, Indonesia" },
  { countryCode: "ID", cityName: "Palembang, Indonesia" },
  { countryCode: "ID", cityName: "Pekanbaru, Indonesia" },

  { countryCode: "IQ", cityName: "Baghdad, Iraq" },

  { countryCode: "JO", cityName: "Amman, Jordan" },

  { countryCode: "KW", cityName: "Al Khiran, Kuwait" },
  { countryCode: "KW", cityName: "Jahra, Kuwait" },
  { countryCode: "KW", cityName: "Kuwait City, Kuwait" },

  { countryCode: "LB", cityName: "Beirut, Lebanon" },
  { countryCode: "LY", cityName: "Tripoli, Libya" },

  { countryCode: "MA", cityName: "Casablanca, Morocco" },
  { countryCode: "MR", cityName: "Nouakchott, Mauritania" },
  { countryCode: "MY", cityName: "Kuala Lumpur, Malaysia" },

  { countryCode: "OM", cityName: "Muscat, Oman" },
  { countryCode: "OM", cityName: "Salalah, Oman" },

  { countryCode: "PK", cityName: "Islamabad, Pakistan" },

  { countryCode: "PS", cityName: "Al Quds, Palestine" },
  { countryCode: "PS", cityName: "Gaza, Palestine" },

  { countryCode: "QA", cityName: "Al Ruwais, Qatar" },
  { countryCode: "QA", cityName: "Al Khor, Qatar" },
  { countryCode: "QA", cityName: "Ash-Shahaniyah, Qatar" },
  { countryCode: "QA", cityName: "Doha, Qatar" },
  { countryCode: "QA", cityName: "Dukhan, Qatar" },
  { countryCode: "QA", cityName: "Umm Bab, Qatar" },

  { countryCode: "SA", cityName: "Abha, Saudi Arabia" },
  { countryCode: "SA", cityName: "AlUla, Saudi Arabia" },
  { countryCode: "SA", cityName: "Al Bahah, Saudi Arabia" },
  { countryCode: "SA", cityName: "Al Hada, Saudi Arabia" },
  { countryCode: "SA", cityName: "Al Medina, Saudi Arabia" },
  { countryCode: "SA", cityName: "Ash Shafa, Saudi Arabia" },
  { countryCode: "SA", cityName: "Biljurashi, Saudi Arabia" },
  { countryCode: "SA", cityName: "Dammam, Saudi Arabia" },
  { countryCode: "SA", cityName: "Jeddah, Saudi Arabia" },
  { countryCode: "SA", cityName: "Jubail, Saudi Arabia" },
  { countryCode: "SA", cityName: "Hail, Saudi Arabia" },
  { countryCode: "SA", cityName: "Hafar Al Batin, Saudi Arabia" },
  { countryCode: "SA", cityName: "Makkah, Saudi Arabia" },
  { countryCode: "SA", cityName: "Riyadh, Saudi Arabia" },
  { countryCode: "SA", cityName: "Sakaka, Saudi Arabia" },
  { countryCode: "SA", cityName: "Taif, Saudi Arabia" },
  { countryCode: "SA", cityName: "Tabuk, Saudi Arabia" },
  { countryCode: "SA", cityName: "Yanbu, Saudi Arabia" },

  { countryCode: "SD", cityName: "Khartoum, Sudan" },
  { countryCode: "SO", cityName: "Mogadishu, Somalia" },

  { countryCode: "SY", cityName: "Aleppo, Syria" },
  { countryCode: "SY", cityName: "Damascus, Syria" },

  { countryCode: "TM", cityName: "Ashgabat, Turkmenistan" },
  { countryCode: "TN", cityName: "Tunis, Tunisia" },

  { countryCode: "TR", cityName: "Ankara, Türkiye" },
  { countryCode: "TR", cityName: "Istanbul, Türkiye" },

  { countryCode: "UZ", cityName: "Tashkent, Uzbekistan" },

  { countryCode: "YE", cityName: "Aden, Yemen" },
  { countryCode: "YE", cityName: "Al Hudaydah, Yemen" },
  { countryCode: "YE", cityName: "Al Qatan, Yemen" },
  { countryCode: "YE", cityName: "Ghayl Ba Wazir, Yemen" },
  { countryCode: "YE", cityName: "Haswayn, Yemen" },
  { countryCode: "YE", cityName: "Mukalla, Yemen" },
  { countryCode: "YE", cityName: "Sana'a, Yemen" },
  { countryCode: "YE", cityName: "Seiyun, Yemen" },
  { countryCode: "YE", cityName: "Tarim, Yemen" },
  { countryCode: "YE", cityName: "Taizz, Yemen" },
];
