import {
  Alert,
  AlertIcon,
  Heading,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../features/article";
import { ReviewStatus } from "../../../types";
import { getReviewStatusType, toReviewStatusString } from "../../../utils";
import { BigContainer } from "../../../utils/components";
import StageOne from "../components/Stage1";
import StageTwo from "../components/Stage2";
import StageThree from "../components/Stage3";
import StageFour from "../components/Stage4";

const steps = ["Trả lời", "Hỗ trợ", "Đánh giá", "Hoàn tất"];

const ReviewArticleDetail: FC = (props) => {
  const { articleId, roundId } = useParams();

  const article = useGetArticleQuery(articleId);

  const getRoundIndex = (): number => {
    if (article.data?.detail?.review && roundId) {
      const roundIndex = article.data?.detail?.review?.findIndex(
        (r) => r._id === roundId
      );
      return roundIndex;
    }
    return -1;
  };

  const reviewRound = useMemo(() => {
    if (article.data?.detail?.review && roundId) {
      const roundIndex = getRoundIndex();
      return article.data?.detail?.review![roundIndex];
    }
  }, [article.data?.detail?.review]);

  const stageStepIndex = parseInt(
    localStorage.getItem(
      `review-stage-${articleId}-${getRoundIndex()}-index`
    ) || "0"
  );

  const [tabIndex, setTabIndex] = useState<number>(stageStepIndex);

  const toStage = (index: number) => {
    localStorage.setItem(
      `review-stage-${articleId}-${getRoundIndex()}-index`,
      index.toString()
    );
    setTabIndex(index);
  };

  const disabledIndex =
    reviewRound?.status === ReviewStatus.reviewing
      ? [0, 1, 2, 3]
      : reviewRound?.status === ReviewStatus.confirmed
      ? [0, 1, 3]
      : [0];

  // useEffect(() => article.refetch(), []);

  return (
    <BigContainer>
      <Skeleton isLoaded={!!articleId && !article.isLoading}>
        <Heading size="lg" mb={4}>
          Đánh giá: {article.data?.title}
        </Heading>
        <Tabs
          isLazy
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          variant="soft-rounded"
          colorScheme="green"
        >
          <TabList>
            {steps.map((step, index) => (
              <Tab
                isDisabled={!Boolean(disabledIndex.includes(index))}
                cursor={
                  !Boolean(disabledIndex.includes(index))
                    ? "not-allowed"
                    : "cursor"
                }
                key={"tab-" + index}
                mx={1}
              >
                {step}
              </Tab>
            ))}
          </TabList>
          <Alert mt={4} status={getReviewStatusType(reviewRound?.status)}>
            <AlertIcon />
            Trạng thái: {toReviewStatusString(reviewRound?.status)}
          </Alert>
          <TabPanels>
            <TabPanel>
              <StageOne {...{ toStage }} />
            </TabPanel>
            <TabPanel>
              <StageTwo {...{ toStage }} />
            </TabPanel>
            <TabPanel>
              <StageThree {...{ toStage }} />
            </TabPanel>
            <TabPanel>
              <StageFour />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Skeleton>
    </BigContainer>
  );
};

export default ReviewArticleDetail;
