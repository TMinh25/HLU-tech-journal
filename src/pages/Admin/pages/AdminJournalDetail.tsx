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
} from "../../../features/article";
import {
  useAddArticleToJournalMutation,
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
  usePublishedJournalMutation,
  useRemoveArticleToJournalMutation,
} from "../../../features/journal";
import { ArticleStatus } from "../../../types";
import { getArticleStatusType, toArticleStatusString } from "../../../utils";
import { AuthorBox, BigContainer, Card } from "../../../utils/components";
import Article from "../../../interface/article.model";
import { useAppState } from "../../../hooks/useAppState";
import React from "react";

const AdminJournalDetail = (props: any) => {
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
        toast({ status: "success", title: "Cập nhật thành công" });
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
                Xuất bản số
              </Button>
            ) : (
              <Center color="gray.500">Đã xuất bản</Center>
            )}
            <Card>
              <Heading size="md" mb={4}>
                Danh sách bài báo
              </Heading>
              {journalsArticles.data && (
                <Stack>
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
                                  Xác nhận thao tác?
                                </AlertDialogHeader>
                                <AlertDialogCloseButton />
                                <AlertDialogBody>
                                  Bài báo vẫn đang trong quá trình phản biện.
                                  Bạn có chắc chắn?
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                  <Button
                                    ref={cancelRef}
                                    onClick={sureToToggle.onClose}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    colorScheme="green"
                                    ml={3}
                                    onClick={() =>
                                      handleToggleVisibleArticle(article._id)
                                    }
                                  >
                                    Chắc chắn
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
                      Chưa có bài báo nào được phân vào số này
                    </Center>
                  )}
                  {!journal.data?.status && (
                    <>
                      <Button onClick={addArticleModal.onOpen}>
                        Thêm bài báo
                      </Button>
                      <AddArticleModal
                        {...addArticleModal}
                        refetch={journalsArticles.refetch}
                        journalId={journal.data?._id}
                      />
                    </>
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

export default AdminJournalDetail;

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
        <Stack>
          <HStack>
            <Icon as={MdOutlineArticle} />
            <Text>{article.title}</Text>
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
              {article.visible ? "Được hiển thị" : "Không được hiển thị"}
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
              Xem chi tiết bài báo
            </MenuItem>
            {!data?.status && (
              <MenuItem
                icon={<Icon as={AiOutlineCloseCircle} />}
                onClick={() => handleRemoveArticleFromJournal()}
              >
                Xóa bài báo khỏi số
              </MenuItem>
            )}
            {article.publishedFile?.downloadUri && (
              <Link to={`/view/${article.publishedFile?._id}`} target="_blank">
                <MenuItem icon={<Icon as={IoDocumentTextOutline} />}>
                  Xem tài liệu xuất bản
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
      toast({ status: "success", title: "Thêm bài báo thành công!" });
      setAssignArticleId(undefined);
      refetch();
      onClose();
      articles.refetch();
    } catch (error) {
      toast({ status: "success", title: "Đã có lỗi xảy ra!" });
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
            <FormLabel>Bài báo</FormLabel>
            <Select
              placeholder="Bài báo"
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
            Hủy
          </Button>
          <Button
            colorScheme="green"
            isDisabled={!articles}
            isLoading={addArticleData.isLoading}
            onClick={() => handleAddArticleToJournal(assignArticleId)}
          >
            Thêm bài báo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
