const getTypedValue = (val, type) => {
  if (type === 'number') {
    return Number(val);
  } else {
    return val;
  }
};

const singleSort = (arr, field) => {
  arr.sort((a, b) => {
    a = getTypedValue(a[field.key], field.type);
    b = getTypedValue(b[field.key], field.type);

    if(a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  
  return arr;
};

const doubleSort = (arr, field1, field2) => {
  arr.sort((a, b) => {
    a = getTypedValue(a[field1.key], field1.type);
    b = getTypedValue(b[field1.key], field1.type);

    if(a > b) {
      return 1;
    } else if(a < b) {
      return -1;
    } else if(a === b) {
      a = getTypedValue(a[field2.key], field2.type);
      b = getTypedValue(b[field2.key], field2.type);

      if(a > b) {
        return 1;
      } else {
        return -1;
      }          
    }
  });

  return arr;
};

export { singleSort, doubleSort };
