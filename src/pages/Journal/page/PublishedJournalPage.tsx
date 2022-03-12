import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Heading,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetPublishedJournalsQuery } from "../../../features/journal";
import { Card, BigContainer } from "../../../utils/components";

const PublishedJournalPage: FC = (props) => {
  const journals = useGetPublishedJournalsQuery();

  useEffect(() => {
    console.log({ journals });
  }, [journals]);

  return (
    <BigContainer>
      <Skeleton isLoaded={!journals.isLoading}>
        {journals.data ? (
          <Stack spacing={6}>
            <Heading as="h2">Số cũ đã xuất bản</Heading>
            <Stack>
              {journals.data.map((j) => (
                <Link to={`/journal/${j._id}`}>
                  <Card>
                    <Flex align="center">
                      <Heading size="sm">{j.name}</Heading>
                      <Spacer />
                      <Text mr={4} isTruncated color="gray.500">
                        {new Date(j.createdBy.at).toLocaleDateString("vi")}
                      </Text>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Center h="xl">
            <Box textAlign="center">
              <InfoIcon boxSize={"50px"} color={"blue.500"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                Không có tạp chí nào đã xuất bản
              </Heading>
              <Text color={"gray.500"}>
                Cảm ơn bạn đã ghé thăm tạp chí của chúng tôi
              </Text>
            </Box>
          </Center>
        )}
      </Skeleton>
    </BigContainer>
  );
};

export default PublishedJournalPage;
