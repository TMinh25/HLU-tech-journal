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
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { FC, memo, useRef } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineAdd, MdOutlineArticle } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToggleVisibleMutation } from "../../../features/article";
import {
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
} from "../../../features/journal";
import { ArticleStatus } from "../../../types";
import { getArticleStatusType, toArticleStatusString } from "../../../utils";
import { AuthorBox, BigContainer, Card } from "../../../utils/components";
import Article from "../../../interface/article.model";

const AdminJournalDetail = (props: any) => {
  const { journalId } = useParams();
  const journal = useGetJournalByIdQuery(journalId);
  const journalsArticles = useGetArticleOfJournalQuery(journalId);
  const [toggleVisible, toggleVisibleData] = useToggleVisibleMutation();
  const cancelRef = useRef(null);
  const sureToToggle = useDisclosure();

  const handleToggleVisibleArticle = async (_id: string) => {
    await toggleVisible(_id).unwrap();
    journalsArticles.refetch();
    sureToToggle.onClose();
  };

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
            {/* <Card>
              <Heading size="md" mb={4}>
                Danh sách biên tập viên
              </Heading>
              {journalsArticles.data && (
                <SimpleGrid
                  columns={{ base: 1, md: 1, lg: 2, xl: 3 }}
                  spacing={6}
                >
                  {journal.data?.editors.map((editor, index) => (
                    <AuthorBox
                      showUserId
                      author={{
                        _id: editor._id,
                        displayName: editor.name,
                        photoURL: editor.photoURL,
                      }}
                      // onRemoveAuthor={() => removeAuthor(index)}
                    />
                  ))}

                  <Button
                    border={".5px solid"}
                    borderColor={useColorModeValue("gray.300", "gray.500")}
                    key="add-editor"
                    bg={useColorModeValue("gray.100", "gray.700")}
                    boxShadow={"lg"}
                    p={4}
                    rounded={"xl"}
                    h="100%"
                  >
                    <Icon as={MdOutlineAdd} />
                  </Button>
                </SimpleGrid>
              )}
            </Card> */}
            <Card>
              <Heading size="md" mb={4}>
                Danh sách bài báo
              </Heading>
              {journalsArticles.data && (
                <Stack>
                  {/* Sort for visible article first */}
                  {journalsArticles.data.length ? journalsArticles.data.map((article, index) => (
                    <>
                      <AdminArticleCard
                        key={`admin-card-${index}`}
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
                              Bài báo vẫn đang trong quá trình phản biện. Bạn có
                              chắc chắn?
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
                  )) : <Center color={useColorModeValue("gray.600", 'gray.400')}>Chưa có bài báo nào được phân vào số này</Center>}
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
}> = ({ sureToToggle, handleToggleVisibleArticle, isLoading, article }) => {
  const navigate = useNavigate();
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
              Xem chi tiết bản thảo
            </MenuItem>
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
