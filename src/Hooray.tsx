import { Box, Button, Center, HStack, Stack, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { signOut } from "./features/auth/authSlice";
import { useAuth } from "./hooks/useAuth";

export function Hooray() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { authenticated, currentUser } = useAuth();

  return (
    <>
      <Center h="100%">
        <Stack spacing={5}>
          <VStack>
            <p>{currentUser?.displayName}</p>
            <Box>
              {authenticated ? "Hooray you logged in!" : "Please log in!"}
            </Box>
            <Box w={100} h={100} color="primary"></Box>
          </VStack>
          <HStack spacing={6}>
            <Button onClick={() => navigate("/")}>index</Button>
            <Button onClick={() => navigate("/hooray")}>hooray</Button>
            {authenticated && (
              <Button
                onClick={() => {
                  dispatch(signOut());
                  navigate("/");
                }}
              >
                SignOut
              </Button>
            )}
          </HStack>
        </Stack>
      </Center>
    </>
  );
}
