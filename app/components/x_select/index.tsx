import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function XSelect({ value, setValue, data }: any) {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ my: 1, minWidth: 120 }} fullWidth size="medium">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        onChange={handleChange}
        sx={{ border: "1px solid lightGrey", py: 0 }}
        inputProps={{
            MenuProps: {
                MenuListProps: {
                    sx: {
                        backgroundColor: 'background.default'
                    }
                }
            }
        }}
      >
        {data &&
          data.map((item: any, index: number) => (
            <MenuItem
              key={index}
              value={item.value}
              sx={{
                color: "#0ca581",
                "&:hover + .Mui-selected[selected='true']": {
                  backgroundColor: "#161c23",
                },
              }}
            >
              {item.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
