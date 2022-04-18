import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { BsNewspaper } from "react-icons/bs";
import { FaUser, FaUserSecret } from "react-icons/fa";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { NavigateFunction, useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useGetArticleForReviewerQuery } from "../../features/article";
import { useSignOutMutation } from "../../features/auth/authApiSlice";
import { resetCredentials } from "../../features/auth/authSlice";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import Article, { ReviewRoundObject } from "../../interface/article.model";
import { StreamChatContext } from "../../main";
import TokenService from "../../services/token.service";
import { ArticleStatus, ReviewStatus, Role } from "../../types";
import { NotiBadge } from "../../utils/components";
import Logo from "../../assets/HLU Logo.png";

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "CÁC SỐ ĐÃ ĐĂNG",
    href: "/journal/published",
    children: [
      {
        label: "Số Mới Ra",
        subLabel: "Số mới xuất bản gần đây nhất",
        href: "/journal/recent-published",
      },
      {
        label: "Số Đã Xuất Bản",
        subLabel: "Các số cũ, các số đã xuất bản",
        href: "/journal/published",
      },
    ],
  },
  {
    label: "GIỚI THIỆU VỀ TẠP CHÍ",
    href: "/about",
    children: [
      {
        label: "Giới Thiệu",
        href: "/about",
      },
      {
        label: "Hội Đồng Biên Tập",
        href: "/editorial-board",
      },
      {
        label: "Thể Lệ Tạp Chí",
        href: "/rules",
      },
    ],
  },
  {
    label: "THÔNG BÁO",
    href: "/notifications",
  },
  {
    label: "LIÊN HỆ",
    href: "/contact",
  },
  {
    label: "NỘP BẢN THẢO",
    href: "/submission",
  },
];

export default function Header() {
  const navigationModal = useDisclosure();
  const signOutModal = useDisclosure();
  const { authenticated, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signOutMutation, signOutData] = useSignOutMutation();
  const { setColorMode } = useColorMode();
  const streamChatClient = useContext(StreamChatContext);
  const { toast } = useAppState();

  const borderColorTheme = useColorModeValue("gray.200", "gray.600");

  const onToggleDarkMode = () => {
    const newTheme =
      localStorage.getItem("chakra-ui-color-mode") === "dark"
        ? "light"
        : "dark";
    localStorage.setItem("chakra-ui-color-mode", newTheme);
    // dispatch(
    //   modifyCredentials({
    //     ...currentUser,
    //     userSetting,
    //   } as User)
    // );
    setColorMode(newTheme);
  };

  async function handleSignOut() {
    try {
      await signOutMutation().unwrap();
      dispatch(resetCredentials());
      streamChatClient.disconnectUser();
      TokenService.updateLocalAccessToken(null);
      TokenService.updateLocalRefreshToken(null);
      signOutModal.onClose();
      navigate("/");
    } catch (error) {
      console.log({ error });
      toast({
        status: "error",
        title: (error as any).data?.message,
      });
    }
  }
  let reviewerSubmissions: any = undefined;
  if (role === Role.reviewers) {
    reviewerSubmissions = useGetArticleForReviewerQuery();
  }

  const ReviewersButton = () => {
    if (currentUser?._id && reviewerSubmissions.data) {
      const reviewerRounds: {
        review: ReviewRoundObject;
        article: Article;
      }[] = reviewerSubmissions?.data
        ?.map((a: Article) =>
          a
            .detail!.review!.filter(
              (r: ReviewRoundObject) => r.reviewer === currentUser?._id
            )
            .map((r: ReviewRoundObject) => ({
              review: r,
              article: a,
            }))
            .filter(
              (r: { review: ReviewRoundObject; article: Article }) =>
                r.article.status === ArticleStatus.review &&
                (r.review.status === ReviewStatus.request ||
                  r.review.status === ReviewStatus.reviewing)
            )
        )
        .flat();
      return (
        <Button
          isFullWidth
          borderRadius={0}
          px={11}
          iconSpacing="auto"
          rightIcon={
            reviewerRounds.length ? (
              <NotiBadge>
                {Math.min(reviewerRounds.length, 5) +
                  (!!(reviewerRounds.length > 5) ? "+" : "")}
              </NotiBadge>
            ) : (
              <BellIcon />
            )
          }
          onClick={() => navigate("/reviewer")}
          mr={6}
        >
          Phản biện
        </Button>
      );
    }
    return null;
  };
  return (
    <>
      {authenticated && (
        <Modal isOpen={signOutModal.isOpen} onClose={signOutModal.onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Đăng xuất</ModalHeader>
            <ModalBody>Bạn có chắc muốn đăng xuất?</ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                leftIcon={<Icon as={MdOutlinePowerSettingsNew} />}
                mr={3}
                onClick={handleSignOut}
                isLoading={signOutData.isLoading}
              >
                Đăng Xuất
              </Button>
              <Button variant="ghost" onClick={signOutModal.onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        maxH={"60px"}
        py={{
          base: 2,
        }}
        px={{
          base: 4,
        }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={borderColorTheme}
        align={"center"}
      >
        <Flex
          flex={{
            base: 1,
            md: "auto",
          }}
          ml={{
            base: -2,
          }}
          display={{
            base: "flex",
            md: "none",
          }}
        >
          <IconButton
            onClick={navigationModal.onToggle}
            icon={
              navigationModal.isOpen ? (
                <CloseIcon w={3} h={3} />
              ) : (
                <HamburgerIcon w={5} h={5} />
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          justify={{
            base: "center",
            md: "start",
          }}
        >
          <Image
            src={Logo}
            h={30}
            onClick={() => navigate("/")}
            cursor={"pointer"}
          />
          <Flex
            display={{
              base: "none",
              md: "flex",
            }}
            ml={10}
          >
            <DesktopNav
              {...{
                navigate,
              }}
            />
          </Flex>
        </Flex>
        <Flex
          flex={1}
          justifyContent="flex-end"
          align={{
            base: "center",
          }}
        >
          {authenticated ? (
            <>
              <Popover>
                <PopoverTrigger>
                  <Avatar
                    cursor="pointer"
                    size="md"
                    src={currentUser?.photoURL}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight="semibold">
                    <Text align="center">{currentUser?.displayName}</Text>
                  </PopoverHeader>
                  <PopoverBody>
                    <VStack
                      border="1px solid"
                      borderRadius="7"
                      borderColor={borderColorTheme}
                      align="stretch"
                      mb={4}
                      mt={2}
                      spacing={0}
                      overflow="hidden"
                    >
                      <Flex
                        align={"center"}
                        justifyContent="center"
                        h="30"
                        px={11}
                        my={7.5}
                      >
                        <FormLabel htmlFor="toggle-dark-mode" mb="0">
                          Chế độ tối
                        </FormLabel>
                        <Spacer />
                        <Switch
                          justifySelf={"flex-end"}
                          id="toggle-dark-mode"
                          isChecked={
                            localStorage.getItem("chakra-ui-color-mode") ===
                            "dark"
                              ? true
                              : false
                          }
                          onChange={onToggleDarkMode}
                        />
                      </Flex>
                      <Button
                        isFullWidth
                        borderRadius={0}
                        onClick={() => navigate("user/" + currentUser?._id)}
                        px={11}
                        iconSpacing="auto"
                        rightIcon={<Icon as={FaUser} />}
                      >
                        Trang cá nhân
                      </Button>
                      {role === Role.editors && (
                        <Button
                          isFullWidth
                          borderRadius={0}
                          px={11}
                          iconSpacing="auto"
                          rightIcon={<Icon as={FaUser} />}
                          as="a"
                          href="/editor"
                        >
                          Biên tập viên
                        </Button>
                      )}
                      {role === Role.admin && (
                        <Button
                          as="a"
                          href="/admin"
                          isFullWidth
                          borderRadius={0}
                          px={11}
                          iconSpacing="auto"
                          rightIcon={<Icon as={FaUserSecret} />}
                          mr={6}
                        >
                          Quản trị hệ thống
                        </Button>
                      )}
                      {role === Role.copyeditors && (
                        <Button
                          isFullWidth
                          borderRadius={0}
                          px={11}
                          iconSpacing="auto"
                          rightIcon={<Icon as={BsNewspaper} />}
                          onClick={() => navigate("/copyeditor")}
                          mr={6}
                        >
                          Biên tập bài báo
                        </Button>
                      )}
                      {role === Role.reviewers && <ReviewersButton />}
                    </VStack>
                    <Button
                      colorScheme="red"
                      isFullWidth
                      onClick={() => signOutModal.onOpen()}
                    >
                      Đăng Xuất
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Stack
              flex={{
                base: 1,
                md: 0,
              }}
              justify={"flex-end"}
              direction={"row"}
              spacing={3}
            >
              <Button
                fontSize={"sm"}
                fontWeight={400}
                variant={"outline"}
                onClick={() => navigate("/signin")}
              >
                Đăng Nhập
              </Button>
              <Button
                display={{
                  base: "none",
                  md: "inline-flex",
                }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"blue.400"}
                onClick={() => navigate("/signup")}
                boxShadow={"lg"}
                _hover={{
                  bg: "blue.300",
                }}
              >
                Đăng Kí
              </Button>
            </Stack>
          )}
        </Flex>
      </Flex>
      <Collapse in={navigationModal.isOpen} animateOpacity>
        <MobileNav
          {...{
            navigate,
          }}
        />
      </Collapse>
    </>
  );
}

const DesktopNav = ({ navigate }: { navigate: NavigateFunction }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label} rounded={4}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Text
                as={Link}
                to={navItem.href ?? "/"}
                p={2}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Text>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
                border="1px solid gray"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav
                      key={child.label}
                      {...{ navItem: child, navigate }}
                    />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({
  navItem,
  navigate,
}: {
  navItem: NavItem;
  navigate: NavigateFunction;
}) => {
  const { label, href, subLabel } = navItem;
  return (
    <Box
      as={Link}
      to={href ?? "/"}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("blue.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "blue.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"blue.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ navigate }: { navigate: NavigateFunction }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...{ navItem, navigate }} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  navItem,
  navigate,
}: {
  navItem: NavItem;
  navigate: NavigateFunction;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const { children, label, href } = navItem;
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        to={href ?? "/"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Text as={Link} to={child.href ?? "/"} key={child.label} py={2}>
                {child.label}
              </Text>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
