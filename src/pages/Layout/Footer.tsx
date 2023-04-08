import {
  Container,
  Icon,
  Box,
  Stack,
  Text,
  Link,
  SimpleGrid,
  useColorModeValue,
  Flex,
  List,
  ListIcon,
  ListItem,
  Image,
} from "@chakra-ui/react";

import Logo from "../../assets/HLU Real Logo.png";
import { ReactNode } from "react";
import { GoLocation } from "react-icons/go";

const SOCIAL_LINKS = [
  {
    label: "Trường Đại học Hạ Long",
    href: "https://uhl.edu.vn/",
  },
];

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <Flex>
          <Stack align={"flex-start"} flex={2}>
            <ListHeader>Tạp chí Khoa học Đại học Hạ Long</ListHeader>
            {SOCIAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} target="_blank">
                {link.label}
              </Link>
            ))}
            <List spacing={4}>
              <ListItem>
                <ListIcon as={GoLocation} color="#eac71c" />
                Cơ sở 1: Số 258, đường Bạch Đằng, phường Nam Khê - thành phố
                Uông Bí - tỉnh Quảng Ninh
              </ListItem>
              <ListItem>
                <ListIcon as={GoLocation} color="#eac71c" />
                Cơ sở 2: Số 58 - đường Nguyễn Văn Cừ - thành phố Hạ Long - tỉnh
                Quảng Ninh
              </ListItem>
            </List>
          </Stack>
          <Stack align={"flex-start"}>
            Thông tin liên hệ:
            <Text>
              Website:{" "}
              <Link href="daihochalong.edu.vn" target="_blank">
                daihochalong.edu.vn
              </Link>
            </Text>
            <Text>
              Email:{" "}
              <Link href="mailto:tonghop@daihochalong.edu.vn" target="_blank">
                tonghop@daihochalong.edu.vn
              </Link>
            </Text>
            <Text>Điện thoại: (84 - 0203).3850304</Text>
            <Text>Fax: (84 - 0203).3852174s</Text>
          </Stack>
        </Flex>
      </Container>
      <Box pb={10}>
        <Flex
          align={"center"}
          _before={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: "1px solid",
            borderColor: useColorModeValue("gray.200", "gray.700"),
            flexGrow: 1,
            ml: 8,
          }}
        >
          <Link>
            <Image src={Logo} h={{ base: 8 }} />
          </Link>
        </Flex>
        <Text pt={6} fontSize={"sm"} textAlign={"center"}>
          Bản quyền © 2022 TẠP CHÍ KHOA HỌC ĐẠI HỌC HẠ LONG
        </Text>
      </Box>
    </Box>
  );
};

// const Footer = () => {
//   return (
//     <BigContainer
//       maxW={"8xl"}
//       as="footer"
//       role="contentinfo"
//       pb={{ base: "4", md: "8" }}
//       pt="0"
//       px="0"
//     >
//       <Box bg="#fff46e" mb={4}>
//         <Text
//           fontSize="sm"
//           color="#696969"
//           textAlign={"center"}
//           py={{ base: "2", md: "4" }}
//         >
//         </Text>
//       </Box>
//       <Stack spacing={{ base: "4", md: "5" }}>
//         <Flex>
//         </Flex>
//       </Stack>
//     </BigContainer>
//   );
// };
