import { AttachmentIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import IFile from "../../interface/file";

const FileDisplayButton: FC<{
  file?: IFile;
  systemFile?: File;
  onRemoveFile?: () => void;
  displayId?: boolean;
}> = ({ file, systemFile, onRemoveFile, displayId = false }) => {
  return (
    <>
      {file && (
        <LinkBox as="article">
          <Flex align="center">
            <LinkOverlay w="100%" href={`/view/${file._id}`} isExternal>
              <Button isTruncated isFullWidth>
                <HStack align="center">
                  <Icon as={AttachmentIcon} />
                  <Text>{file?.title}</Text>
                </HStack>

                <Spacer />
                {displayId && (
                  <Text
                    isTruncated
                    color={useColorModeValue("gray.600", "gray.400")}
                  >
                    {file?._id}
                  </Text>
                )}
              </Button>
            </LinkOverlay>
            {onRemoveFile && (
              <IconButton
                colorScheme={"red"}
                aria-label="remove-file"
                icon={<SmallCloseIcon />}
                size="sm"
                ml={4}
                onClick={onRemoveFile}
              />
            )}
          </Flex>
        </LinkBox>
      )}
      {systemFile && (
        <Flex width="100%" align="center">
          <Button isTruncated isFullWidth>
            <HStack align="center">
              <Icon as={AttachmentIcon} />
              <Text>{systemFile.name}</Text>
            </HStack>
            <Spacer />
          </Button>
          {onRemoveFile && (
            <IconButton
              colorScheme={"red"}
              aria-label="remove-file"
              icon={<SmallCloseIcon />}
              size="sm"
              ml={4}
              onClick={onRemoveFile}
            />
          )}
        </Flex>
      )}
    </>
  );
};
export default FileDisplayButton;
