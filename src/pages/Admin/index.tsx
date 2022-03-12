import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useMemo } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useSignUpMutation } from "../../features/auth/authApiSlice";
import {
  useCreateJournalMutation,
  useGetAllJournalsQuery,
} from "../../features/journal";
import {
  useCreateJournalGroupMutation,
  useGetAllJournalGroupsQuery,
} from "../../features/journalGroup";
import { useGetAllUsersQuery } from "../../features/user";
import { useAppState } from "../../hooks/useAppState";
import Journal from "../../interface/journal.model";
import JournalGroup from "../../interface/journalGroup.model";
import {
  NewJournalGroupRequest,
  NewJournalRequest,
  SignUpRequest,
} from "../../interface/requestAndResponse";
import User from "../../interface/user.model";
import { BigContainer, Card } from "../../utils/components";
import JournalGroupTable from "./components/JournalGroupTable";
import JournalsTable from "./components/JournalsTable";
import NewJournalGroupModal from "./components/NewJournalGroupModal";
import NewJournalModal from "./components/NewJournalModal";
import NewUserModal from "./components/NewUserModal";
import UsersTable from "./components/UsersTable";

export default function AdminPage(): JSX.Element {
  return (
    <>
      <BigContainer>
        <Accordion allowMultiple allowToggle defaultIndex={[0, 1, 2]}>
          <Stack spacing={8}>
            <JournalGroupBox />
            <JournalBox />
            <UserBox />
          </Stack>
        </Accordion>
      </BigContainer>
    </>
  );
}

function JournalGroupBox(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createJournalGroup, createJournalGroupData] =
    useCreateJournalGroupMutation();
  const { data, error, isLoading, refetch, isFetching } =
    useGetAllJournalGroupsQuery();
  const { toast } = useAppState();
  const navigate = useNavigate();

  let allJournals = useMemo(() => {
    if (data) {
      return Array.from<JournalGroup>(data);
    }
    return Array.from<JournalGroup>([]);
  }, [data]);

  const newJournalGroupForm = useFormik({
    initialValues: {
      name: "",
      tags: [] as string[],
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required("Tên chuyên san là bắt buộc")
        .min(12, "Tên chuyên san phải dài hơn 12 kí tự"),
      tags: yup.array().of(yup.string()),
    }),
    onSubmit: (form: NewJournalGroupRequest) => {
      createJournalGroup(form)
        .unwrap()
        .then((journalGroup) => {
          console.log(journalGroup);
          refetch();
          newJournalGroupForm.resetForm();
          onClose();
        })
        .catch((error) => {
          toast({
            status: "error",
            title: "Không thể tạo tạp chí mới",
            description: "Vui lòng thử lại",
          });
          console.error(error);
        });
    },
  });

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Chuyên san</Heading>
          </AccordionButton>
          <Flex justifySelf={"flex-end"}>
            <Button
              variant={"outline"}
              colorScheme="green"
              rightIcon={<AddIcon />}
              onClick={onOpen}
              mr={2}
            >
              Tạo chuyên san mới
            </Button>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
            <IconButton
              aria-label="refetch-journals"
              icon={<Icon as={BiLinkExternal} />}
              onClick={() => navigate("journal-group")}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <NewJournalGroupModal
            {...{
              isOpen,
              onClose,
              createJournalGroupData,
              ...newJournalGroupForm,
            }}
          />
          <Box>
            <JournalGroupTable {...{ error, isLoading }} data={allJournals} />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function JournalBox(props: any) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createJournal, createJournalData] = useCreateJournalMutation();
  const { data, error, isLoading, refetch, isFetching } =
    useGetAllJournalsQuery();
  const { toast } = useAppState();

  let allJournals = useMemo(() => {
    if (data) {
      return Array.from<Journal>(data);
    }
    return Array.from<Journal>([]);
  }, [data]);

  const onSubmit = function createNewJournal(
    newJournalForm: NewJournalRequest
  ) {
    createJournal(newJournalForm)
      .unwrap()
      .then((journal) => {
        console.log(journal);
        toast({ status: "success", title: "Tạo tạp chí thành công" });

        refetch();
        onClose();
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "Không thể tạo tạp chí mới",
          description: "Vui lòng thử lại",
        });
        console.error(error);
      });
  };

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            <Heading as="h3">Tạp chí</Heading>
          </AccordionButton>
          <Flex justifySelf={"flex-end"}>
            <Button
              variant={"outline"}
              colorScheme="green"
              rightIcon={<AddIcon />}
              onClick={onOpen}
              mr={2}
            >
              Tạo tạp chí mới
            </Button>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
            <IconButton
              aria-label="refetch-journals"
              icon={<Icon as={BiLinkExternal} />}
              onClick={() => navigate("journal")}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <NewJournalModal
            {...{ isOpen, onClose, onSubmit, createJournalData }}
          />
          <Box>
            <JournalsTable {...{ error, isLoading }} data={allJournals} />
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}

function UserBox(props: any) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createUser, createUserData] = useSignUpMutation();
  const { data, error, isLoading, isFetching, refetch } = useGetAllUsersQuery();
  const { toast } = useAppState();

  const allUsers = useMemo(() => {
    console.log(data);
    if (data?.length) {
      return Array.from<User>(data);
    }
    return Array.from<User>([]);
  }, [data]);

  const onSubmit = function createNewJournal(signUpForm: SignUpRequest) {
    createUser(signUpForm)
      .unwrap()
      .then((user) => {
        console.log(user);
        toast({ status: "success", title: "Tạo người dùng thành công" });
        refetch();
        onClose();
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "Không thể tạo người dùng",
          description: "Vui lòng thử lại",
        });
        console.error(error);
      });
  };

  return (
    <Card>
      <AccordionItem border="none">
        <Flex align="center">
          <AccordionButton borderRadius={4} _focus={{ outline: "none" }}>
            <AccordionIcon mr={3} />
            {/* <Flex mb={6} justify="space-between" align="center"> */}
            {/* </Flex> */}
            <Heading as="h3">Người dùng</Heading>
          </AccordionButton>
          <Flex>
            <Button
              variant={"outline"}
              colorScheme="green"
              rightIcon={<AddIcon />}
              onClick={onOpen}
              mr={2}
            >
              Tạo người dùng mới
            </Button>
            <IconButton
              aria-label="refetch-journals"
              icon={<RepeatIcon />}
              onClick={refetch}
              isLoading={isLoading || isFetching}
              variant="ghost"
              rounded={100}
            />
            <IconButton
              aria-label="refetch-journals"
              icon={<Icon as={BiLinkExternal} />}
              onClick={() => navigate("user")}
              variant="ghost"
              rounded={100}
            />
          </Flex>
        </Flex>
        <AccordionPanel>
          <NewUserModal
            {...{ isOpen, onClose, onSubmit }}
            isSignUpLoading={createUserData.isLoading}
          />
          <Box>
            <UsersTable
              {...{ error, isLoading, isFetching, refetch }}
              // toggleDisabledIsLoading={toggleDisableUserData.isLoading}
              data={allUsers}
            />{" "}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Card>
  );
}
