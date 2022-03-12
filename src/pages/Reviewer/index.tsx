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
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useGetArticleForReviewerQuery } from "../../features/article";
import Article from "../../interface/article.model";
import { Card } from "../../utils/components";
import AssignedReviewTable from "./components/AssignedReviewTable";
import ReviewingArticleTable from "./components/ReviewingArticleTable";
import ArchiveArticleTable from "./components/ArchiveArticleTable";

export default function ReviewerPage(props: any) {
  const { refetch } = useGetArticleForReviewerQuery();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Accordion p={12} allowMultiple allowToggle defaultIndex={[0, 1]}>
        <SimpleGrid h="100%" columns={[1, null, 3]} gap={4}>
          <GridItem rowStart={0} rowSpan={2} colSpan={1}>
            <AssignedArticleBox />
          </GridItem>
          {/* <GridItem rowSpan={1} colSpan={2}>
            aksjdn
          </GridItem> */}
          <GridItem colStart={2} rowSpan={1} colSpan={2}>
            <ReviewingArticleBox />
          </GridItem>
          <GridItem colStart={2} rowSpan={1} colSpan={2}>
            <ReviewSubmittedBox />
          </GridItem>
        </SimpleGrid>
      </Accordion>
    </>
  );
}

function AssignedArticleBox() {
  const { data, isLoading, isFetching, refetch, error } =
    useGetArticleForReviewerQuery();

  let allArticles = useMemo(() => Array.from<Article>(data ?? []), [data]);

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Cần đánh giá</Heading>
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
          <AssignedReviewTable
            {...{ error, isLoading, isFetching }}
            data={allArticles}
          />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function ReviewingArticleBox() {
  const { data, isLoading, isFetching, refetch, error } =
    useGetArticleForReviewerQuery();

  let allArticles = useMemo(() => Array.from<Article>(data ?? []), [data]);

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Đang đánh giá</Heading>
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
          <ReviewingArticleTable
            {...{ error, isLoading, isFetching }}
            data={allArticles}
          />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function ReviewSubmittedBox() {
  const { data, isLoading, isFetching, refetch, error } =
    useGetArticleForReviewerQuery();

  let allArticles = useMemo(() => Array.from<Article>(data ?? []), [data]);

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
          <ArchiveArticleTable
            {...{ error, isLoading, isFetching }}
            data={allArticles}
          />
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}
