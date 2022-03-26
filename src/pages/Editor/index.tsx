import { RepeatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  GridItem,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useGetAllArticlesQuery } from "../../features/article";
import Article from "../../interface/article.model";
import { ArticleStatus } from "../../types";
import { BigContainer, Card } from "../../utils/components";
import HistoryArticleTable from "./components/HistoryArticleTable";
import NewSubmissionTable from "./components/NewSubmissionTable";
import ReviewingTable from "./components/ReviewingTable";

export default function EditorPage(): JSX.Element {
  useGetAllArticlesQuery();
  return (
    <>
      <BigContainer>
        <Accordion allowMultiple allowToggle defaultIndex={[0, 1]}>
          <Stack
            spacing={8}
            //  p={12} columns={[1, null, 3]} gap={4}
          >
            {/* <GridItem colStart={3} rowStart={1} rowSpan={2} colSpan={2}>
            <Card>
              <AccordionItem border="none">
                <AccordionButton _focus={{ outline: "none" }} borderRadius={4}>
                  <Heading flex="1" textAlign="left">
                    Thông báo
                  </Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel></AccordionPanel>
              </AccordionItem>
            </Card>
          </GridItem> */}
            <NewArticleBox />
            <ReviewArticleBox />
            <HistoryArticleBox />
          </Stack>
        </Accordion>
      </BigContainer>
    </>
  );
}

function NewArticleBox(props: any) {
  const { data, isLoading, isFetching, refetch, error } =
    useGetAllArticlesQuery();
  let allArticles = useMemo(
    () =>
      Array.from<Article>(
        data?.filter((a) => a.status === ArticleStatus.submission) ?? []
      ),
    [data]
  );

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Bản thảo mới nộp</Heading>
          </AccordionButton>
          <Flex justifySelf={"flex-end"}>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <NewSubmissionTable {...{ error, isLoading }} data={allArticles} />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function ReviewArticleBox(props: any) {
  const { data, isLoading, isFetching, refetch, error } =
    useGetAllArticlesQuery();
  let allArticles = useMemo(
    () =>
      Array.from<Article>(
        data
          ?.filter(
            (a) =>
              a.status === ArticleStatus.review ||
              a.status === ArticleStatus.copyediting ||
              a.status === ArticleStatus.publishing
          )
          .reverse() ?? []
      ),
    [data]
  );

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Bản thảo đang đánh giá</Heading>
          </AccordionButton>
          <Flex justifySelf={"flex-end"}>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <ReviewingTable {...{ error, isLoading }} data={allArticles} />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function HistoryArticleBox(props: any) {
  const { data, isLoading, isFetching, refetch, error } =
    useGetAllArticlesQuery();
  let allArticles = useMemo(
    () =>
      Array.from<Article>(
        data
          ?.filter(
            (a) =>
              a.status !== ArticleStatus.review &&
              a.status !== ArticleStatus.publishing &&
              a.status !== ArticleStatus.submission
          )
          .reverse() ?? []
      ),
    [data]
  );

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Lịch sử</Heading>
          </AccordionButton>
          <Flex justifySelf={"flex-end"}>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <HistoryArticleTable {...{ error, isLoading }} data={allArticles} />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}
