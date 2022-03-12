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
} from "@chakra-ui/react";
import WebViewer, { Core, UI } from "@pdftron/webviewer";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    async (documentViewer: Core.DocumentViewer) => {
      try {
        const text = documentViewer.getSelectedText();
        onOpen();
        const result = await checkPlag({ text }).unwrap();
        // const newArr = [...plagChecked];
        // newArr.push({ text, data: result });
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
    // if (file.data?.downloadUri && !file.isLoading) {
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
        ],
      },
      viewerBox.current as HTMLDivElement
    )
      .then((instance) => {
        const { documentViewer } = instance.Core;
        instance.UI.setLanguage("vi");

        if (authenticated && role < Role.users) {
          instance.UI.setHeaderItems((header) => {
            header.push({
              type: "actionButton",
              img: "/view/search-para.svg",
              onClick: onOpen,
            });
            const leftPanel = header.get("leftPanelButton");
            leftPanel.insertBefore({
              type: "actionButton",
              img: "/view/favicon.svg",
              onClick: () => navigate("/"),
            });
          });

          instance.UI.textPopup.update([
            {
              type: "actionButton",
              img: "/view/favicon.svg",
              onClick: () => handleSearchPlag(documentViewer),
            },
          ]);
        } else {
          instance.UI.textPopup.update([]);
        }

        instance.UI.setTheme(
          (localStorage.getItem("chakra-ui-color-mode") ||
            "dark") as unknown as UI.Theme
        );

        documentViewer.addEventListener(
          "documentLoaded",
          () => {
            setIsLoading(false);
            console.log("document loaded");
          },
          { once: true }
        );
      })
      .catch((e) => console.error({ status: "error", title: e.message }));
    // }
  }, []);

  useEffect(() => console.log({ plagChecked }), [plagChecked]);

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
                            ["green", "yellow", "red", "purple"][
                              Math.min(Number(p?.similarityFound || 0), 3)
                            ]
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
                            ["green", "yellow", "red", "purple"][
                              Math.min(
                                Math.floor(
                                  (Number(p.similarityPercent) / 25) * 1.2
                                ),
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
