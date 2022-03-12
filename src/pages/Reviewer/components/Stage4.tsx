import { Box, Heading, Text } from "@chakra-ui/react";
import { FC, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../features/article";
import { ReviewStatus } from "../../../types";
import NotFound from "../../404";

const StageFour: FC = () => {
  const { articleId, roundId } = useParams();
  const article = useGetArticleQuery(articleId);

  useEffect(() => {
    article.refetch();
  }, []);

  let roundIndex = -1;
  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      roundIndex = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return article.data?.detail?.review![roundIndex];
    }
  }, [article.data?.detail?.review]);

  if (!roundId || !articleId || !reviewRound) return <NotFound />;

  return (
    <Box>
      {reviewRound?.status === ReviewStatus.reviewSubmitted ? (
        <>
          <Heading size="lg" mb={4}>
            Đánh giá đã được nộp
          </Heading>
          <Text>
            Cảm ơn bạn đã hoàn thành đánh giá bản thảo này. Đánh giá của bạn đã
            được nộp thành công. Chúng tôi đánh giá cao sự đóng góp của bạn đối
            với chất lượng của bài báo mà chúng tôi xuất bản. Biên tập viên có
            thể liên hệ lại với bạn nếu cần thông tin gì khác.
          </Text>
        </>
      ) : reviewRound?.status === ReviewStatus.confirmed ? (
        <>
          <Heading size="lg" mb={4}>
            Đánh giá của bạn đã được xác nhận
          </Heading>
          <Text>
            Cảm ơn bạn đã hỗ trợ chúng tôi trong quá trình đánh giá bản thảo
            này.{" "}
            <Text as="span" fontWeight={"bold"}>
              Đánh giá của bạn đã được xác nhận và gửi đến tác giả
            </Text>
          </Text>
        </>
      ) : (
        <>
          <Heading size="lg" mb={4}>
            Hoàn tất các bước trước đó
          </Heading>
          <Text>
            Cảm ơn bạn đã hỗ trợ chúng tôi trong quá trình đánh giá bản thảo
            này.{" "}
            <Text as="span" fontWeight={"bold"}>
              Vui lòng hoàn tất các bước trước để tiếp tục
            </Text>
          </Text>
        </>
      )}
    </Box>
  );
};

export default StageFour;
