import { useNavigate } from "react-router-dom";

export const useReplaceNavigate = () => {
  const navigate = useNavigate();
  return (to: string) => navigate(to, { replace: true });
};
