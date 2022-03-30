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
  chakra,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import Logo from "../assets/HLU Real Logo.png";
import Illustration from "../hero-image.svg";
import { Link } from "react-router-dom";
import { NotificationCard } from "../utils/components";
import { useGetAllNotificationsQuery } from "../features/notification";

export default function HomePage() {
  const notifications = useGetAllNotificationsQuery();
  var message = "Hello World";
  console.log(message);

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
          Tạp chí Khoa học{" "}
          <Text as={"span"} color={"blue.400"}>
            Đại học Hạ Long
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Tạp chí Khoa Đại học Hạ Long hoạt động theo Giấy phép hoạt động tạp
          chí in số 708/GP/BTTTTngày 03 tháng 11 năm 2021 của Bộ trưởng Bộ Thông
          tin và Truyền thông và được Trung tâm thông tin Khoa học và Công nghệ
          Quốc gia, Bộ Khoa học và Công nghệ cấp mã số{" "}
          <Text as="span" color={useColorModeValue("gray.800", "white")}>
            ISSN 2815-5521
          </Text>{" "}
          năm 2021.
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
          <Button as={Link} to={"/about"} rounded={"full"} px={6}>
            Tìm hiểu thêm
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Image src={Illustration} cursor={"pointer"} />
        </Flex>
        {notifications.data?.length && (
          <Flex
            textAlign={"center"}
            pt={10}
            justifyContent={"center"}
            direction={"column"}
            width={"full"}
          >
            <Heading fontWeight={600} lineHeight={"110%"}>
              <Text as={"span"} color={"blue.400"}>
                Thông báo
              </Text>
            </Heading>
            <Center color={"gray.500"}>
              Thông báo về các số nhận bản thảo, hoặc về các nội dung cần thiết
            </Center>
            <SimpleGrid
              columns={{ base: 1, xl: 2 }}
              spacing={"20"}
              mt={16}
              mx={"auto"}
            >
              {notifications.data
                ?.slice(Math.max(notifications.data?.length - 3, 0))
                ?.map((noti) => (
                  <NotificationCard title={noti.title} content={noti.content} />
                ))}
            </SimpleGrid>
          </Flex>
        )}
      </Stack>
    </Container>
  );
}
