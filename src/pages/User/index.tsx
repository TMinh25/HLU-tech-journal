import {
  Avatar,
  AvatarBadge,
  AvatarProps,
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  Wrap,
} from "@chakra-ui/react";
import { FC } from "react";
import { GoCalendar, GoGlobe, GoVerified } from "react-icons/go";
import { useParams } from "react-router-dom";
import { useGetArticleForAuthorQuery } from "../../features/article";
import { useGetUserQuery } from "../../features/user";
import { Role } from "../../types";
import { getCountryName, toRoleString } from "../../utils";
import { BigContainer, Card } from "../../utils/components";
import ArticleTable from "./components/ArticleTable";

const ProfilePage: FC = (props) => {
  const { userId } = useParams();
  const user = useGetUserQuery(userId);
  const allAuthorArticles = useGetArticleForAuthorQuery(userId);

  return (
    <BigContainer>
      <HStack justify="start" align="start" spacing={4}>
        <Card flex={1} as="section">
          <Skeleton isLoaded={!user.isLoading}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: "4", md: "10" }}
              mb={6}
            >
              <UserAvatar
                src={user.data?.photoURL}
                verified={user.data?.verified}
              />
              <CardContent>
                <CardHeader title={user.data?.displayName} />
                <Text mt="1" fontWeight="medium">
                  {toRoleString(user.data?.role)}
                </Text>
                <Stack spacing="1" mt="2">
                  {user.data?.nation && (
                    <HStack fontSize="sm">
                      <Icon as={GoGlobe} color="gray.500" />
                      <Text>{getCountryName(user.data.nation)}</Text>
                    </HStack>
                  )}
                  {user.data?.createdAt && (
                    <HStack fontSize="sm">
                      <Icon as={GoCalendar} color="gray.500" />
                      <Text>
                        Tham gia ngày -{" "}
                        {new Date(user.data.createdAt).toLocaleDateString("vi")}
                      </Text>
                    </HStack>
                  )}
                </Stack>
                {user.data?.role === Role.reviewers && (
                  <>
                    <Text fontWeight="semibold" mt="8" mb="2"></Text>
                    <Wrap shouldWrapChildren>
                      {user.data.userSetting.forReviewer.reviewField.map(
                        (field) => (
                          <Tag>{field}</Tag>
                        )
                      )}
                    </Wrap>
                  </>
                )}
              </CardContent>
            </Stack>
            <Text css={{ whiteSpace: "pre" }}>
              {user.data?.backgroundInfomation}
            </Text>
          </Skeleton>
        </Card>
        <Card flex={2}>
          <Skeleton isLoaded={!allAuthorArticles.isLoading}>
            <Heading size="md">Các bài báo đã nộp</Heading>
            <ArticleTable
              data={allAuthorArticles.data || []}
              isLoading={allAuthorArticles.isLoading}
            />
          </Skeleton>
        </Card>
      </HStack>
    </BigContainer>
  );
};

export default ProfilePage;

export const CardContent = (props: BoxProps) => <Box width="full" {...props} />;

interface CardHeaderProps extends FlexProps {
  title?: string;
  action?: React.ReactNode;
}
export const CardHeader: FC<CardHeaderProps> = (props) => {
  const { title, action, ...flexProps } = props;
  return (
    <Flex justifyContent="space-between" alignItems="center" {...flexProps}>
      <Heading
        size="md"
        fontWeight="bold"
        // letterSpacing="tight"
        marginEnd="6"
      >
        {title}
      </Heading>
      {action}
    </Flex>
  );
};

export const UserAvatar: FC<{ verified?: boolean } & AvatarProps> = (props) => {
  const { verified, ...avatarProps } = props;
  const avatarColor = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("green.500", "green.200");

  return (
    <Avatar size="2xl" {...avatarProps}>
      {verified && (
        <Tooltip label="Đã xác thực tài khoản">
          <AvatarBadge
            borderWidth="4px"
            borderColor={avatarColor}
            insetEnd="3"
            bottom="3"
            bg={avatarColor}
          >
            <Icon as={GoVerified} fontSize="2xl" color={iconColor} />
          </AvatarBadge>
        </Tooltip>
      )}
    </Avatar>
  );
};
