import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useRequestResetPasswordMutation } from "../../features/auth/authApiSlice";
import { useAppState } from "../../hooks/useAppState";
import { FormControlComponent } from "../../utils/components";

export default function ForgotPasswordForm(): JSX.Element {
  const navigate = useNavigate();
  const [requestResetPassword, requestResetPasswordData] =
    useRequestResetPasswordMutation();
  const { toast } = useAppState();

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: { email: "" },
      validationSchema: yup.object({
        email: yup
          .string()
          .email("Hãy nhập đúng email!")
          .required("Hãy điền email của bạn!"),
      }),
      onSubmit: async (requestForm) => {
        try {
          const response = await requestResetPassword(requestForm).unwrap();
          toast({
            status: "success",
            title: response.message,
          });
        } catch (error) {
          console.log(error);
        }
      },
    });

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <>
      <IconButton
        m={12}
        size="lg"
        boxShadow={"lg"}
        position="absolute"
        aria-label="chevron-left"
        onClick={() => navigate(-1)}
        icon={<Icon as={FaChevronLeft} />}
      />
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.300", "white.800")}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={6}
            w={"full"}
            maxW={"md"}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Quên mật khẩu của mình?
            </Heading>
            <Text
              fontSize={{ base: "sm", sm: "md" }}
              color={useColorModeValue("gray.800", "gray.400")}
            >
              Bạn sẽ nhận được email cùng với link để reset mật khẩu
            </Text>
            <FormControlComponent
              id="email"
              placeholder="your-email@example.com"
              onBlur={handleBlur}
              onChange={handleChange}
              touched={touched.email?.toString()}
              error={errors.email}
              value={values.email}
            />
            <Stack spacing={6}>
              <Button
                isLoading={requestResetPasswordData.isLoading}
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Yêu cầu
              </Button>
            </Stack>
          </Stack>
        </form>
      </Flex>
    </>
  );
}
