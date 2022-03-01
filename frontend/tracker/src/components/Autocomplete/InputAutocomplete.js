import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";

function InputAutocomplete({ options, getOption }) {
  return (
    <label style={{ width: "60%" }}>
      <Autocomplete
        sx={{
          display: "inline-block",
          "& input": {
            width: 264,
            color: (theme) =>
              theme.palette.getContrastText(theme.palette.background.paper),
          },
        }}
        id="custom-input-demo"
        options={options}
        onChange={(event, value) => getOption(value)}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input type="text" {...params.inputProps} required />
          </div>
        )}
        renderOption={(props, option) => (
          <div {...props} key={option.name} style={{ maxWidth: "100%" }}>
            <Typography
              noWrap
              sx={{
                color: "var(--dark-brown)",
                // fontWeight: 600,
                // marginTop: "2px",
                fontSize: "16px",
              }}
            >
              {option.name}
            </Typography>
          </div>
        )}
      />
    </label>
  );
}

export default InputAutocomplete;
