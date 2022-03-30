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
import { BigContainer } from "../../../utils/components";
import { AiOutlineInfoCircle } from "react-icons/ai";

const AdminJournalGroup: FC = () => {
  const journalGroups = useGetAllJournalGroupsQuery();

  return (
    <>
      <BigContainer>
        <Skeleton isLoaded={!journalGroups.isLoading}>
          <Stack spacing={6}>
            <Heading as="h2">Chuyên San</Heading>
            <Stack>
              {journalGroups.data?.length ? (
                journalGroups.data.map((jg) => (
                  <Button isFullWidth>
                    <Text>{jg.name}</Text>
                    <Spacer />
                    <IconButton
                      size="sm"
                      aria-label="journal-group-info"
                      icon={<Icon as={AiOutlineInfoCircle} />}
                    />
                  </Button>
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

export default AdminJournalGroup;
