import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useGetAllNotificationsQuery } from "../../features/notification";
import { BigContainer, NotificationCard } from "../../utils/components";

const Notifications: FC = () => {
  const notifications = useGetAllNotificationsQuery();

  return (
    <BigContainer maxW="5xl">
      <Heading size="lg" pb={6}>
        Thông Báo
      </Heading>
      <Skeleton isLoaded={notifications.isSuccess || notifications.isError}>
        <Box>
          {Boolean(notifications.data?.length) ? (
            notifications.data?.map((noti) => <NotificationCard {...noti} />)
          ) : (
            <Text textAlign="center" color="gray">
              Không có thông báo nào!
            </Text>
          )}
        </Box>
      </Skeleton>
    </BigContainer>
  );
};

export default Notifications;
