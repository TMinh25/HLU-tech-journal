import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Link,
  Select,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetAllJournalsQuery } from "../../../features/journal";
import {
  useGetAllJournalGroupsQuery,
  useGetJournalsInGroupQuery,
} from "../../../features/journalGroup";
import { useAuth } from "../../../hooks/useAuth";
import { NewSubmissionRequest } from "../../../interface/requestAndResponse";
import { FormControlComponent } from "../../../utils/components";

export default function StepOne({ onNextTab }: any) {
  const nextStep = 1;
  const { touched, errors, values, handleChange, handleBlur, setFieldValue } =
    useFormikContext<NewSubmissionRequest>();
  const { currentUser } = useAuth();

  const allJournalGroups = useGetAllJournalGroupsQuery();
  const allJournals = useGetJournalsInGroupQuery(values.journalGroup._id, {
    skip: !Boolean(values.journalGroup._id),
  });
  const navigate = useNavigate();

  const [statement, setStatement] = useState<boolean[]>([false, false]);
  const [copyrightAllowed, setCopyrightAllowed] = useState<boolean>(false);

  return (
    <>
      <Heading size="2xl" mb={4}>
        Bắt đầu
      </Heading>
      <Text pb={2}>
        Gặp khó khăn? Liên hệ với{" "}
        <Link
          target={"_blank"}
          href="https://www.facebook.com/sipp.minhh"
          color={"green.200"}
        >
          Nguyễn Trường Minh
        </Link>{" "}
        để được trợ giúp.
      </Text>
      <Divider my={6} />
      <Box>
        <Heading as={"h2"} pb={2} size="lg">
          Chuyên san của số
        </Heading>
        <Text>
          Lựa chọn chuyên san phù hợp cho bản thảo cần nộp (xem Chuyên mục và
          Chính sách trong trang Giới thiệu Số)
        </Text>
        <FormControl
          my={4}
          isRequired
          id="journalGroup"
          isInvalid={Boolean(touched.journalGroup && errors.journalGroup)}
        >
          <HStack>
            <FormLabel>Chuyên san</FormLabel>
            {(touched.journalGroup || errors.journalGroup) && (
              <>
                <Spacer />
                <FormErrorMessage pb={2}>
                  {errors.journalGroup}
                </FormErrorMessage>
              </>
            )}
          </HStack>
          <Select
            placeholder="Chuyên san"
            value={values.journalGroup._id}
            onChange={({ target }) => {
              setFieldValue("journalGroup", {
                _id: target.value,
                name: allJournalGroups.data?.find((j) => j._id === target.value)
                  ?.name,
              });
              setFieldValue("journalId", "");
            }}
            onBlur={handleBlur}
          >
            {allJournalGroups.data?.map((journalGroup, index) => (
              <option
                key={"journal-group-" + index}
                label={journalGroup.name}
                value={journalGroup._id}
              >
                {journalGroup.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl
          my={4}
          isRequired
          id="journalId"
          isInvalid={Boolean(
            (touched.journalId && errors.journalId) || allJournals.isError
          )}
          isDisabled={!values.journalGroup._id || allJournals.isError}
        >
          <HStack>
            <FormLabel>Số</FormLabel>
            {(touched.journalId || errors.journalId) && (
              <>
                <Spacer />
                <FormErrorMessage pb={2}>
                  {(allJournals.isError &&
                    (allJournals.error as any)?.data.error.title) ||
                    "Chuyên san này không có số nào đang xuất bản" ||
                    errors.journalId}
                </FormErrorMessage>
              </>
            )}
          </HStack>
          <Select
            placeholder="Số"
            value={values.journalId}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            {allJournals.data
              ?.filter((journal) => !journal.status)
              .map((journal, index) => (
                <option key={"journal-" + index} value={journal._id}>
                  {journal.name}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl
          my={4}
          isRequired
          id="language"
          isInvalid={Boolean(touched.language && errors.language)}
        >
          <HStack>
            <FormLabel>Ngôn ngữ</FormLabel>
            {(touched.language || errors.language) && (
              <>
                <Spacer />
                <FormErrorMessage pb={2}>{errors.language}</FormErrorMessage>
              </>
            )}
          </HStack>
          <Select
            placeholder="Ngôn ngữ"
            value={values.language}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">Tiếng Anh</option>
          </Select>
        </FormControl>
        <Divider my={6} />
        <Heading as={"h2"} pb={2} size="lg">
          Danh mục kiểm tra bài nộp
        </Heading>
        <Text>
          Thể hiện rằng bài viết đã sẵn sàng để duyệt bằng cách đánh dấu vào các
          mục dưới đây (Lời nhắn gửi BTV chính có thể được bổ sung ở phía dưới).
        </Text>
        <Stack pl={6} mt={1} spacing={1}>
          <Checkbox
            isChecked={statement[0]}
            onChange={(e) => setStatement([e.target.checked, statement[1]])}
          >
            Bài nộp chưa từng được xuất bản hoặc được gửi cho số khác.
          </Checkbox>
          <Checkbox
            isChecked={statement[1]}
            onChange={(e) => setStatement([statement[0], e.target.checked])}
          >
            File bài nộp ở định dạng OpenOffice, Microsoft Word, RTF hoặc PDF
            (nếu soạn bằng LateX).
          </Checkbox>
        </Stack>

        <Divider my={6} />
        <Heading as={"h2"} pb={2} size="lg">
          Lưu ý về bản quyền
        </Heading>
        <Text>
          Bản quyền bản thảo thuộc về Số. Mọi sự sao chép, in lại dưới mọi hình
          thức đều phải được sự đồng ý của Số.
        </Text>
        <Checkbox
          pl={6}
          isChecked={copyrightAllowed}
          onChange={(e) => setCopyrightAllowed(e.target.checked)}
        >
          Tác giả nhất trí với các điều khoản trong Thỏa thuận về Bản quyền sẽ
          được áp dụng cho bài nộp này, và khi được xuất bản trên số.
        </Checkbox>

        <Divider my={6} />
        <Heading as={"h2"} pb={2} size="lg">
          Tuyên bố về Bí mật cá nhân của Số
        </Heading>
        <Text>
          Thông tin người dùng được nhập vào hệ thống chỉ được sử dụng vào các
          mục đích đã tuyên bố rõ ràng và sẽ không được cung cấp cho bất kỳ bên
          thứ ba nào khác hay dùng vào bất kỳ mục đích nào khác.
        </Text>

        <Divider my={6} />
        <Heading as={"h2"} pb={2} size="lg">
          Lời nhắn gửi Biên Tập Viên
        </Heading>
        <FormControlComponent
          id="messageToEditor"
          placeholder="Lời nhắn"
          inputType="textarea"
          value={values.detail?.submission.messageToEditor}
          onChange={({ target }: any) =>
            setFieldValue("detail.submission.messageToEditor", target.value)
          }
        />

        <HStack my={8}>
          <Button onClick={() => navigate("/")}>Hủy</Button>
          <Tooltip
            label={
              currentUser?.verified
                ? "Tiếp theo"
                : "Bạn sẽ không thể nộp bản thảo nếu chưa xác thực tài khoản"
            }
            bg={currentUser?.verified ? "whiteAlpha.800" : "red.500"}
            shouldWrapChildren
          >
            <Button
              onClick={() => onNextTab(nextStep)}
              colorScheme="green"
              isDisabled={
                !Boolean(
                  values.journalId &&
                    values.journalGroup &&
                    values.language &&
                    statement.every((i) => i) &&
                    copyrightAllowed &&
                    currentUser?.verified
                )
              }
            >
              Tiếp theo
            </Button>
          </Tooltip>
        </HStack>
      </Box>
    </>
  );
}
