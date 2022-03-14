import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetArticleQuery,
  useReviewerResponseSubmissionMutation,
} from "../../../features/article";
import { useAppState } from "../../../hooks/useAppState";
import { ReviewStatus } from "../../../types";
import NotFound from "../../404";
import ArticleDetailModal from "./ArticleDetailModal";
import { RejectSubmissionModal } from "./RejectSubmissionModal";

const StageOne: FC<{
  toStage: (stage: number) => void;
}> = ({ toStage }) => {
  const nextStage = 1;

  const { articleId, roundId } = useParams();
  const article = useGetArticleQuery(articleId);
  let roundIndex = -1;
  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      roundIndex = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return article.data?.detail?.review![roundIndex];
    }
  }, [article.data?.detail?.review]);
  const [response, responseData] = useReviewerResponseSubmissionMutation();
  const { toast } = useAppState();
  const articleDetailModal = useDisclosure();
  const rejectModal = useDisclosure();

  if (!roundId || !articleId || !reviewRound) return <NotFound />;

  const onResponse = async (
    status: string,
    reason?: string,
    notes?: string
  ) => {
    try {
      console.log(reason, notes)
      await response({
        _id: articleId,
        _roundId: roundId,
        status,
        reason,
        notes,
      }).unwrap();
      article.refetch();
      if (status === "accept") {
        toStage(nextStage);
        toast({
          status: "success",
          title: "Hãy bắt đầu đánh giá bản thảo ngay nhé!",
        });
      } else {
        rejectModal.onClose();
        toast({
          status: "success",
          title: "Cảm ơn hồi âm của bạn! Hãy chờ lần đánh giá sau nhé",
        });
      }
    } catch (error) {
      toast({
        status: "error",
        title: "Đã có lỗi xảy ra!",
      });
    }
  };

  return (
    <>
      <Tooltip
        label={
          reviewRound.status === ReviewStatus.requestRejected
            ? "Bạn đã từ chối đánh giá bản thảo này"
            : reviewRound.status === ReviewStatus.unassign
            ? "Bạn đã bị gỡ khỏi đánh giá này"
            : ""
        }
        placement="top"
      >
        <Stack spacing={4}>
          <Box>
            <Heading size="lg" mb={4}>
              Yêu cầu đánh giá
            </Heading>
            <Text>
              Bạn đã được chọn làm phản biện phù hợp cho bản thảo dưới đây. Bên
              dưới là tổng quan về bản thảo, cũng như thời gian giới hạn cho
              đánh giá. Chúng tôi hy vọng bạn có thể tham gia.
            </Text>
          </Box>
          <Heading size="md">
            Tiêu đề bản thảo:{" "}
            <Text as="span" fontWeight="normal">
              {article.data?.title}
            </Text>
          </Heading>
          <Box>
            <Heading size="md">Tóm tắt</Heading>
            <Text>{article.data?.abstract}</Text>
          </Box>
          <Box>
            <Button
              isDisabled={
                reviewRound.status === ReviewStatus.requestRejected ||
                reviewRound.status === ReviewStatus.unassign ||
                reviewRound.status === ReviewStatus.unassigned
              }
              onClick={articleDetailModal.onOpen}
            >
              Xem chi tiết bản thảo
            </Button>
          </Box>
          <Stack spacing={4}>
            <Heading size="md" mb={3}>
              Lịch trình đánh giá
            </Heading>
            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
              <FormControl isDisabled>
                <Input
                  value={new Date(
                    reviewRound.importantDates.createdAt
                  ).toLocaleDateString("vi")}
                />
                <FormHelperText>Thời gian gửi yêu cầu</FormHelperText>
              </FormControl>
              <FormControl isDisabled>
                <Input
                  value={new Date(
                    reviewRound.importantDates.responseDueDate
                  ).toLocaleDateString("vi")}
                />
                <FormHelperText>Thời gian trả lời yêu cầu</FormHelperText>
              </FormControl>
              <FormControl isDisabled>
                <Input
                  value={new Date(
                    reviewRound.importantDates.reviewDueDate
                  ).toLocaleDateString("vi")}
                />
                <FormHelperText>Thời gian hoàn thiện đánh giá</FormHelperText>
              </FormControl>
            </SimpleGrid>
            <Link variant="link">Về thời gian hoàn thiện</Link>
          </Stack>
          <HStack py={8} spacing={4} justify="end">
            {reviewRound.status === ReviewStatus.request && (
              <>
                <Button
                  onClick={rejectModal.onOpen}
                  isLoading={responseData.isLoading}
                >
                  Không chấp nhận đánh giá
                </Button>
                <Button
                  colorScheme={"green"}
                  onClick={() => onResponse("accept")}
                  isLoading={responseData.isLoading}
                >
                  Chấp nhận, sang bước tiếp theo
                </Button>
              </>
            )}
            {reviewRound.status == ReviewStatus.reviewing && (
              <Button colorScheme="green" onClick={() => toStage(nextStage)}>
                Bước tiếp theo
              </Button>
            )}
          </HStack>
        </Stack>
      </Tooltip>
      <ArticleDetailModal {...articleDetailModal} article={article.data} />
      <RejectSubmissionModal
        {...rejectModal}
        onResponse={onResponse}
        isLoading={responseData.isLoading}
      />
    </>
  );
};

export default StageOne;
