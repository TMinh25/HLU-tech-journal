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
import { useGetPublishingJournalsQuery } from "../../../features/journal";
import { BigContainer, Card } from "../../../utils/components";

const PublishingJournalPage: FC = (props) => {
  const journals = useGetPublishingJournalsQuery();

  useEffect(() => {
    console.log({ journals });
  }, [journals]);

  return (
    <BigContainer>
      <Skeleton as={Box} isLoaded={!journals.isLoading}>
        {journals.data ? (
          <Stack spacing={6}>
            <Heading as="h2">Số đang xuất bản</Heading>
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
                Không có tạp chí nào đang xuất bản
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

export default PublishingJournalPage;
