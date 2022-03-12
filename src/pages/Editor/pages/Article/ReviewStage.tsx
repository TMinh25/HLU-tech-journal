import { AddIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import "react-day-picker/style.css";
import { useParams } from "react-router-dom";
import { useGetArticleQuery } from "../../../../features/article";
import { useAuth } from "../../../../hooks/useAuth";
import { ArticleStatus, Role } from "../../../../types";
import { getReviewStatusType } from "../../../../utils";
import { NewReviewRoundModal } from "../../components/NewReviewRoundModal";
import ReviewRound from "../../components/ReviewRound";

export default function ReviewStage() {
  const { articleId } = useParams();
  const { role } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const article = useGetArticleQuery(articleId);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const review = article.data?.detail?.review;

  return (
    <>
      <Box>
        <Tabs
          isLazy
          lazyBehavior="keepMounted"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList>
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
                  Vòng {index + 1}
                </Tab>
              );
            })}
            {role === Role.editors &&
              article.data?.status === ArticleStatus.review && (
                <Tab onClick={onOpen}>
                  Vòng phản biện mới <AddIcon ml={3} />
                </Tab>
              )}
          </TabList>
          <TabPanels h={100}>
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
                  Chưa có vòng phản biện nào
                </Heading>
                <Text color={"gray.500"}>
                  Chọn tạo vòng phản biện mới và điền thông tin vào mẫu để có
                  vòng phản biện mới
                </Text>
              </Box>
            )}
            <TabPanel key={"new-review-round-tab"} mx={1} px={0}>
              <Center h={200} color="gray">
                <Box textAlign="center" py={16} px={6}>
                  <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
                  <Text color={"gray.500"} mt={16}>
                    Chọn{" "}
                    <Button as="a" color="green.400" onClick={onOpen}>
                      tạo vòng phản biện mới
                    </Button>{" "}
                    và điền thông tin vào mẫu để có vòng phản biện mới
                  </Text>
                </Box>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <NewReviewRoundModal {...{ isOpen, onClose, articleId }} />
    </>
  );
}
