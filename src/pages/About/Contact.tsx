import {
  Box,
  Flex,
  useColorModeValue,
  Heading,
  Image,
  Center,
  Stack,
  OrderedList,
  ListItem,
  Text,
  UnorderedList,
  ListIcon,
  List,
  Link,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdCheckCircle } from "react-icons/md";
import EditorialBoardImg from "../../assets/editorial-board.png";
import { BigContainer } from "../../utils/components";
import { QuoteIcon } from "./components/QuoteIcon";

const Contact: FC = () => {
  return (
    <BigContainer>
      <Box as="section">
        <Box mx="auto" px={{ base: "6", md: "8" }} pt="12" pb="16">
          <Flex direction="column" align="center" textAlign="center">
            <QuoteIcon
              color={useColorModeValue("gray.300", "gray.600")}
              fontSize={{ base: "3xl", md: "6xl" }}
            />
            <Heading
              color="#eac71c"
              // fontSize={{ base: "xl", md: "2xl" }}
              size="lg"
              fontWeight="medium"
              mt="6"
            >
              LIÊN HỆ
            </Heading>
          </Flex>
          <Box h={20} />
          <Stack spacing={6} color={useColorModeValue("#686969", "gray.300")}>
            <Text>
              Trường Đại học Hạ Long, 258 Bạch Đằng, phường Nam Khê, TP. Uông
              Bí, tỉnh Quảng Ninh
            </Text>
            <Text>
              Email:{" "}
              <Link
                color="#eac71c"
                href="mailto:bbtkh@daihochalong.edu.vn"
                target="_blank"
              >
                bbtkh@daihochalong.edu.vn;
              </Link>
            </Text>
            <Text>Điện thoại: 0962695469; 0916099189; 0915558456</Text>
          </Stack>
        </Box>
      </Box>
    </BigContainer>
  );
};
export default Contact;
