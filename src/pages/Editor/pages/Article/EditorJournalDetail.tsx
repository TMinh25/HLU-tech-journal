import { HamburgerIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarGroup,
  Button,
  Center,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  Text,
  toast,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { FC, memo, useCallback, useMemo, useRef, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineAdd, MdOutlineArticle } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllArticlesQuery,
  useToggleVisibleMutation,
} from "../../../../features/article";
import {
  useAddArticleToJournalMutation,
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
  usePublishedJournalMutation,
  useRemoveArticleToJournalMutation,
} from "../../../../features/journal";
import { ArticleStatus } from "../../../../types";
import { getArticleStatusType, toArticleStatusString } from "../../../../utils";
import { AuthorBox, BigContainer, Card } from "../../../../utils/components";
import Article from "../../../../interface/article.model";
import { useAppState } from "../../../../hooks/useAppState";
import React from "react";

const EditorJournalDetail = (props: any) => {
  const { journalId } = useParams();
  const journal = useGetJournalByIdQuery(journalId);
  const journalsArticles = useGetArticleOfJournalQuery(journalId);
  const [toggleVisible, toggleVisibleData] = useToggleVisibleMutation();
  const cancelRef = useRef(null);
  const sureToToggle = useDisclosure();
  const { toast } = useAppState();

  const handleToggleVisibleArticle = async (_id: string) => {
    await toggleVisible(_id).unwrap();
    journalsArticles.refetch();
    sureToToggle.onClose();
  };

  const [publishedJournal, publishedJournalData] =
    usePublishedJournalMutation();

  const handlePublishedJournal = async () => {
    if (journal.data && !journal.data?.status) {
      try {
        await publishedJournal(journal.data?._id).unwrap();
        journal.refetch();
      } catch (error) {
        toast({ status: "success", title: "C???p nh???t th??nh c??ng" });
      }
    }
  };
  const addArticleModal = useDisclosure();

  return (
    <>
      <BigContainer>
        <Skeleton
          h={400}
          isLoaded={!journal.isLoading || !journalsArticles.isLoading}
        >
          <Stack>
            <Heading size="lg">{journal.data?.name}</Heading>
            <Divider />
            <Editable defaultValue={journal.data?.description}>
              <EditablePreview />
              <EditableInput />
            </Editable>
            {!journal.data?.status ? (
              <Button
                colorScheme={"green"}
                onClick={handlePublishedJournal}
                isLoading={publishedJournalData.isLoading}
              >
                Xu???t b???n s???
              </Button>
            ) : (
              <Center color="gray.500">???? xu???t b???n</Center>
            )}
            <Card>
              <Heading size="md" mb={4}>
                Danh s??ch b??i b??o
              </Heading>
              {journalsArticles.data && (
                <Stack>
                  {!journal.data?.status && (
                    <>
                      <Button onClick={addArticleModal.onOpen}>
                        Th??m b??i b??o
                      </Button>
                      <AddArticleModal
                        {...addArticleModal}
                        refetch={journalsArticles.refetch}
                        journalId={journal.data?._id}
                      />
                    </>
                  )}
                  {/* Sort for visible article first */}
                  {journalsArticles.data.length ? (
                    <>
                      {journalsArticles.data.map((article, index) => (
                        <>
                          <AdminArticleCard
                            key={`admin-card-${index}`}
                            journalId={journalId}
                            isLoading={
                              journalsArticles.isLoading ||
                              toggleVisibleData.isLoading
                            }
                            {...{
                              handleToggleVisibleArticle,
                              sureToToggle,
                              article,
                            }}
                          />
                          {article.status !== ArticleStatus.completed && (
                            <AlertDialog
                              leastDestructiveRef={cancelRef}
                              onClose={sureToToggle.onClose}
                              isOpen={sureToToggle.isOpen}
                              isCentered
                            >
                              <AlertDialogOverlay />

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  X??c nh???n thao t??c?
                                </AlertDialogHeader>
                                <AlertDialogCloseButton />
                                <AlertDialogBody>
                                  B??i b??o v???n ??ang trong qu?? tr??nh ph???n bi???n.
                                  B???n c?? ch???c ch???n?
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                  <Button
                                    ref={cancelRef}
                                    onClick={sureToToggle.onClose}
                                  >
                                    H???y
                                  </Button>
                                  <Button
                                    colorScheme="green"
                                    ml={3}
                                    onClick={() =>
                                      handleToggleVisibleArticle(article._id)
                                    }
                                  >
                                    Ch???c ch???n
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </>
                      ))}
                    </>
                  ) : (
                    <Center color={useColorModeValue("gray.600", "gray.400")}>
                      Ch??a c?? b??i b??o n??o ???????c ph??n v??o s??? n??y
                    </Center>
                  )}
                </Stack>
              )}
            </Card>
          </Stack>
        </Skeleton>
        {/* <Text css={{ whiteSpace: "pre-line" }}>
          {JSON.stringify(journal?.data)}
        </Text> */}
      </BigContainer>
    </>
  );
};

export default EditorJournalDetail;

const AdminArticleCard: FC<{
  article: Article;
  sureToToggle: UseDisclosureReturn;
  handleToggleVisibleArticle: (_id: string) => Promise<void>;
  isLoading: boolean;
  journalId?: string;
}> = ({
  sureToToggle,
  handleToggleVisibleArticle,
  isLoading,
  article,
  journalId,
}) => {
  const navigate = useNavigate();
  const { data } = useGetJournalByIdQuery(journalId);
  const { refetch } = useGetArticleOfJournalQuery(journalId);

  const [removeArticle, removeArticleData] =
    useRemoveArticleToJournalMutation();

  const handleRemoveArticleFromJournal = async () => {
    try {
      await removeArticle({ articleId: article._id, journalId }).unwrap();
      refetch();
    } catch (error) {}
  };
  return (
    <Card isTruncated>
      <HStack>
        <Stack w="70%">
          <HStack>
            <Icon as={MdOutlineArticle} />
            <Tooltip label={article.title}>
              <Text isTruncated>{article.title}</Text>
            </Tooltip>
            <Text color="gray.500">{article._id}</Text>
          </HStack>
          <HStack>
            <Tag
              colorScheme={
                getArticleStatusType(article.status) === "error"
                  ? "red"
                  : getArticleStatusType(article.status) === "warning"
                  ? "yellow"
                  : "green"
              }
            >
              {toArticleStatusString(article.status)}
            </Tag>
            <Tag colorScheme={article.visible ? "green" : "red"}>
              {article.visible ? "???????c hi???n th???" : "Kh??ng ???????c hi???n th???"}
            </Tag>
          </HStack>
        </Stack>
        <Spacer />
        <AvatarGroup>
          <Avatar
            name={article.authors.main.displayName}
            src={article.authors.main.photoURL}
          />
          {article.authors.sub?.map((editor) => (
            <Avatar name={editor.displayName} />
          ))}
        </AvatarGroup>
        <IconButton
          aria-label="toggle visible article"
          icon={
            <Icon as={article.visible ? AiOutlineEyeInvisible : AiOutlineEye} />
          }
          variant="outline"
          onClick={() => {
            if (article.status !== ArticleStatus.completed)
              sureToToggle.onOpen();
            else handleToggleVisibleArticle(article._id);
          }}
          isLoading={isLoading}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            isLoading={isLoading}
          />
          <MenuList>
            <MenuItem
              icon={<Icon as={AiOutlineInfoCircle} />}
              onClick={() => navigate(`/admin/article/${article._id}`)}
            >
              Xem chi ti???t b??i b??o
            </MenuItem>
            {!data?.status && (
              <MenuItem
                icon={<Icon as={AiOutlineCloseCircle} />}
                onClick={() => handleRemoveArticleFromJournal()}
              >
                X??a b??i b??o kh???i s???
              </MenuItem>
            )}
            {article.publishedFile?.downloadUri && (
              <Link to={`/view/${article.publishedFile?._id}`} target="_blank">
                <MenuItem icon={<Icon as={IoDocumentTextOutline} />}>
                  Xem t??i li???u xu???t b???n
                </MenuItem>
              </Link>
            )}
          </MenuList>
        </Menu>
      </HStack>
    </Card>
  );
};

const AddArticleModal: FC<
  UseDisclosureReturn & { journalId?: string; refetch: any }
> = ({ isOpen, onClose, journalId, refetch }) => {
  const finalRef = React.useRef(null);
  const [assignArticleId, setAssignArticleId] = useState<string>();
  const { toast } = useAppState();
  const articles = useGetAllArticlesQuery();
  const allUnassignArticle = useMemo(() => {
    if (articles.data && articles.data?.length) {
      return articles.data.filter(
        (a) => !!!a.journal?._id && a.status == ArticleStatus.completed
      );
    } else return [];
  }, [articles.data, assignArticleId]);

  const [addArticle, addArticleData] = useAddArticleToJournalMutation();

  const handleAddArticleToJournal = async (_id?: string) => {
    try {
      await addArticle({
        articleId: _id,
        journalId: journalId,
      }).unwrap();
      toast({ status: "success", title: "Th??m b??i b??o th??nh c??ng!" });
      setAssignArticleId(undefined);
      refetch();
      onClose();
      articles.refetch();
    } catch (error) {
      toast({ status: "success", title: "???? c?? l???i x???y ra!" });
    }
  };

  return (
    <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4} id="articleId">
            <FormLabel>B??i b??o</FormLabel>
            <Select
              placeholder="B??i b??o"
              value={assignArticleId}
              onChange={({ target }) => setAssignArticleId(target.value)}
            >
              {allUnassignArticle.map((a) => (
                <option value={a._id}>{a.title}</option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            H???y
          </Button>
          <Button
            colorScheme="green"
            isDisabled={!assignArticleId}
            isLoading={addArticleData.isLoading}
            onClick={() => handleAddArticleToJournal(assignArticleId)}
          >
            Th??m b??i b??o
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
