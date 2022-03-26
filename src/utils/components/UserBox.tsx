import { Flex, Box, Tag, Text, Avatar } from "@chakra-ui/react";
import Card from "./Card";

const UserBox = ({ author, role }: any) => (
  <Card>
    <Flex align="center">
      <Box pr={4} pl={2}>
        <Avatar size="lg" src={author.photoURL} />
      </Box>
      <Box>
        <Text fontWeight="bold">{author.displayName}</Text>
        <Text>{author.email}</Text>
        <Tag>{role}</Tag>
      </Box>
    </Flex>
  </Card>
);

export default UserBox;
