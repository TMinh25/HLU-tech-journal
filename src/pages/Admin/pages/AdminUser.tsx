import {
  Box,
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
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useGetAllUsersQuery } from "../../../features/user";
import {
  BigContainer,
  Card,
  PopoverUserInfoAdmin,
} from "../../../utils/components";

const AdminUser: FC = () => {
  const users = useGetAllUsersQuery();

  return (
    <>
      <BigContainer>
        <Skeleton isLoaded={!users.isLoading}>
          <Stack spacing={6}>
            <Heading as="h2">Người dùng</Heading>
            <Stack>
              {users.data?.length ? (
                users.data.map((u) => (
                  <Card>
                    <Flex align="center">
                      <Flex align={"center"}>
                        <Box
                          h={2}
                          w={2}
                          mr={3}
                          borderRadius="100%"
                          bg={u.disabled ? "red.400" : "green.400"}
                        />
                        <Heading size="sm">{u.displayName}</Heading>
                      </Flex>
                      <Spacer />
                      <Text mr={4} isTruncated color="gray.500">
                        {new Date(u.createdAt).toLocaleString("vi")}
                      </Text>
                      <PopoverUserInfoAdmin user={u}>
                        <IconButton
                          size="sm"
                          aria-label="journal-info"
                          icon={<Icon as={AiOutlineInfoCircle} />}
                        />
                      </PopoverUserInfoAdmin>
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

export default AdminUser;
