// check if the any of the fields are null
export const isAnyNull = (fields: any) => {
    let _anyNull = true;
  
    if (!fields) return true;
  
    for (let field of fields) {
      _anyNull =
        !field ||
        field === "" ||
        field === "null" ||
        field == null ||
        field === "undefined" ||
        field == undefined;
  
      if (_anyNull) return _anyNull;
    }
  
    return _anyNull;
  };