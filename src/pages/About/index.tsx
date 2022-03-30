import {
  Box,
  useColorModeValue,
  Flex,
  HStack,
  Circle,
  Text,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { FC } from "react";
import { BigContainer } from "../../utils/components";
import { QuoteIcon } from "./components/QuoteIcon";

const About: FC = () => {
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
              GIỚI THIỆU TẠP CHÍ KHOA HỌC
            </Heading>
          </Flex>
          <Box h={20} />
          <Stack spacing={6} color={useColorModeValue("#686969", "gray.300")}>
            <Heading size="sm">
              Tạp chí Khoa Đại học Hạ Long hoạt động theo Giấy phép hoạt động
              tạp chí in số 708/GP/BTTTTngày 03 tháng 11 năm 2021 của Bộ trưởng
              Bộ Thông tin và Truyền thông và được Trung tâm thông tin Khoa học
              và Công nghệ Quốc gia, Bộ Khoa học và Công nghệ cấp mã số ISSN
              2815- 5521 năm 2021.
            </Heading>
            <Text>
              Tạp chí Khoa học Đại học Hạ Long hoạt động với tôn chỉ, mục đích
              “Định kỳ theo kỳ xuất bản để thông tin chuyên sâu, giới thiệu,
              đăng tải kết quả nghiên cứu khoa học, trao đổi kinh nghiệm đào
              tạo, nghiên cứu ứng dụng về khoa học và công nghệ phù hợp với các
              ngành đào tạo của Trường Đại học Hạ Long”, được xuất bản bằng
              tiếng Việt và tiếng Anh định kỳ 03 tháng/số.
            </Text>
            <Text>
              Tạp chí Khoa học Đại học Hạ Long là cầu nối giữa các nhà khoa học
              trong nước và quốc tế, là nơi kết nối các thông tin, sản phẩm khoa
              học và công nghệ đến các nhà hoạch định chính sách, các doanh
              nghiệp, các địa phương và bạn đọc nhằm nâng cao hiệu quả hoạt động
              khoa học và công nghệ đáp ứng nhu cầu thực tiễn đời sống và sản
              xuất, phục vụ phát triển kinh tế xã hội.
            </Text>
            <Text>
              Hội đồng biên tập Tạp chí xin gửi lời cám ơn chân thành đến các cơ
              quan quản lý báo chí, các tác giả, người phản biện, cán bộ biên
              tập và tất cả những người đã chung tay xây dựng và phát triển Tạp
              chí Khoa học Đại học Hạ Long. Chúng tôi rất mong quý vị tiếp tục
              gửi bài viết, bài trao đổi học thuật, các thảo luận khoa học mang
              tính thời sự cũng như góp ý về công tác biên tập, phản biện các
              bài báo để Tạp chí Khoa học Đại học Hạ Long ngày càng hoàn thiện,
              phát triển, trở thành tạp chí uy tín trong cộng đồng khoa học và
              được bạn đọc xa gần nhiệt tình đón đọc.
            </Text>
          </Stack>
        </Box>
      </Box>
    </BigContainer>
  );
};

export default About;
