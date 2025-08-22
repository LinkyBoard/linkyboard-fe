import { clientApi } from ".";

export const createConnection = async (props: {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  topicId: string;
}) => {
  return clientApi.post("connections", props);
};

export const removeConnection = async (edgeId: string) => {
  return clientApi.delete(`connections/${edgeId}`);
};
