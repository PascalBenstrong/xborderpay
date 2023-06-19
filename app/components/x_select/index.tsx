import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function XSelect({ value, setValue, data, removeBorder, fullWidth, removeMargin,disabled}: any) {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ my: removeMargin ? 0 : 1, minWidth: 40 }} fullWidth={fullWidth} size="medium">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        onChange={handleChange}
        sx={{ border: removeBorder ? "none" : "1px solid lightGrey", bgcolor: "white", color: "black", py: 0 }}
        disabled={disabled}
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
              value={item?.value?.length > 0 ? item.value : item}
              sx={{
                color: "#0ca581",
                "&:hover + .Mui-selected[selected='true']": {
                  backgroundColor: "#161c23",
                },
              }}
            >
              {item?.label?.length > 0 ? item.label : item}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
