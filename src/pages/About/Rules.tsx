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

const Rules: FC = () => {
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
              THỂ LỆ TẠP CHÍ
            </Heading>
          </Flex>
          <Box h={20} />
          <Stack spacing={6} color={useColorModeValue("#686969", "gray.300")}>
            <Heading size="md">Thể lệ tạp chí Trường Đại học Hạ Long</Heading>
            <OrderedList spacing={6}>
              <ListItem>
                <Heading size="sm">
                  Tạp chí Khoa học Đại học Hạ Long{" "}
                  <Text as="span" fontWeight={"normal"}>
                    công bố các công trình nghiên cứu, bài viết tổng quan trong
                    nhiều lĩnh vực khoa học: Khoa học xã hội, khoa học nhân văn,
                    khoa học tự nhiên, khoa học kỹ thuật và công nghệ, khoa hoc
                    nông nghiệp và các bài thông tin giới thiệu công nghệ và sản
                    phẩm nghiên cứu về các lĩnh vực nêu trên. Thể loại bài viết
                    bao gồm:
                  </Text>
                </Heading>
                <List mt={4} spacing={4}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Bài báo nghiên cứu (Original Research): Bài viết trình bày
                    những kết quả nghiên cứu mới (nghiên cứu gốc) có chất lượng
                    khoa học, hay đề xuất một phương pháp mới, ý tưởng mới hoặc
                    một giải pháp mới.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Bài tổng quan (Review): Bài viết được tổng hợp từ các nguồn
                    tư liệu thứ cấp (chủ yếu là các bài báo nghiên cứu đăng tải
                    trong các tạp chí khoa học hàn lâm) về một chủ đề cụ thể.
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Heading size="sm">
                  Tạp chí miễn phí đăng bài{" "}
                  <Text as="span" fontWeight={"normal"}>
                    đối với tất cả các bài báo của các tác giả trong và ngoài
                    Nhà trường. Bài gửi đăng có nội dung mới, chưa đăng trên các
                    sách, tạp chí khoa học khác. Mỗi bài viết được nhận đăng
                    phải qua ít nhất 2 vòng phản biện độc lập, ẩn danh, chỉnh
                    sửa ngôn ngữ tiếng Việt và tiếng Anh nghiêm ngặt.
                  </Text>
                </Heading>
              </ListItem>
              <ListItem>
                <Heading size="sm">Cấu trúc và dung lượng bài báo:</Heading>
                <List mt={4} spacing={4}>
                  <ListItem>3.1. Dung lượng bài báo từ 4000-7000 chữ.</ListItem>
                  <ListItem>
                    3.3. Cấu trúc bài báo gồm:
                    <List mt={4} spacing={4}>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="#eac71c" />
                        Tiêu đề: độ dài tiêu đề không quá 30 chữ (chữ in hoa,
                        đậm),
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="#eac71c" />
                        Tên tác giả (chữ thường, đậm), đơn vị công tác/địa chỉ
                        của tác giả (chữ thường, nghiêng);
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="#eac71c" />
                        Tóm tắt: bài viết không quá 250 chữ (chữ thường, đứng)
                        và được dịch ra tiếng Anh.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="#eac71c" />
                        Từ khóa: từ 3 – 6 từ/cụm từ (Tiếng Việt và tiếng Anh,
                        chữ in thường, nghiêng);
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color="#eac71c" />
                        Nội dung gồm các mục: 1. Đặt vấn đề/ dẫn nhập. 2. Phương
                        pháp nghiên cứu (nếu có), 3. Kết quả và thảo luận/Nội
                        dung nghiên cứu, 4. Kết luận, 5. Lời cảm ơn (nếu có),
                      </ListItem>
                    </List>
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Heading size="sm">Hình thức trình bày</Heading>
                <Text>
                  Bản thảo bài báo được đánh máy vi tính trên phần mềm MS Word,
                  định dạng khổ A4, lề trái: 3cm; lề trên, dưới, và phải: 2cm;
                  font chữ Times New Roman, cỡ chữ 11, dãn dòng đơn (single) (
                  <Link
                    href="https://docs.google.com/document/d/1T242_BzTPQKOA-CWAlFSM9WlV8FFcWk9/edit"
                    target={"_blank"}
                    color="#eac71c"
                  >
                    Xem chi tiết mẫu trình bày
                  </Link>
                  ).
                </Text>
                <List mt={4} spacing={4}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Bài báo có thể gồm các tiểu mục, nhưng không vượt quá 3 cấp
                    (trình bày tới mục ba chấm (1.1.1., 1.1.2…).
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Thuật ngữ: Thuật ngữ khoa học nếu chưa được Việt hóa thì ưu
                    tiên dùng nguyên bản tiếng Anh. Đối với thực vật, động vật
                    và vi sinh vật khi trình bày lần đầu tiên trong bài báo cần
                    kèm theo tên khoa học.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Đơn vị đo lường: Sử dụng hệ thống đơn vị đo lường quốc tế
                    đối với tất cả các số liệu.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Công thức toán học phải được soạn bằng chức năng Equation
                    của phần mềm MS. Word
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Bảng/hình: Thứ tự bảng và hình được đánh số thứ tự tăng dần
                    từ đầu đến cuối bài viết (Bảng 1, Bảng 2, Bảng 3; Hình 1,
                    Hình 2, Hình 3…). Tên Bảng được đặt ngay trên bảng, tên hình
                    đặt ngay dưới hình.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Chú thích: Đánh số thứ tự 1, 2, 3… và để ở cuối trang
                    (footnote).
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Trích dẫn và liệt kê tài liệu tham khảo theo chuẩn APA
                    (American Psychological Association), xem hướng dẫn chi tiết
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Heading size="sm">
                  Tài liệu tham khảo{" "}
                  <Text as="span" fontWeight={"normal"}>
                    (đầu mục chữ in hoa, nội dung chữ thường).
                  </Text>
                </Heading>
                <Text as="i" textDecor={"underline"}>
                  Lưu ý:
                </Text>
                <List mt={4} spacing={4}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Đối với bài báo viết bằng tiếng Anh thì phải có tiêu đề bài
                    báo; tên và địa chỉ tác giả; tóm tắt; từ khóa bằng tiếng
                    Việt.
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="#eac71c" />
                    Cuối bài ghi rõ thông tin tác giả gồm: Họ tên, học hàm, học
                    vị, chức vụ, địa chỉ cơ quan làm việc, địa chỉ liên lạc:
                    điện thoại/E-mail của tác giả/.
                  </ListItem>
                </List>
              </ListItem>
              <ListItem>
                <Heading size="sm">
                  Tác giả bài báo chịu trách nhiệm{" "}
                  <Text as="span" fontWeight={"normal"}>
                    về thông tin mình cung cấp và chấp nhận quyền biên tập, đánh
                    giá, phân loại của Ban biên tập. Bài báo được đăng, tác giả
                    được tặng 01 cuốn Tạp chí, được hưởng nhuận bút và tính giờ
                    nghiên cứu khoa học (nếu là giảng viên của Trường).
                  </Text>
                </Heading>
              </ListItem>
              <ListItem>
                <Heading size="sm">
                  Địa chỉ liên hệ:{" "}
                  <Text as="span" fontWeight={"normal"}>
                    Tạp chí Khoa học Đại học Hạ Long, 258 đường Bạch Đằng,
                    phường Nam Khê, thành phố Uông Bí, tỉnh Quảng Ninh;
                  </Text>
                </Heading>
                <Stack mt={4}>
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
              </ListItem>
            </OrderedList>
          </Stack>
        </Box>
      </Box>
    </BigContainer>
  );
};
export default Rules;
