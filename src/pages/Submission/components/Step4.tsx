import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useNavigate } from "react-router";
import { useNewSubmissionMutation } from "../../../features/article";
import { useAppState } from "../../../hooks/useAppState";
import { NewSubmissionRequest } from "../../../interface/requestAndResponse";
import { SubmissionPreview } from "../../../utils/components";
import SuccessModal from "./SuccessModal";

export default function StepFour({ onPrevTab }: any) {
  const prevStep = 3;
  const navigate = useNavigate();
  const { values } = useFormikContext<NewSubmissionRequest>();
  const { toast } = useAppState();
  const [newSubmissionRequest, newSubmissionRequestData] =
    useNewSubmissionMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(values);
    try {
      await newSubmissionRequest(values).unwrap();
      onOpen();
      toast({
        status: "success",
        title: "Cảm ơn bạn đã chọn số khoa học Đại học Hạ Long",
      });
    } catch (error: any) {
      toast({
        status: "error",
        title: "Không thể nộp bản thảo",
        description: error.data.message,
      });
    }
  };

  return (
    <>
      <Box>
        <Heading size="2xl" mb={4}>
          Hoàn tất nộp bản thảo
        </Heading>
        <form onSubmit={handleSubmit}>
          <Box>
            Để nộp bàn thảo cho Số Khoa học - Đại học Hạ Long, hãy{" "}
            <Link
              as="button"
              color="green.200"
              type="submit"
              onClick={handleSubmit}
            >
              xác nhận nộp bài
            </Link>
            . Tác giả chính của bài nộp sẽ nhận được một thư xác nhận qua email
            và có thể xem được tiến trình của bài nộp trong quá trình biên tập.
            Cảm ơn quý vị gửi bài viết cho Số Khoa học - Đại học Hạ Long.
          </Box>
          <SubmissionPreview w="md" submission={values} />
          <HStack my={8}>
            <Button
              isDisabled={newSubmissionRequestData.isLoading}
              onClick={() => navigate("/")}
            >
              Hủy
            </Button>
            <Button
              isDisabled={newSubmissionRequestData.isLoading}
              onClick={() => onPrevTab(prevStep)}
              colorScheme="gray"
            >
              Quay lại
            </Button>
            <Button
              colorScheme="green"
              type="submit"
              isLoading={newSubmissionRequestData.isLoading}
            >
              Xác nhận nộp bản thảo
            </Button>
          </HStack>
        </form>
      </Box>
      {newSubmissionRequestData.isSuccess && (
        <SuccessModal
          submission={newSubmissionRequestData.data}
          isOpen={isOpen}
          onClose={() => {
            onClose();
            navigate("/", { replace: true });
          }}
        />
      )}
    </>
  );
}
