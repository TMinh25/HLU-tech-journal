import {
  Avatar,
  AvatarGroup,
  BoxProps,
  Center,
  Heading,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import { NewSubmissionRequest } from "../../interface/requestAndResponse";
import { Card, FileDisplayButton, TagsComponent } from "./";

const SubmissionPreview: FC<
  {
    submission: NewSubmissionRequest;
  } & BoxProps
> = ({ submission, ...props }) => {
  // const [showMore, setShowMore] = useState(false);
  return (
    <Center py={12}>
      <Card
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        rounded={"md"}
        p={6}
        overflow={"hidden"}
        textAlign="left"
        {...props}
      >
        <Stack>
          {submission?.tags && <TagsComponent tags={submission.tags} />}
          <Text color={"gray.500"}>{submission?.journalGroup?.name}</Text>
          <Heading
            color={useColorModeValue("gray.700", "white")}
            fontSize={"2xl"}
            fontFamily={"body"}
            margin={0}
          >
            {submission?.title}
          </Heading>
          <Text
            margin={0}
            color={"gray.500"}
            // noOfLines={showMore ? undefined : 3}
          >
            {submission?.abstract}
          </Text>
        </Stack>
        <HStack mt={4} spacing={4} align={"center"}>
          <LinkBox>
            <AvatarGroup max={3}>
              <LinkOverlay href={`/user/${submission.authors.main._id}`}>
                <Avatar src={submission?.authors.main.photoURL} />
              </LinkOverlay>
              {submission?.authors?.sub?.map((author) => (
                <Avatar
                  name={author?.displayName}
                  src={(author as any).photoURL}
                />
              ))}
            </AvatarGroup>
          </LinkBox>
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>
              {submission?.authors.main.displayName}
              {Boolean(submission?.authors.sub?.length) &&
                ` và ${submission?.authors.sub?.length} người khác`}
            </Text>
          </Stack>
        </HStack>
        <Stack mt={4}>
          {Boolean(submission.detail?.submission.file) && (
            <>
              <Heading size="xs">File bản thảo</Heading>
              <Link
                href={submission.detail?.submission.file?.downloadUri}
                isExternal
              >
                <FileDisplayButton file={submission.detail?.submission.file} />
              </Link>
            </>
          )}
          {Boolean(submission.detail?.submission.helperFiles?.length) && (
            <>
              <Heading size="xs">File hỗ trợ</Heading>
              {submission.detail?.submission.helperFiles?.map((file) => (
                <Link href={file.downloadUri}>
                  <FileDisplayButton file={file} />
                </Link>
              ))}
            </>
          )}
        </Stack>
      </Card>
    </Center>
  );
};
export default SubmissionPreview;
