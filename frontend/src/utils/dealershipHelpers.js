export const parseDealershipValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const getDealershipName = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value !== "string") {
    return value.name || "";
  }

  try {
    return JSON.parse(value).name || "";
  } catch {
    return value;
  }
};
