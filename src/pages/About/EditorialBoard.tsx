import {
  Box,
  Flex,
  useColorModeValue,
  Heading,
  Image,
  Center,
} from "@chakra-ui/react";
import { FC } from "react";
import EditorialBoardImg from "../../assets/editorial-board.png";
import { BigContainer } from "../../utils/components";
import { QuoteIcon } from "./components/QuoteIcon";

const EditorialBoard: FC = () => {
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
              HỘI ĐỒNG BIÊN TẬP
            </Heading>
          </Flex>
          <Box h={20} />
          <Center>
            <Image src={EditorialBoardImg} />
          </Center>
        </Box>
      </Box>
    </BigContainer>
  );
};
export default EditorialBoard;
