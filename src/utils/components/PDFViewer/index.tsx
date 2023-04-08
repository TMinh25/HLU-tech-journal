import { CloseIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Heading,
  Link,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import WebViewer from "@pdftron/webviewer";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-day-picker";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Card, CircularProgressInderterminate, BigContainer } from "../";
import { useGetFileQuery } from "../../../features/fileUpload";
import { usePlagiarismCheckMutation } from "../../../features/plagiarismCheck";
import { useAppState } from "../../../hooks/useAppState";
import { useAuth } from "../../../hooks/useAuth";
import PlagiarismModel from "../../../interface/plagiarism";
import { Role } from "../../../types";

const PDFViewer: FC = (props) => {
  const viewerBox = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fileId } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkPlag, checkPlagData] = usePlagiarismCheckMutation();
  const [plagChecked, setPlagChecked] = useState<
    { text: string; data: PlagiarismModel[] }[]
  >([]);
  const { role, authenticated } = useAuth();
  const { toast } = useAppState();
  const file = useGetFileQuery(fileId);

  const handleSearchPlag = useCallback(
    async (documentViewer) => {
      try {
        const text = documentViewer.getSelectedText();
        onOpen();
        const result = await checkPlag({ text }).unwrap();
        const newPlagChecked = [...plagChecked, { text, data: result }];
        setPlagChecked(newPlagChecked);
        toast({
          duration: 60000,
          status: "success",
          title: "Kiểm tra đạo văn",
          description: "Hoàn tất kiểm tra đạo văn",
        });
      } catch (error: any) {
        toast({
          duration: 60000,
          status: "error",
          title: "Kiểm tra đạo văn",
          description: error.data.message,
        });
      }
    },
    [plagChecked]
  );

  useEffect(() => {
    setIsLoading(true);
    if (file.data?.downloadUri && !file.isLoading) {
      WebViewer(
        {
          path: "pdftron",
          initialDoc: file.data?.downloadUri,
          css: "pdftron/styles/index.css",
          disableLogs: true,
          disabledElements: [
            "ribbons",
            "toolsHeader",
            "toggleNotesButton",
            "viewControlsButton",
            "contextMenuPopup",
            "zoomOutButton",
            "zoomInButton",
            "selectToolButton",
            "panToolButton",
            "printButton",
            "downloadButton",
            "menuButton",
          ],
        },
        viewerBox.current as HTMLDivElement
      )
        .then((instance: any) => {
          const { documentViewer } = instance.Core;
          instance.UI.setLanguage("vi");

          instance.UI.setHeaderItems(function (header: any) {
            if (authenticated && role < Role.users) {
              const leftPanel = header.get("leftPanelButton");
              leftPanel.insertBefore({
                type: "actionButton",
                img: "/view/favicon.svg",
                onClick: () => navigate("/"),
              });
              const searchButton = header.get("searchButton");
              searchButton.insertBefore({
                type: "actionButton",
                img: "/view/download.svg",
                onClick: () =>
                  file.data?.downloadUri &&
                  window.open(file.data?.downloadUri, "_blank")?.focus(),
              });
              searchButton.insertBefore({
                type: "customElement",
                render: () => <h2>{file.data?.title}</h2>,
              });
              header.push({
                type: "actionButton",
                img: "/view/search-para.svg",
                onClick: onOpen,
              });
              instance.UI.textPopup.update([
                {
                  type: "actionButton",
                  img: "/view/search-para.svg",
                  onClick: () => handleSearchPlag(documentViewer),
                },
              ]);
            } else {
              instance.UI.textPopup.update([]);
            }
          });

          documentViewer.addEventListener(
            "documentLoaded",
            () => {
              setIsLoading(false);
              console.log("document loaded");
            },
            { once: true }
          );
        })
        .catch((e: any) =>
          console.error({ status: "error", title: e.message })
        );
    }
  }, []);

  useEffect(() => console.log({ plagChecked }), [plagChecked]);

  if (file.isError || !file.data) {
    return (
      <BigContainer>
        <Box textAlign="center" py={10} px={6}>
          <Box display="inline-block">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              bg={"red.500"}
              rounded={"50px"}
              w={"55px"}
              h={"55px"}
              textAlign="center"
            >
              <CloseIcon boxSize={"20px"} color={"white"} />
            </Flex>
          </Box>
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Đã có lỗi xảy ra
          </Heading>
          <Text color={"gray.500"}>{file.error as any}</Text>
        </Box>
      </BigContainer>
    );
  }

  return (
    <BigContainer p={0} maxW="full">
      {isLoading && <Skeleton isLoaded={!isLoading}></Skeleton>}
      <Box h="100vh" ref={viewerBox} />
      {authenticated && role < Role.users && (
        <Drawer
          portalProps={{
            appendToParentPortal: true,
            containerRef: viewerBox,
          }}
          size="md"
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          blockScrollOnMount={false}
          trapFocus={false}
        >
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Kiểm tra đạo văn</DrawerHeader>
            <DrawerBody overflowY="scroll" fontSize="sm">
              {checkPlagData.isLoading && <CircularProgressInderterminate />}
              <Accordion allowToggle>
                {plagChecked.reverse().map((plag, pIndex) => (
                  <PlagAccordionItem plag={plag} key={`plag-${pIndex}`} />
                ))}
              </Accordion>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </BigContainer>
  );
};

export default PDFViewer;

const PlagAccordionItem: FC<{
  plag: { text: string; data: PlagiarismModel[] };
}> = ({ plag }) => {
  return (
    <AccordionItem>
      <AccordionButton borderRadius={4} textAlign="start" fontSize="sm">
        {plag.text && (
          <Tooltip label={plag.text}>
            <Collapse startingHeight={105} in={false}>
              {plag.text}
            </Collapse>
          </Tooltip>
        )}
      </AccordionButton>
      <AccordionPanel>
        <Stack>
          {plag.data.length &&
            plag.data.map((p, index) => (
              <Card key={`plag-data-${index}`}>
                <Link href={p?.url} target="_blank">
                  <Stack>
                    <Heading size="xs">{p.title}</Heading>
                    <Text>{p.description}</Text>
                    <Flex>
                      <Heading size="xs" flex={1}>
                        Đoạn văn giống nhau:{" "}
                        <Text
                          as="span"
                          color={
                            [
                              useColorModeValue("black", "white"),
                              useColorModeValue("green.600", "green.400"),
                              useColorModeValue("yellow.600", "yellow.400"),
                              useColorModeValue("red.600", "red.400"),
                            ][Math.min(Number(p?.similarityFound || 0), 3)]
                          }
                        >
                          {p.similarityFound}
                        </Text>
                      </Heading>
                      <Heading size="xs" flex={1}>
                        Giống nhau:{" "}
                        <Text
                          as="span"
                          color={
                            [
                              useColorModeValue("black", "white"),
                              useColorModeValue("green.600", "green.400"),
                              useColorModeValue("yellow.600", "yellow.400"),
                              useColorModeValue("red.600", "red.400"),
                            ][
                              Math.min(
                                Math.floor(Number(p.similarityPercent) / 25),
                                3
                              )
                            ]
                          }
                        >
                          {p.similarityPercent}%
                        </Text>
                      </Heading>
                    </Flex>
                  </Stack>
                </Link>
              </Card>
            ))}
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};
