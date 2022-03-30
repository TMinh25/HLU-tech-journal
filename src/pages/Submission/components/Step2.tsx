import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Kbd,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { KeyboardEvent, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppState } from "../../../hooks/useAppState";
import { useAuth } from "../../../hooks/useAuth";
import { NewSubmissionRequest } from "../../../interface/requestAndResponse";
import {
  AuthorBox,
  FormControlComponent,
  TagsComponent,
} from "../../../utils/components";

const initialAuthorValue = {
  displayName: "",
  email: "",
  workPlace: "",
  backgroundInfomation: "",
};

export default function StepTwo({ onNextTab, onPrevTab }: any) {
  const prevStep = 0;
  const nextStep = 2;
  const { toast } = useAppState();
  const { values, setFieldValue, handleChange, handleBlur } =
    useFormikContext<NewSubmissionRequest>();
  const { currentUser } = useAuth();
  const newAuthorFirstInputRef = useRef<HTMLInputElement>(null);
  const [newSubAuthor, setNewSubAuthor] = useState(initialAuthorValue);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const addNewAuthor = () => {
    if (
      values.authors?.sub?.some(
        (el: any) =>
          currentUser?.email == newSubAuthor?.email ||
          el?.email == newSubAuthor?.email
      )
    ) {
      toast.closeAll();
      toast({
        status: "warning",
        title: "Email của các tác giả phải khác nhau",
      });
    } else if (!newSubAuthor.displayName || !newSubAuthor.email) {
      toast.closeAll();
      toast({
        status: "warning",
        title: "Tác giả phải có Họ tên và Email",
      });
    } else {
      const newArr = values.authors.sub || [];
      setFieldValue("authors.sub", [...newArr, newSubAuthor]);
      setNewSubAuthor(initialAuthorValue);
      newAuthorFirstInputRef.current?.focus();
    }
  };

  const removeAuthor = (index: number) => {
    if (index >= 0) {
      const newArr = values.authors.sub;
      newArr?.splice(index, 1);
      setFieldValue("authors.sub", newArr);
    }
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      Boolean(newTag) &&
      values.tags.indexOf(newTag) < 0
    ) {
      setFieldValue("tags", [...values.tags, newTag]);
      setNewTag("");
      return;
    }
  };

  const handleRemoveTag = (index: number) => {
    const newArr = [...values.tags];
    newArr.splice(index, 1);
    setFieldValue("tags", newArr);
  };

  return (
    <>
      <Heading size="2xl" mb={4}>
        Dữ liệu mô tả
      </Heading>
      <Box>
        <Heading mb={4} size="md">
          Tác giả chính
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 1, lg: 2, xl: 3 }} spacing={8}>
          <Tooltip label="Đây là bạn" aria-label="Who is this?">
            <Box>
              <AuthorBox author={{ ...currentUser! }} />
            </Box>
          </Tooltip>
        </SimpleGrid>
      </Box>
      <Divider my={6} />
      <Box>
        <Heading mb={4} size="md">
          Các tác giả khác
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 1, lg: 2, xl: 3 }} spacing={8}>
          {values.authors.sub?.map((author: any, index: number) => (
            <AuthorBox
              author={author}
              onRemoveAuthor={() => removeAuthor(index)}
            />
          ))}
        </SimpleGrid>
        <HStack mt={6} spacing={4} justify="flex-end" align="flex-end">
          <FormControl flex={1} id="displayName">
            <Input
              ref={newAuthorFirstInputRef}
              placeholder="Họ & Tên"
              name="displayName"
              value={newSubAuthor.displayName}
              onChange={({ target: { name, value } }: any) =>
                setNewSubAuthor((prev) => ({
                  ...prev,
                  [name]: value,
                }))
              }
            />
          </FormControl>
          <FormControl flex={1} id="email">
            <Input
              placeholder="Email"
              name="email"
              value={newSubAuthor.email}
              onChange={({ target: { name, value } }: any) =>
                setNewSubAuthor((prev) => ({
                  ...prev,
                  [name]: value,
                }))
              }
            />
          </FormControl>
          <FormControl flex={1} id="workPlace">
            <Input
              placeholder="Nơi làm việc"
              name="workPlace"
              value={newSubAuthor.workPlace}
              onChange={({ target: { name, value } }: any) =>
                setNewSubAuthor((prev) => ({
                  ...prev,
                  [name]: value,
                }))
              }
            />
          </FormControl>
          <FormControl flex={1} id="backgroundInfomation">
            <Input
              placeholder="Thông tin lí lịch"
              name="backgroundInfomation"
              value={newSubAuthor.backgroundInfomation}
              onChange={({ target: { name, value } }: any) =>
                setNewSubAuthor((prev) => ({
                  ...prev,
                  [name]: value,
                }))
              }
            />
          </FormControl>
          <Button onClick={addNewAuthor} colorScheme={"green"}>
            Thêm tác giả
          </Button>
        </HStack>
      </Box>
      <Divider my={6} />
      <Box>
        <Heading mb={4} size="md">
          Tiêu đề và Tóm tắt
        </Heading>
        <FormControlComponent
          id="title"
          formLabel="Tiêu đề của bài báo"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          isRequired
          helperText="Tên bản thảo sẽ được hiển thị trên số lúc xuất bản"
        />
        <FormControlComponent
          id="abstract"
          formLabel="Tóm tắt"
          value={values.abstract}
          onChange={handleChange}
          onBlur={handleBlur}
          isRequired
          inputType="textarea"
        />
      </Box>
      <Divider my={6} />
      <Box>
        <Heading mb={4} size="md">
          Chỉ mục
        </Heading>
        <FormControl id="tags">
          <FormLabel>Từ khóa</FormLabel>
          <TagsComponent
            marginTop={0}
            marginBottom={2}
            tags={values.tags}
            onRemoveTag={handleRemoveTag}
          />
          <Input
            value={newTag}
            onChange={({ target }) => setNewTag(target.value)}
            onKeyPress={handleAddTag}
          />
          <FormHelperText>
            Ấn <Kbd>Enter</Kbd> để nhập thẻ tiếp theo
          </FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <HStack my={8}>
          <Button onClick={() => navigate("/")}>Hủy</Button>
          <Button onClick={() => onPrevTab(prevStep)} colorScheme="gray">
            Quay lại
          </Button>
          <Button
            onClick={() => onNextTab(nextStep)}
            colorScheme="green"
            isDisabled={
              !Boolean(values.authors && values.title && values.abstract)
            }
          >
            Tiếp theo
          </Button>
        </HStack>
      </Box>
    </>
  );
}
