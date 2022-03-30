import {
  Box,
  Container,
  Divider,
  Heading,
  Image,
  Link,
  Skeleton,
  Text,
  Wrap,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useMemo } from "react";
import { RouteProps, useNavigate } from "react-router-dom";
import {
  useGetAllJournalsQuery,
  useGetPublishedJournalsQuery,
  useGetRecentPublishedJournalsQuery,
} from "../../features/journal";
import {
  BigContainer,
  JournalWrapItem,
  TagsComponent,
} from "../../utils/components";

export default function JournalPage(props: RouteProps) {
  const navigate = useNavigate();
  const allJournals = useGetAllJournalsQuery();
  const recentPublishedJournals = useGetRecentPublishedJournalsQuery();
  const publishedJournals = useGetPublishedJournalsQuery();

  // useEffect(() => {
  //   console.log(allJournals.data);
  //   console.log(recentPublishedJournals.data);
  // console.log(featuredJournal);
  // }, [allJournals.data, recentPublishedJournals.data]);

  return (
    <BigContainer>
      {!recentPublishedJournals && <Skeleton h={200} />}
      {recentPublishedJournals && (
        <>
          <Heading
            as="h1"
            onClick={() => navigate("/journal/recent-published")}
            border="none"
            cursor="pointer"
          >
            Mới xuất bản
          </Heading>
          <Link
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
            onClick={() =>
              navigate(`/journal/${recentPublishedJournals.data?._id}`)
            }
          >
            <Box
              marginTop={{ base: "1", sm: "5" }}
              display="flex"
              flexDirection={{ base: "column", sm: "row" }}
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flex="1"
                marginRight="3"
                position="relative"
                alignItems="center"
              >
                <Box
                  width={{ base: "100%", sm: "85%" }}
                  zIndex="2"
                  marginLeft={{ base: "0", sm: "5%" }}
                  marginTop="5%"
                >
                  <Image
                    borderRadius="lg"
                    src={
                      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80"
                    }
                    alt="featured-journal"
                    objectFit="contain"
                  />
                </Box>
                <Box zIndex="1" width="100%" position="absolute" height="100%">
                  <Box
                    bgGradient={useColorModeValue(
                      "radial(yellow.600 1px, transparent 1px)",
                      "radial(yellow.300 1px, transparent 1px)"
                    )}
                    backgroundSize="20px 20px"
                    opacity="0.4"
                    height="100%"
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                flex="1"
                flexDirection="column"
                justifyContent="center"
                marginTop={{ base: "3", sm: "0" }}
              >
                <Heading marginTop="1">
                  <Link
                    textDecoration="none"
                    _hover={{ textDecoration: "none" }}
                  >
                    {recentPublishedJournals.data?.name}
                  </Link>
                </Heading>
                <TagsComponent
                  marginTop={4}
                  tags={recentPublishedJournals.data?.tags}
                />
                <Text
                  as="p"
                  marginTop="2"
                  color={useColorModeValue("gray.700", "gray.200")}
                  fontSize="lg"
                >
                  {recentPublishedJournals.data?.description}
                </Text>
                {recentPublishedJournals.data?.publishedAt && (
                  <Text mt="2" color="gray.500">
                    Ngày xuất bản -{" "}
                    {new Date(
                      recentPublishedJournals.data?.publishedAt
                    ).toLocaleString("vi")}
                  </Text>
                )}
              </Box>
            </Box>
          </Link>
          <Divider marginTop="5" />
        </>
      )}

      <Heading
        as="h2"
        marginTop="5"
        onClick={() => navigate("/journal/published")}
        border="none"
        cursor="pointer"
      >
        Đã xuất bản
      </Heading>
      <Skeleton isLoaded={!recentPublishedJournals.isLoading}>
        <Wrap spacing="16px" marginTop="5">
          {Boolean(recentPublishedJournals.data) &&
            publishedJournals.data &&
            publishedJournals.data.map((journal) => (
              <JournalWrapItem
                journal={journal}
                link={`/journal/${journal._id}`}
              />
            ))}
        </Wrap>
        {Boolean(recentPublishedJournals.data) || (
          <Text>Không có nào đã xuất bản</Text>
        )}
      </Skeleton>
      <Divider marginTop="5" />
      <Heading
        as="h2"
        marginTop="5"
        onClick={() => navigate("/journal/publishing")}
        border="none"
        cursor="pointer"
      >
        Đang xuất bản
      </Heading>
      <Skeleton isLoaded={!allJournals.isLoading}>
        <Wrap spacing="16px" marginTop="5">
          {Boolean(allJournals.data) &&
            allJournals.data?.some((j) => !j.status) &&
            allJournals.data
              .filter((j) => !j.status)
              ?.map((journal) => (
                <JournalWrapItem
                  journal={journal}
                  link={`/journal/${journal._id}`}
                />
              ))}
        </Wrap>
        {(Boolean(allJournals.data) &&
          allJournals.data?.some((j) => !j.status)) || (
          <Text>Không có số nào đang xuất bản</Text>
        )}
      </Skeleton>
      <Divider marginTop="5" />
    </BigContainer>
  );
}
