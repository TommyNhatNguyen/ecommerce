export const filterOption = (input: string, option: any) => {
  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
};
