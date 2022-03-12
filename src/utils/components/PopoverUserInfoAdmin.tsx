import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { useGetAllUsersQuery } from "../../features/user";
import { toRoleString } from "../../utils";
import { useToggleDisableUserMutation } from "../../features/user";
import { useNavigate } from "react-router-dom";
import User from "../../interface/user.model";
import { Role } from "../../types";

const PopoverUserInfoAdmin: FC<{ user: User }> = ({ user, children }) => {
  const navigate = useNavigate();
  const users = useGetAllUsersQuery();
  const [toggleDisableUser, toggleDisableUserData] =
    useToggleDisableUserMutation();

  const toggleDisabled = async (id: string) => {
    await toggleDisableUser(id);
    users.refetch();
  };

  return (
    <Popover isLazy placement="top-end" size={"lg"}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader fontWeight={"bold"}>{user.aliases}</PopoverHeader>
        <PopoverBody>
          <Flex align={"center"} mb={4}>
            <Avatar src={user.photoURL} mr={2} />
            <Text fontWeight={"bold"}>{user.displayName}</Text>
          </Flex>
          <List>
            <ListItem>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Tài khoản:{" "}
              </span>
              {user.username}
            </ListItem>
            <ListItem>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Email:{" "}
              </span>
              {user.email}
            </ListItem>
            <ListItem>
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Hạng:{" "}
              </span>
              {toRoleString(user.role)}
            </ListItem>
            {user.degree && (
              <ListItem>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Bằng cấp:{" "}
                </span>
                {user.degree}
              </ListItem>
            )}
            {user.backgroundInfomation && (
              <ListItem>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Thông tin cá nhân:{" "}
                </span>
                {user.backgroundInfomation}
              </ListItem>
            )}
          </List>
        </PopoverBody>
        <PopoverFooter>
          <Flex>
            <Button onClick={() => navigate("/user/" + user._id)} mr={2}>
              Trang cá nhân
            </Button>
            {user.role !== Role.admin && (
              <Button
                onClick={() => toggleDisabled(user._id)}
                isLoading={toggleDisableUserData.isLoading}
                colorScheme={user.disabled ? "green" : "red"}
              >
                {user.disabled ? "Cho phép hoạt động" : "Vô hiệu hóa"}
              </Button>
            )}
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
export default PopoverUserInfoAdmin;
