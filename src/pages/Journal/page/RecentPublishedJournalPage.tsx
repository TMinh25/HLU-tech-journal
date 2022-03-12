import { Box, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useGetRecentPublishedJournalsQuery } from "../../../features/journal";
import { BigContainer } from "../../../utils/components";

const RecentPublishedJournalPage: FC = (props) => {
  const journal = useGetRecentPublishedJournalsQuery();

  return (
    <BigContainer>
      <Skeleton isLoaded={!journal.isLoading}>
        {journal.data ? (
          <Navigate to={`/journal/${journal.data._id}`} />
        ) : (
          <Box>Không có tạp chí mới xuất bản</Box>
        )}
      </Skeleton>
    </BigContainer>
  );
};

export default RecentPublishedJournalPage;
