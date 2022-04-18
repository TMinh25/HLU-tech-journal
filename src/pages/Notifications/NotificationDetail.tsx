import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { useGetNotificationQuery } from "../../features/notification";
import { BigContainer } from "../../utils/components";

const NotificationDetail: FC = () => {
  const { _id } = useParams();
  const notification = useGetNotificationQuery(_id);

  if (notification.isError) {
    return (
      <BigContainer maxW="5xl">
        <Box textAlign="center" py={10} px={6}>
          <Box display="inline-block">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg={"red.500"}
              rounded={"50px"}
              w={"55px"}
              h={"55px"}
              textAlign="center"
            >
              <CloseIcon boxSize={"20px"} color={"white"} />
            </Flex>
          </Box>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            {(notification.error as any).data.message}
          </Heading>
        </Box>
      </BigContainer>
    );
  }
  return (
    <BigContainer maxW="5xl">
      <Heading size="lg" pb={6}>
        🔔 {notification.data?.title}
      </Heading>
      <Skeleton isLoaded={notification.isSuccess || notification.isError}>
        <Text>{notification.data?.detail}</Text>
      </Skeleton>
    </BigContainer>
  );
};

export default NotificationDetail;
