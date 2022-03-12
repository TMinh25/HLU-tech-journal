import {
  Avatar,
  Box,
  Center,
  CircularProgress,
  Tooltip,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function AvatarDropzone(props: any) {
  const [preview, setPreview] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      props.onFileAccepted(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    },
    [props.onFileAccepted]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
    maxFiles: 1,
    multiple: false,
  });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      <Tooltip label="Chọn để thay đổi ảnh đại diện">
        <Box borderRadius={"full"} overflow="hidden" pos="relative">
          <Avatar
            src={props.src || preview}
            size="2xl"
            cursor="pointer"
            pos="relative"
            zIndex={1}
            // border={`2px solid ${props.error ? "red" : "transparent"}`}
          />
          {props.isLoading && (
            <Center
              h="100%"
              w="100%"
              bg="blackAlpha.400"
              top={0}
              left={0}
              position={"absolute"}
              zIndex={2}
            >
              <CircularProgress isIndeterminate />
            </Center>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}
