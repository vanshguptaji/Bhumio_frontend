export const toSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toSnakeCaseObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) return obj.map((item) => toSnakeCaseObject(item));

  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    // Skip undefined values to avoid sending empty fields that may trigger 400
    if (typeof val === 'undefined') return acc;

    const newKey = toSnakeCase(key);

    if (val && typeof val === 'object') {
      acc[newKey] = toSnakeCaseObject(val);
    } else {
      acc[newKey] = val;
    }

    return acc;
  }, {});
};

// Remove empty strings, nulls, and NaN values from an object recursively
export const cleanPayload = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj
      .map((item) => cleanPayload(item))
      .filter((item) => item !== undefined && item !== null && !(typeof item === 'number' && isNaN(item)));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    if (val === '' || val === null || (typeof val === 'number' && isNaN(val))) return acc;
    if (typeof val === 'object') {
      const cleaned = cleanPayload(val);
      if (cleaned !== undefined && cleaned !== null && !(typeof cleaned === 'number' && isNaN(cleaned))) {
        acc[key] = cleaned;
      }
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
};
