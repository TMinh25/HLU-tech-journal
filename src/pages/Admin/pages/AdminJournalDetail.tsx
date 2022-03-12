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
  Skeleton,
  Spacer,
  Stack,
  Tag,
  Text,
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
import { MdOutlineArticle } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToggleVisibleMutation } from "../../../features/article";
import {
  useGetArticleOfJournalQuery,
  useGetJournalByIdQuery,
} from "../../../features/journal";
import { ArticleStatus } from "../../../types";
import { getArticleStatusType, toArticleStatusString } from "../../../utils";
import { BigContainer, Card } from "../../../utils/components";
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
            <Card>
              <Heading size="md" mb={4}>
                Danh sách bài báo
              </Heading>
              {journalsArticles.data && (
                <Stack>
                  {/* Sort for visible article first */}
                  {journalsArticles.data.map((article, index) => (
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
                  ))}
                </Stack>
              )}
            </Card>
          </Stack>
        </Skeleton>
        <Text css={{ whiteSpace: "pre-line" }}>
          {JSON.stringify(journal?.data)}
        </Text>
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
