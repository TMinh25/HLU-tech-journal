import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Spacer,
  Stack,
  Link as ChakraLink,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FC, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetPublishingJournalsQuery } from "../../../features/journal";
import { BigContainer, Card } from "../../../utils/components";

const PublishingJournalPage: FC = (props) => {
  const journals = useGetPublishingJournalsQuery();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log({ journals });
  }, [journals]);

  const filteredJournals = useMemo(() => {
    if (filter) {
      return journals.data?.filter(
        (j) =>
          j.name.toLowerCase().includes(filter.toLowerCase()) ||
          j.tags.includes(filter) ||
          j.journalGroup.name.toLocaleLowerCase().includes(filter.toLowerCase())
      );
    }
    return journals.data;
  }, [filter, journals.data]);

  return (
    <BigContainer>
      <Skeleton as={Box} isLoaded={!journals.isLoading}>
        {journals.data ? (
          <Stack spacing={6}>
            <Flex>
              <Heading as="h2">Số đang xuất bản</Heading>
              <Spacer />
              <Box>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaSearch} />}
                  />
                  <Input
                    w="200"
                    value={filter}
                    placeholder="Tìm kiếm"
                    onChange={({ target }) => setFilter(target.value)}
                  />
                </InputGroup>
              </Box>
            </Flex>
            <Stack>
              {filteredJournals?.length ? (
                filteredJournals?.map((j) => (
                  <LinkBox>
                    <Card>
                      <Flex align="center">
                        <LinkOverlay as={Link} to={`/journal/${j._id}`}>
                          <Heading size="sm">{j.name}</Heading>
                        </LinkOverlay>
                        <Spacer />
                        <ChakraLink
                          as={Link}
                          to={`/journal-group/${j.journalGroup._id}`}
                        >
                          {j.journalGroup.name}
                        </ChakraLink>
                        <Text mx={4} isTruncated color="gray.500">
                          {new Date(j.createdBy.at).toLocaleDateString("vi")}
                        </Text>
                      </Flex>
                    </Card>
                  </LinkBox>
                ))
              ) : (
                <Center color={"gray.500"} h={200}>
                  Không có số nào được tìm thấy
                </Center>
              )}
            </Stack>
          </Stack>
        ) : (
          <Center h="xl">
            <Box textAlign="center">
              <InfoIcon boxSize={"50px"} color={"blue.500"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                Không có số nào đang xuất bản
              </Heading>
              <Text color={"gray.500"}>
                Cảm ơn bạn đã ghé thăm số của chúng tôi
              </Text>
            </Box>
          </Center>
        )}
      </Skeleton>
    </BigContainer>
  );
};

export default PublishingJournalPage;
