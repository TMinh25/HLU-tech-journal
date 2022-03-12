import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../../features/article";
import { useAuth } from "../../../../hooks/useAuth";
import { CircularProgressInderterminate } from "../../../../utils/components";

export default function CompletedStage() {
  const { articleId } = useParams();
  const article = useGetArticleQuery(articleId);
  const { role } = useAuth();

  return (
    <Box textAlign="center" py={10} px={6}>
      {article.isLoading ? (
        <CircularProgressInderterminate />
      ) : (
        <>
          <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Bài báo đã xuất bản
            {article.data?.visible || " và đang chờ quản trị viên chấp thuận"}!
          </Heading>
          <Text color={"gray.500"}>
            Cảm ơn bạn đã là hỗ trợ tạp chí trong quá trình biên tập.
            <Text>Chúng tôi chân thành đánh giá cao công việc của bạn!</Text>
          </Text>
        </>
      )}
    </Box>
  );
}
