export const attributeRegexpTemplate = (name: string, value?: string | null) => {
  if (!value) {
    return name;
  }
  return `${name}=${value}`;
};
