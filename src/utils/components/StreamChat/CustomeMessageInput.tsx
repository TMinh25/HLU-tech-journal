import {
  Box,
  Button,
  FormControl,
  HStack,
  InputGroup,
  InputRightElement,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FileUploadButton, ImageDropzone } from "react-file-utils";
import ResizeTextarea from "react-textarea-autosize";
import {
  UploadsPreview,
  useChannelStateContext,
  useMessageInputContext,
} from "stream-chat-react";

const CustomMessageInput = () => {
  const { acceptedFiles, maxNumberOfFiles, multipleUploads } =
    useChannelStateContext();

  const messageInput = useMessageInputContext();

  return (
    <>
      <Box
        borderTopRadius={6}
        pb={4}
        px={4}
        m={0}
        pos="sticky"
        w="100%"
        color={useColorModeValue("gray.800", "white")}
        css={{ bottom: 0 }}
      >
        <ImageDropzone
          accept={acceptedFiles}
          handleFiles={messageInput.uploadNewFiles}
          multiple={multipleUploads}
          disabled={
            maxNumberOfFiles !== undefined &&
            messageInput.numberOfUploads >= maxNumberOfFiles
          }
        >
          <FormControl mt={4}>
            {messageInput.attachments && <UploadsPreview />}
            <HStack spacing={2} align="center">
              <InputGroup>
                <Textarea
                  minH="unset"
                  overflow="hidden"
                  w="100%"
                  resize="none"
                  minRows={1}
                  as={ResizeTextarea}
                  id="message"
                  bg={useColorModeValue("gray.50", "gray.700")}
                  value={messageInput.text}
                  onChange={messageInput.handleChange}
                  onSubmit={messageInput.handleSubmit}
                  rows={1}
                  placeholder="Thảo luận"
                />
                <InputRightElement width="7.5rem">
                  <HStack>
                    <Button
                      type="submit"
                      h="1.75rem"
                      size="md"
                      fontSize="sm"
                      colorScheme={"blue"}
                      onClick={messageInput.handleSubmit}
                      isDisabled={messageInput.disabled}
                    >
                      Gửi
                    </Button>
                    <Button
                      fontSize="sm"
                      h="1.75rem"
                      w="1.75rem"
                      disabled={
                        maxNumberOfFiles !== undefined &&
                        messageInput.numberOfUploads >= maxNumberOfFiles
                      }
                    >
                      <FileUploadButton
                        handleFiles={messageInput.uploadNewFiles}
                        multiple={multipleUploads}
                        disabled={
                          maxNumberOfFiles !== undefined &&
                          messageInput.numberOfUploads >= maxNumberOfFiles
                        }
                      />
                    </Button>
                  </HStack>
                </InputRightElement>
              </InputGroup>
            </HStack>
          </FormControl>
        </ImageDropzone>
      </Box>
    </>
  );
};

export default CustomMessageInput;
