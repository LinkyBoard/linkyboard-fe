import { clientApi } from ".";

export const createCategory = async (name: string) => {
  return clientApi.post("category", { name });
};
