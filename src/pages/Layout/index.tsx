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
  CloseButton,
  Collapse,
  Container,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  LinkBox,
  LinkOverlay,
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
  ScaleFade,
  Spacer,
  Stack,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue, chakra } from "@chakra-ui/system";
import { useContext, useEffect, useMemo } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaUser,
  FaUserSecret,
  FaYoutube,
} from "react-icons/fa";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import {
  Link,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import Logo from "../../assets/HLU Logo.png";
import { useGetArticleForReviewerQuery } from "../../features/article";
import { useSignOutMutation } from "../../features/auth/authApiSlice";
import { resetCredentials } from "../../features/auth/authSlice";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import Article, { ReviewRoundObject } from "../../interface/article.model";
import { StreamChatContext } from "../../main";
import TokenService from "../../services/token.service";
import { ArticleStatus, ReviewStatus, Role } from "../../types";
import { Card, NotiBadge, SocialButton } from "../../utils/components";

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  // {
  //   label: "Tạp Chí Khoa Học",
  //   href: "#",
  //   children: [
  //     {
  //       label: "Số Mới Ra",
  //       href: "/journal/recent-published",
  //     },
  //     {
  //       label: "Đã Xuất Bản",
  //       subLabel: "Các số cũ, các số cũ ",
  //       href: "/journal/published",
  //     },
  //     {
  //       label: "Đang Xuất Bản",
  //       subLabel: "Các số đang trong quá trình biên tập",
  //       href: "/journal/publishing",
  //     },
  //   ],
  // },
  // {
  //   label: "Hội thảo Khoa Học",
  //   href: "#",
  //   children: [
  //     {
  //       label: "Đã Xuất Bản",
  //       subLabel: "Các hội thảo đã tổ chức",
  //       href: "/",
  //     },
  //     {
  //       label: "Đang Xuất Bản",
  //       subLabel: "Hội thảo sắp tới...",
  //       href: "/",
  //     },
  //   ],
  // },
  {
    label: "Số Mới Ra",
    href: "/journal/recent-published",
  },
  {
    label: "Số đã xuất Bản",
    subLabel: "Các số cũ, các số cũ ",
    href: "/journal/published",
  },
  {
    label: "Số đang Xuất Bản",
    subLabel: "Các số đang trong quá trình biên tập",
    href: "/journal/publishing",
  },
  {
    label: "Đăng Kí Nộp Bản Thảo",
    href: "/submission",
  },
];

export default function LandingPage() {
  const navigationModal = useDisclosure();
  const signOutModal = useDisclosure();
  const { authenticated, currentUser, role } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signOutMutation, signOutData] = useSignOutMutation();
  const location = useLocation();
  const { toast } = useAppState();
  const { setColorMode } = useColorMode();

  const borderColorTheme = useColorModeValue("gray.200", "gray.600");

  const streamChatClient = useContext(StreamChatContext);
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

  useEffect(() => {
    const unreadCountListener = streamChatClient.on((event) => {
      if (event.total_unread_count && event.unread_channels) {
        const { message } = event;
        console.log(message);
        toast({
          render: ({ onClose }) => (
            <Box
              p={3}
              boxShadow={"2xl"}
              rounded={"lg"}
              border=".2px solid"
              color="black"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              bg={useColorModeValue("white", "gray.700")}
              // onClick={() => navigate(`/message/${message?.id}`)}
            >
              <HStack>
                <Avatar src={message?.user?.image as string} />
                <Stack>
                  <Heading size="sm">{message?.user?.name}</Heading>
                  <Text>{message?.text}</Text>
                </Stack>
                <Spacer />
                <CloseButton onClick={onClose} />
              </HStack>
            </Box>
          ),
        });
      }
    });

    return () => {
      unreadCountListener.unsubscribe();
    };
  }, []);

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
    <Box>
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
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={borderColorTheme}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
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
        <Flex justify={{ base: "center", md: "start" }}>
          <Image
            src={Logo}
            h={30}
            onClick={() => navigate("/")}
            cursor={"pointer"}
          />
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav {...{ navigate }} />
          </Flex>
        </Flex>
        <Flex flex={1} justifyContent="flex-end" align={{ base: "center" }}>
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
                          onClick={() => navigate("/editor")}
                        >
                          Biên tập viên
                        </Button>
                      )}
                      {role === Role.admin && (
                        <Button
                          isFullWidth
                          borderRadius={0}
                          px={11}
                          iconSpacing="auto"
                          rightIcon={<Icon as={FaUserSecret} />}
                          onClick={() => navigate("/admin")}
                          mr={6}
                        >
                          Quản trị hệ thống
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
              flex={{ base: 1, md: 0 }}
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
                display={{ base: "none", md: "inline-flex" }}
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
        <MobileNav {...{ navigate }} />
      </Collapse>
      <ScaleFade key={location.pathname} initialScale={0.95} in={true}>
        <Box __css={{ minH: "calc(100vh - 60px)" }}>
          <Outlet />
        </Box>
      </ScaleFade>

      {/* <Box>
        <Stack
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "center" }}
        >
          <Image
            src={Logo}
            h={30}
            onClick={() => navigate("/")}
            cursor={"pointer"}
          />
          <Text>© 2020 Chakra Templates. All rights reserved</Text>
        </Stack>
      </Box> */}
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          spacing={4}
          justify={"center"}
          align={"center"}
        >
          <Link to={"/"}>
            <Image src={Logo} h={30} />
          </Link>

          {/* <Stack direction={"row"} spacing={6}>
            <Link to={"/"}>Home</Link>
            <Link to={"/"}>About</Link>
            <Link to={"/"}>Blog</Link>
            <Link to={"/"}>Contact</Link>
          </Stack> */}
        </Container>

        <Box
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align={{ base: "center", md: "center" }}
          >
            <Text>© 2022 HLU Tech Journal. All rights reserved</Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton
                label={"Twitter"}
                href={"https://www.facebook.com/sipp.minhh"}
              >
                <FaFacebook />
              </SocialButton>
              <SocialButton
                label={"Instagram"}
                href={"https://www.instagram.com/not.gr4y/"}
              >
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
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
