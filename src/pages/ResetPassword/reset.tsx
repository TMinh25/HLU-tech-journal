import {
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import {
  useIsValidResetPasswordQuery,
  useResetPasswordMutation,
} from "../../features/auth/authApiSlice";
import { useAppState } from "../../hooks/useAppState";
import { FormControlComponent } from "../../utils/components";
import NotFound from "../404";

export default function ResetPasswordPage(): JSX.Element {
  const navigate = useNavigate();
  const { userId, token } = useParams();
  if (!userId || !token) return <></>;
  const { isLoading, data, isError } = useIsValidResetPasswordQuery({
    userId,
    token,
  });
  const [resetPassword, resetPasswordData] = useResetPasswordMutation();
  // if (isError) navigate("/404", { replace: true });
  const { toast } = useAppState();

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: { password: "", rePassword: "" },
      validationSchema: yup.object({
        password: yup
          .string()
          .min(8, "Mật khẩu ngắn nhất 8 kí tự")
          .required("Hãy điền mật khẩu của bạn!"),
        rePassword: yup
          .string()
          .required("Vui lòng nhập lại mật khẩu")
          .when("password", {
            is: (password: any) =>
              password && password.length > 0 ? true : false,
            then: yup
              .string()
              .oneOf([yup.ref("password")], "Mật khẩu không trùng khớp"),
          }),
      }),
      onSubmit: async (requestForm) => {
        try {
          console.log(requestForm, userId, token);
          const response = await resetPassword({
            password: requestForm.password,
            userId,
            token,
          }).unwrap();
          toast({
            status: "success",
            title: response.message,
          });
          navigate("/signin", { replace: true });
        } catch (error) {
          console.log(error);
          toast({
            status: "error",
            title: (error as any).data.message,
          });
        }
      },
    });

  return (
    <>
      {isLoading ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.300", "white.800")}
        >
          <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
        </Flex>
      ) : data?.success ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.300", "white.800")}
        >
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              w={"md"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={8}
              my={14}
            >
              <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                Nhập Mật Khẩu Mới
              </Heading>
              <FormControlComponent
                id="password"
                formLabel="Mật khẩu"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.password?.toString()}
                error={errors.password}
                isRequired
                type="password"
              />
              <FormControlComponent
                id="rePassword"
                formLabel="Nhập lại mật khẩu"
                value={values.rePassword}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.rePassword?.toString()}
                error={errors.rePassword}
                isRequired
                type="password"
              />
              <Stack spacing={6}>
                <Button
                  type="submit"
                  isLoading={resetPasswordData.isLoading}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Stack>
            </Stack>
          </form>
        </Flex>
      ) : (
        <NotFound />
      )}
    </>
  );
}
