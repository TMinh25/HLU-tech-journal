import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  IconProps,
  Center,
  Image,
  Box,
} from "@chakra-ui/react";
import Logo from "../favicon.svg";
import Illustration from "../hero-image.svg";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Container maxW={"5xl"} __css={{ height: "calc(100vh - 60px)" }}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 16, md: 20 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          <Center>
            <Image src={Logo} h={100} cursor={"pointer"} />
          </Center>
          Số khoa học{" "}
          <Text as={"span"} color={"blue.400"}>
            Đại học Hạ Long
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Never miss a meeting. Never be late for one too. Keep track of your
          meetings and receive smart reminders in appropriate times. Read your
          smart “Daily Agenda” every morning.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button
            as={Link}
            to="/submission"
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            bg={"blue.400"}
            _hover={{ bg: "blue.500" }}
          >
            Nộp bản thảo
          </Button>
          <Button rounded={"full"} px={6}>
            Tìm hiểu thêm
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Image src={Illustration} cursor={"pointer"} />
        </Flex>
      </Stack>
    </Container>
  );
}
