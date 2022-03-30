import { AttachmentIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
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
import { GoPencil } from "react-icons/go";
import { Link } from "react-router-dom";
import IFile from "../../interface/file";

const FileDisplayButton: FC<
  {
    file?: IFile;
    systemFile?: File;
    onChangeFile?: () => void;
    onRemoveFile?: () => void;
    displayId?: boolean;
  } & ButtonProps
> = ({
  file,
  systemFile,
  onChangeFile,
  onRemoveFile,
  displayId = false,
  ...props
}) => {
  return (
    <>
      {file && (
        <LinkBox as="article">
          <Flex align="center">
            <LinkOverlay
              as={Link}
              w="100%"
              to={`/view/${file._id}`}
              target="_blank"
            >
              <Button isTruncated isFullWidth {...props}>
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
            {onChangeFile && (
              <IconButton
                aria-label="change-file"
                icon={<Icon as={GoPencil} />}
                size="sm"
                ml={4}
                onClick={onChangeFile}
              />
            )}
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
