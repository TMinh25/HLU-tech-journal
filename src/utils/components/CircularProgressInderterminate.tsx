import { Center, CircularProgress } from "@chakra-ui/react";

export default function CircularProgressInderterminate(): JSX.Element {
  return (
    // TODO: quay logo đhhl
    <Center h="100vh">
      <CircularProgress
        isIndeterminate
        color="blue.500"
        trackColor="gray.600"
      />
    </Center>
  );
}
