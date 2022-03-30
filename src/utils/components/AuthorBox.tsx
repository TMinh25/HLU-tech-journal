import {
  HStack,
  Avatar,
  VStack,
  Text,
  CloseButton,
  Box,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "./Card";

export default function AuthorBox({
  showUserId,
  author,
  showBackground,
  onRemoveAuthor,
}: {
  showUserId?: boolean;
  author: {
    _id?: string;
    displayName: string;
    email?: string;
    workPlace?: string;
    backgroundInfomation?: string;
    photoURL?: string;
  };
  onRemoveAuthor?: () => void;
  showBackground?: boolean;
}) {
  return (
    <Card
      key={author.email}
      bg={useColorModeValue("gray.100", "gray.700")}
      boxShadow={"lg"}
      p={4}
      rounded={"xl"}
    >
      <HStack justify="start" align={"start"}>
        <Avatar
          size="lg"
          name={author.displayName}
          src={author.photoURL}
          mr={2}
        />
        <VStack spacing={1} align={"start"}>
          {showUserId && (
            <Text color={useColorModeValue("gray.600", "gray.400")}>
              {author._id}
            </Text>
          )}
          <Text fontWeight={600}>{author.displayName}</Text>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            {author.email}
          </Text>
          {author.workPlace && (
            <Text>
              <span style={{ fontWeight: "500" }}>Nơi làm việc: </span>
              {author.workPlace}
            </Text>
          )}
          {author.backgroundInfomation && showBackground && (
            <Text>
              <span style={{ fontWeight: "500" }}>Lí lịch: </span>
              {author.backgroundInfomation}
            </Text>
          )}
        </VStack>
        <Spacer />
        {onRemoveAuthor && <CloseButton onClick={onRemoveAuthor} />}
      </HStack>
    </Card>
  );
}
