import { Autocomplete, Box, TextField } from "@mui/material";

export default function XAutocomplete({
  value,
  setValue,
  mt,
  data,
  id,
}: {
  value?: any;
  setValue?: any;
  mt?: number;
  data: any;
  id?: string;
}) {
  const handleChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: any
  ) => {
    setValue(value);
  };

  return (
    <Autocomplete
      id={id}
      fullWidth
      sx={{
        mt: mt ? mt : 3,
      }}
      options={data}
      size="medium"
      clearOnBlur
      inputValue={value}
      onInputChange={handleChange}
      getOptionLabel={(option: any) =>
        option?.label?.length > 0 ? option.label : option
      }
      ListboxProps={{
        sx: {
          backgroundColor: "background.default",
        },
      }}
      renderOption={(props, option: any) => (
        <Box
          component="li"
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
            bgcolor: "secondary.main",
          }}
          {...props}
        >
          {option?.label?.length > 0 ? option.label : option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            bgcolor: "secondary.main",
            borderRadius: 1,
            border: "1px solid #ced4da",
          }}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
