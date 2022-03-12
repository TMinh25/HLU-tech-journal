import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);

  return useMemo(() => auth, [auth]);
};
