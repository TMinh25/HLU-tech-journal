import { useToast } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";

export const useAppState = () => {
  const auth = useAppSelector((state) => state.auth);
  const appState = useAppSelector((state) => state.appState);
  const toast = useToast({
    variant: "subtle",
    isClosable: true,
    duration: 3000,
    position: "bottom-left",
  });

  return useMemo(() => ({ appState, auth, toast }), [appState, auth]);
};
