import { AddIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../../features/article";
import { useAuth } from "../../../../hooks/useAuth";
import { Role } from "../../../../types";
import { getReviewStatusType } from "../../../../utils";
import ReviewRound from "./ReviewRound";

export default function ReviewStage() {
  const { articleId } = useParams();
  const { role } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const article = useGetArticleQuery(articleId);

  const review = article.data?.detail?.review;

  return (
    <Stack>
      <Tabs
        isLazy
        lazyBehavior="keepMounted"
        index={tabIndex}
        onChange={(index) => setTabIndex(index)}
        defaultIndex={Number(review?.length ? review.length - 1 : 0)}
      >
        <TabList border="none">
          {review?.map((reviewRound, index) => {
            const tabColor =
              getReviewStatusType(reviewRound.status) == "error"
                ? "red.400"
                : getReviewStatusType(reviewRound.status) == "warning"
                ? "yellow.400"
                : "green.500";

            return (
              <Tab
                _selected={{ boxShadow: "outline" }}
                borderColor={tabColor}
                color={tabColor}
                ringColor={tabColor}
                borderRadius={2}
                key={"tab-" + index}
                mx={1}
              >
                Phản biện {index + 1}
              </Tab>
            );
          })}
        </TabList>
        <TabPanels>
          {review?.length ? (
            review?.map((reviewRound, index) => (
              <TabPanel key={"tab-" + index} mx={1} px={0}>
                <ReviewRound reviewRound={reviewRound} />
              </TabPanel>
            ))
          ) : (
            <Box textAlign="center" py={16} px={6}>
              <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                Chưa có đánh giá nào
              </Heading>
            </Box>
          )}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
