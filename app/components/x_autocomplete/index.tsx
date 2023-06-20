import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";

export default function XAutocomplete({
  value,
  setValue,
  mt,
  data,
  id,
  freeSolo
}: {
  value?: any;
  setValue?: any;
  mt?: number;
  data: any;
  id?: string;
  freeSolo?: boolean;
}) {
  const handleChange = (
    event: any,
    value: string,
    reason: any
  ) => {
    console.log("selected: ", value);
    setValue(value);
  };

  return (
    <Autocomplete
      id={id}
      freeSolo={freeSolo}
      fullWidth
      sx={{
        mt: mt ? mt : 3,
      }}
      options={data}
      size="medium"
      inputValue={value}
      defaultValue={value}
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
        <MenuItem
          value={option?.value?.length > 0 ? option.value : option}
          sx={{
            color: "#0ca581",
            "&:hover + .Mui-selected[selected='true']": {
              backgroundColor: "#161c23",
            },
          }}
          {...props}
        >
          {option?.label?.length > 0 ? option.label : option}
        </MenuItem>
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
          }}
        />
      )}
    />
  );
}
