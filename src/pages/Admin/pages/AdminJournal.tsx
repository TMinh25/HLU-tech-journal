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
<<<<<<< HEAD
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useGetAllJournalsQuery } from "../../../features/journal";
import { BigContainer, Card } from "../../../utils/components";
=======
import { useGetAllJournalGroupsQuery } from "../../../features/journalGroup";
import { BigContainer, Card } from "../../../utils/components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useGetAllJournalsQuery } from "../../../features/journal";
>>>>>>> 165182b955d19798f8d3fd92cb4876eb916f0780

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
<<<<<<< HEAD
              <Button>Thêm bài báo</Button>
=======
>>>>>>> 165182b955d19798f8d3fd92cb4876eb916f0780
            </Stack>
          </Stack>
        </Skeleton>
      </BigContainer>
    </>
  );
};

export default AdminJournal;
