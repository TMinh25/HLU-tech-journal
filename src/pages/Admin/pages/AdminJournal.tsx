import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { useGetAllJournalGroupsQuery } from "../../../features/journalGroup";
import { BigContainer, Card } from "../../../utils/components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useGetAllJournalsQuery } from "../../../features/journal";

const AdminJournal: FC = () => {
  const journals = useGetAllJournalsQuery();

  return (
    <>
      <BigContainer>
        <Skeleton isLoaded={!journals.isLoading}>
          <Stack spacing={6}>
            <Heading as="h2">Số</Heading>
            <Stack>
              {journals.data?.length ? (
                journals.data.map((j) => (
                  <Card>
                    <Flex align="center">
                      <Heading size="sm">{j.name}</Heading>
                      <Spacer />
                      <Text mr={4} isTruncated color="gray.500">
                        {new Date(j.createdBy.at).toLocaleString("vi")}
                      </Text>
                      <IconButton
                        size="sm"
                        aria-label="journal-info"
                        icon={<Icon as={AiOutlineInfoCircle} />}
                      />
                    </Flex>
                  </Card>
                ))
              ) : (
                <></>
              )}
            </Stack>
          </Stack>
        </Skeleton>
      </BigContainer>
    </>
  );
};

export default AdminJournal;
