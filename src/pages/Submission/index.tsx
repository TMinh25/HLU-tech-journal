import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import IFile from "../../interface/file";
import { NewSubmissionRequest } from "../../interface/requestAndResponse";
import { BigContainer } from "../../utils/components";
import StepOne from "./components/Step1";
import StepTwo from "./components/Step2";
import StepThree from "./components/Step3";
import StepFour from "./components/Step4";
import StepFive from "./components/Step5";

const steps = [
  "Bắt đầu",
  "Tải file bản thảo",
  "Nhập dữ liệu mô tả",
  "Tải file phụ trợ",
  "Khẳng định nộp bài",
];

export default function SubmissionPage() {
  const [finishedSteps, setFinishedSteps] = useState<number[]>([0]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const onNextTab = (tabNum: number) => {
    if (finishedSteps.indexOf(tabNum) < 0) {
      setFinishedSteps((prev) => [...prev, tabNum]);
    }
    setTabIndex(tabNum);
  };

  const onPrevTab = (tabNum: number) => {
    setTabIndex(tabNum);
  };

  const initialValues = {
    journalGroup: {
      _id: "",
      name: "",
    },
    journalId: "",
    language: "",
    tags: [],
    authors: {
      main: {
        ...currentUser,
      },
      sub: [] as {
        displayName: string;
        email: string;
        workPlace: string;
        backgroundInfomation: string;
      }[],
    },
    title: "",
    abstract: "",
    detail: {
      submission: {
        file: undefined,
        messageToEditor: "",
        orcid: "",
        website: "",
        helperFiles: [] as IFile[],
      },
    },
  };

  const validationSchema = yup.object({
    title: yup.string().required("Hãy nhập tên bản thảo của bạn"),
    abstract: yup.string(),
    language: yup.string().required("Lựa chọn ngôn ngữ cho bản thảo"),
    tags: yup.array().of(yup.string()),
    journalGroup: yup
      .object()
      .shape({
        _id: yup.string(),
        name: yup.string(),
      })
      .required("Hãy chọn chuyên san phù hợp với bản thảo"),
    journalId: yup.string().required("Hãy lựa chọn tạp chí để nộp bản thảo"),
    detail: yup.object().shape({
      submission: yup.object().shape({
        file: yup.object().shape({
          title: yup.string().required(),
          description: yup.string().required(),
          downloadUri: yup.string().required(),
          fileType: yup.string().required(),
        }),
        messageToEditor: yup.string(),
        orcid: yup.string(),
        website: yup.string(),
        helperFiles: yup.array(),
      }),
    }),
    authors: yup.object().shape({
      sub: yup.array().of(
        yup.object().shape({
          displayName: yup.string(),
          email: yup.string(),
          workPlace: yup.string(),
          backgroundInfomation: yup.string(),
        })
      ),
    }),
  });

  const newSubmissionForm = useFormik<NewSubmissionRequest>({
    initialValues: initialValues as NewSubmissionRequest,
    validationSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    console.log(newSubmissionForm.values);
  }, [newSubmissionForm.values]);

  return (
    <>
      <BigContainer>
        <Tabs
          isLazy
          lazyBehavior="keepMounted"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          variant="soft-rounded"
          colorScheme="green"
        >
          <TabList>
            {steps.map((step, index) => (
              <Tab
                key={"tab-" + index}
                mx={1}
                isDisabled={!finishedSteps.includes(index)}
              >
                {step}
              </Tab>
            ))}
          </TabList>
          {currentUser?.verified || (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Tài khoản chưa xác thực!</AlertTitle>
              <AlertDescription>
                Tài khoản của bạn sẽ không thể nộp bản thảo.{" "}
              </AlertDescription>
              <Spacer />
              <Button
                colorScheme="blue"
                variant="ghost"
                onClick={() => navigate("/setting")}
              >
                Xác thực
              </Button>
            </Alert>
          )}
          <FormikProvider value={newSubmissionForm}>
            <TabPanels>
              <TabPanel>
                <StepOne {...{ onNextTab, onPrevTab }} />
              </TabPanel>
              <TabPanel>
                <StepTwo {...{ onNextTab, onPrevTab }} />
              </TabPanel>
              <TabPanel>
                <StepThree {...{ onNextTab, onPrevTab }} />
              </TabPanel>
              <TabPanel>
                <StepFour {...{ onNextTab, onPrevTab }} />
              </TabPanel>
              <TabPanel>
                <StepFive
                  {...{
                    onNextTab,
                    onPrevTab,
                  }}
                />
              </TabPanel>
            </TabPanels>
          </FormikProvider>
        </Tabs>
      </BigContainer>
    </>
  );
}
