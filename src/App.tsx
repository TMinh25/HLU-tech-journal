import {
  Avatar,
  Box,
  CloseButton,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Portal,
  Progress,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { useFetchAuthInfoMutation } from "./features/auth/authApiSlice";
import { setCredentials, setIsAuthenticating } from "./features/auth/authSlice";
import { useAppState } from "./hooks/useAppState";
import { useAuth } from "./hooks/useAuth";
import { Hooray } from "./Hooray";
import { StreamChatContext } from "./main";
import NotFound from "./pages/404";
import AdminPage from "./pages/Admin";
import AdminJournal from "./pages/Admin/pages/AdminJournal";
import AdminJournalDetail from "./pages/Admin/pages/AdminJournalDetail";
import AdminJournalGroup from "./pages/Admin/pages/AdminJournalGroup";
import AdminUser from "./pages/Admin/pages/AdminUser";
import ArticlePage from "./pages/Article";
import EditorPage from "./pages/Editor";
import EditorArticle from "./pages/Editor/pages/Article";
import HomePage from "./pages/Home";
import JournalPage from "./pages/Journal/page/JournalPage";
import PublishedJournalPage from "./pages/Journal/page/PublishedJournalPage";
import PublishingJournalPage from "./pages/Journal/page/PublishingJournalPage";
import RecentPublishedJournalPage from "./pages/Journal/page/RecentPublishedJournalPage";
import LandingPage from "./pages/Layout";
import MessagePage from "./pages/Message";
import ForgotPasswordPage from "./pages/ResetPassword/request";
import ResetPasswordPage from "./pages/ResetPassword/reset";
import ReviewerPage from "./pages/Reviewer";
import ReviewArticleDetail from "./pages/Reviewer/pages/ReviewArticleDetail";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SubmissionPage from "./pages/Submission";
import ProfilePage from "./pages/User";
import AuthorArticleDetail from "./pages/User/pages/author";
import TokenService from "./services/token.service";
import { Role } from "./types";
import { BigContainer, Card, PrivateRoute } from "./utils/components";
import PDFViewer from "./utils/components/PDFViewer";

// client-side you initialize the Chat client with your API key
// export const streamChatClient = StreamChat.getInstance(config.streamChat.key);

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const accessToken = TokenService.getLocalAccessToken();
  const [fetchAuthInfo, fetchAuthInfoData] = useFetchAuthInfoMutation();
  const { authenticated, currentUser, isAuthenticating } = useAuth();
  const { toast } = useAppState();
  const streamChatClient = useContext(StreamChatContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!authenticated || currentUser == null) {
        console.log("fetchAuthInfo in App");
        dispatch(setIsAuthenticating(true));
        try {
          const user = await fetchAuthInfo().unwrap();
          console.log("app");
          streamChatClient
            .connectUser(
              {
                id: user._id,
                image: user.photoURL,
                name: user.aliases,
              },
              user.streamToken
            )
            .then(() => console.log("connected user"))
            .catch((e) => console.error(e));
          dispatch(setCredentials(user));
        } catch (error: any) {
          console.log(error);
          const title = error.data.message || "Không thể lấy dữ liệu từ phiên!";
          toast.closeAll();
          toast({
            status: "error",
            title,
            description: "Vui lòng thử lại sau.",
          });
        }
        dispatch(setIsAuthenticating(false));
      }
    };

    if (accessToken) fetchUserInfo();
  }, [accessToken]);

  // useEffect(() => {
  //   if (appState.error && !toast.isActive("authError")) {
  //     toast({
  //       title: appState.error.title,
  //       description: appState.error.description,
  //       status: "error",
  //       isClosable: true,
  //     });
  //   }
  // }, [appState.error]);

  if (fetchAuthInfoData.isLoading || isAuthenticating)
    return <Progress size="xs" isIndeterminate />;

  return (
    <>
      <Box>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />}>
              <Route index element={<HomePage />} />
              <Route path="*" element={<NotFound />} />
              <Route path="hooray" element={<PrivateRoute />}>
                <Route index element={<Hooray />} />
              </Route>
              <Route path="hooray2" element={<Hooray />} />
              <Route path="message/:channelId" element={<MessagePage />} />
              <Route path="article">
                {/* <Route index element={<JournalPage />} /> */}
                <Route path=":articleId" element={<ArticlePage />} />
              </Route>
              <Route path="journal">
                {/* <Route index element={<JournalPage />} /> */}
                <Route path=":journalId" element={<JournalPage />} />
                <Route
                  path="recent-published"
                  element={<RecentPublishedJournalPage />}
                />
                <Route path="published" element={<PublishedJournalPage />} />
                <Route path="publishing" element={<PublishingJournalPage />} />
              </Route>
              <Route path="submission" element={<PrivateRoute />}>
                <Route index element={<SubmissionPage />} />
              </Route>
              <Route path="seminor" element={<Hooray />} />
              <Route path="user/:userId">
                <Route index element={<ProfilePage />} />
              </Route>

              <Route
                path="admin"
                element={<PrivateRoute privateRole={Role.admin} />}
              >
                <Route index element={<AdminPage />} />
                <Route path="journal-group" element={<AdminJournalGroup />} />
                <Route path="journal" element={<AdminJournal />} />
                <Route path="user" element={<AdminUser />} />
                <Route
                  path="journal/:journalId"
                  element={<AdminJournalDetail />}
                />
                <Route path="article/:articleId" element={<EditorArticle />} />
              </Route>

              <Route
                path="editor"
                element={<PrivateRoute privateRole={Role.editors} />}
              >
                <Route index element={<EditorPage />} />
                <Route path="article/:articleId" element={<EditorArticle />} />
              </Route>

              <Route
                path="reviewer"
                element={<PrivateRoute privateRole={Role.reviewers} />}
              >
                <Route index element={<ReviewerPage />} />
                <Route
                  path="article/:articleId/:roundId"
                  element={<ReviewArticleDetail />}
                />
              </Route>

              <Route path="author" element={<PrivateRoute />}>
                <Route
                  path="article/:articleId"
                  element={<AuthorArticleDetail />}
                />
              </Route>
            </Route>
            <Route path="view/:fileId" element={<PDFViewer />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="reset-password">
              <Route path="" element={<ForgotPasswordPage />} />
              <Route path=":userId/:token" element={<ResetPasswordPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;
