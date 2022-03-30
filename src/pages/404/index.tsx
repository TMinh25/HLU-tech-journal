import {
  Box, Button, Flex, Heading,
  Text, useColorModeValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex
      h={"100vh"}
      css={{ height: `calc(100vh - 60px)` }}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.300", "white.800")}
    >
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Đường dẫn không tồn tại
        </Text>
        <Text color={"gray.500"} mb={6}>
          hoặc đã hết hạn
        </Text>

        <Button
          onClick={() => navigate("/")}
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
        >
          Trang chủ
        </Button>
      </Box>
    </Flex>
  );
}
