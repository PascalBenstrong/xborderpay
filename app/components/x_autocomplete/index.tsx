import {
    Autocomplete,
    Box,
    TextField,
  } from '@mui/material';
  
  export default function XAutocomplete(props: any) {
    let {value, setValue, mt,data} = props;
  
    return (
      <Autocomplete
          id="country-select-demo"
          fullWidth
          sx={{mt: mt ? mt : 3}}
          options={data}
          size="small"
          clearOnBlur
          inputValue={value}
          onInputChange={(event, newInputValue,reason) => {
            setValue(newInputValue);
          }}
          getOptionLabel={(option:any) => option.label}
          renderOption={(props, option:any) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0},bgcolor: "secondary.main"}} {...props}>
              
              {option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{bgcolor: "secondary.main", borderRadius: 1, border: '1px solid #ced4da'}}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
  
            }}
          />
        )}
      />
    );
  }