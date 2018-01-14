const RAW = Symbol('raw');

export const print = val => {
  return val[RAW];
};

export const test = val => {
  return (
    val &&
    Object.prototype.hasOwnProperty.call(val, RAW) &&
    typeof val[RAW] === 'string'
  );
};

export const raw = val => {
  return { [RAW]: val };
};
