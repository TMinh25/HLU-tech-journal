import {
  Heading,
  Spacer,
  Stack,
  Text,
  Tooltip,
  WrapItem,
  WrapItemProps,
} from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Journal from "../../interface/journal.model";
import { TagsComponent } from "./";

interface IArticleWrapItem extends WrapItemProps {
  journal: Journal;
  link: string;
}

const JournalWrapItem: FC<IArticleWrapItem> = ({ journal, link }) => {
  const navigate = useNavigate();

  return (
    <WrapItem
      cursor="pointer"
      width={{ base: "100%", sm: "100%", md: "47%", lg: "30%" }}
      boxShadow={"0px 0px 4px #718096"}
      p={4}
      borderRadius={4}
      onClick={() => navigate(link)}
    >
      <Tooltip label={journal.name} openDelay={250}>
        <Stack w="100%" h="100%">
          <Heading fontSize="xl" marginTop="2">
            <Text
              textDecoration="none"
              _hover={{ textDecoration: "none" }}
              isTruncated
            >
              {journal.name}
            </Text>
            {journal.tags && (
              <TagsComponent tags={journal.tags} marginTop="3" />
            )}
          </Heading>
          <Text as="p" fontSize="md" marginTop="2" noOfLines={3}>
            {journal.description}
          </Text>
          <Spacer />
          {journal.publishedAt ? (
            <>
              <Text justifySelf={"stretch"} mt="2" color="gray.500">
                Ngày xuất bản -{" "}
                {new Date(journal.publishedAt).toLocaleString("vi")}
              </Text>
            </>
          ) : (
            <Text justifySelf={"stretch"} mt="2" color="gray.500">
              Đang xuất bản
            </Text>
          )}
        </Stack>
      </Tooltip>
    </WrapItem>
  );
};

export default JournalWrapItem;
