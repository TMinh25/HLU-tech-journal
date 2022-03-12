import { Box, Text } from "@chakra-ui/react";
import { useMemo } from "react";

export default function Home(props: any) {
  const { a } = props;

  const TextA = useMemo(() => <Text>{a}</Text>, [a]);

  return <Box>{TextA}</Box>;
}
