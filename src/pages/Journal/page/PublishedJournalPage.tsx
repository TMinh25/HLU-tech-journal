import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  filter,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetPublishedJournalsQuery } from "../../../features/journal";
import { Card, BigContainer } from "../../../utils/components";

const PublishedJournalPage: FC = (props) => {
  const journals = useGetPublishedJournalsQuery();
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
      <Skeleton isLoaded={!journals.isLoading}>
        {journals.data ? (
          <Stack spacing={6}>
            <Flex>
              <Heading as="h2">Số cũ đã xuất bản</Heading>
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
                        <Stack>
                          <Link to={`/journal-group/${j.journalGroup._id}`}>
                            {j.journalGroup.name}
                          </Link>
                          <LinkOverlay as={Link} to={`/journal/${j._id}`}>
                            <Heading size="sm">{j.name}</Heading>
                          </LinkOverlay>
                        </Stack>
                        <Spacer />
                        <Text mr={4} isTruncated color="gray.500">
                          {new Date(j.createdBy.at).toLocaleDateString("vi")}
                        </Text>
                      </Flex>
                    </Card>
                  </LinkBox>
                ))
              ) : (
                <Center color={"gray.500"} h={200}>
                  Không có tạp chí nào được tìm thấy
                </Center>
              )}
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
