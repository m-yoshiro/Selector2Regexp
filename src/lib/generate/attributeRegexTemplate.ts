export const attributeRegexpTemplate = (name: string, value?: string) => {
  if (!value) {
    return name;
  }
  return `${name}=${value}`;
};
