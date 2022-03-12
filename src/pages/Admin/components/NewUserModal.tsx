import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { Resolver } from "dns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import countryCodes from "../../../data/countryCode.json";
import { FormControlComponent } from "../../../utils/components";
import { Role } from "../../../types";
import { toRoleString } from "../../../utils";

// export interface Item {
//   value: string;
//   label: string;
//   photoURL: string;
// }

export default function NewUserModal({
  isOpen,
  onClose,
  onSubmit,
  isSignUpLoading,
}: any) {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPasswordClick = () => setShowPassword((prev) => !prev);

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        displayName: "",
        aliases: "",
        sex: undefined,
        degree: "",
        workPlace: "",
        nation: "",
        backgroundInfomation: "",
        email: "",
        username: "",
        password: "",
        rePassword: "",
        photoURL: "",
        role: -1,
      },
      validationSchema: yup.object({
        displayName: yup.string().required("Vui lòng nhập họ tên của bạn!"),
        aliases: yup.string().required("Nhập bí danh của bạn"),
        email: yup
          .string()
          .email("Hãy nhập đúng email!")
          .required("Vui lòng nhập email của bạn!"),
        username: yup
          .string()
          .min(6, "Tài khoản phải có ít nhất 6 kí tự")
          .required("Hãy nhập tên tài khoản của bạn"),
        workPlace: yup.string().required("Hãy nhập đơn vị bạn đang công tác"),
        password: yup
          .string()
          .min(8, "Mật khẩu phải dài ít nhất 8 kí tự")
          .required("Vui lòng nhập mật khẩu"),
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
        role: yup.number(),
      }),
      onSubmit,
    });

  useEffect(() => {
    console.log(values);
    console.log(errors);
  }, [values, errors]);

  return (
    <>
      <Modal size={"6xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mb={6}>Tạo tạp chí mới</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <Stack spacing={4}>
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControlComponent
                      id="displayName"
                      formLabel="Họ & Tên"
                      value={values.displayName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.displayName?.toString()}
                      error={errors.displayName}
                      isRequired
                    />
                  </Box>
                  <Box flex={1}>
                    <FormControlComponent
                      id="aliases"
                      formLabel="Bí Danh"
                      value={values.aliases}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.aliases?.toString()}
                      error={errors.aliases}
                      isRequired
                    />
                  </Box>
                </HStack>
                <FormControlComponent
                  id="email"
                  formLabel="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.email?.toString()}
                  error={errors.email}
                  isRequired
                />
                <FormControlComponent
                  id="username"
                  formLabel="Tên tài khoản"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.username?.toString()}
                  error={errors.username}
                  isRequired={true}
                />
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControl
                      isRequired
                      isInvalid={Boolean(touched.password && errors.password)}
                      id="password"
                    >
                      <HStack>
                        <FormLabel>Mật khẩu</FormLabel>
                        {touched.password && errors.password && (
                          <>
                            <Spacer />
                            <FormErrorMessage pb={2}>
                              {errors.password}
                            </FormErrorMessage>
                          </>
                        )}
                      </HStack>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleShowPasswordClick}
                          >
                            {showPassword ? "Ẩn" : "Hiện"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl
                      isRequired
                      isInvalid={Boolean(
                        touched.rePassword && errors.rePassword
                      )}
                      id="rePassword"
                    >
                      <HStack>
                        <FormLabel>Nhập Lại Mật Khẩu</FormLabel>
                        {touched.rePassword && errors.rePassword && (
                          <>
                            <Spacer />
                            <FormErrorMessage pb={2}>
                              {errors.rePassword}
                            </FormErrorMessage>
                          </>
                        )}
                      </HStack>
                      <Input
                        type="password"
                        value={values.rePassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <Divider py={1} />
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormControl id="sex">
                      <FormLabel>Giới Tính</FormLabel>
                      <Select
                        placeholder="Giới Tính"
                        value={values.sex}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option key="sex-female" value="0">
                          Nữ
                        </option>
                        <option key="sex-male" value="1">
                          Nam
                        </option>
                        <option key="sex-undefined" value={undefined}>
                          Không đề cập
                        </option>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl id="nation">
                      <FormLabel>Quốc Gia</FormLabel>
                      <Select
                        placeholder="Quốc Gia"
                        value={values.nation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {countryCodes.map((country) => (
                          <option
                            key={"country-" + country.ISO2}
                            value={country.slug}
                          >
                            {country.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box flex={1}>
                    <FormControl id="degree">
                      <FormLabel>Bằng Cấp Cao Nhất</FormLabel>
                      <Select
                        placeholder="Bằng Cấp"
                        value={values.degree}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option key="de-hischool" value="Cấp 3">
                          Cấp 3
                        </option>
                        <option key="de-college" value="Cao Đẳng">
                          Cao Đẳng
                        </option>
                        <option key="de-uni" value="Đại Học">
                          Đại Học
                        </option>
                        <option key="de-engin" value="Kĩ Sư">
                          Kĩ Sư
                        </option>
                        <option key="de-mast" value="Thạc Sĩ">
                          Thạc Sĩ
                        </option>
                        <option key="de-doc" value="Tiến Sĩ">
                          Tiến Sĩ
                        </option>
                        <option key="de-prof" value="Giáo Sư">
                          Giáo Sư
                        </option>
                      </Select>
                    </FormControl>
                  </Box>
                </HStack>
                <FormControlComponent
                  id="workPlace"
                  isRequired
                  formLabel="Nơi công tác"
                  value={values.workPlace}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormControlComponent
                  id="backgroundInfomation"
                  inputType="textarea"
                  formLabel="Thông tin lý lịch"
                  helperText="Thông tin về phòng hoặc cấp bậc tại cơ quan công tác"
                  value={values.backgroundInfomation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormControl id="role" isInvalid={Boolean(errors.role)}>
                  <FormLabel>Quyền hạn</FormLabel>
                  <Select
                    placeholder="Quyền"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value={Role.admin}>
                      {toRoleString(Role.admin)}
                    </option>
                    <option value={Role.editors}>
                      {toRoleString(Role.editors)}
                    </option>
                    <option value={Role.reviewers}>
                      {toRoleString(Role.reviewers)}
                    </option>
                    <option value={Role.users}>
                      {toRoleString(Role.users)}
                    </option>
                  </Select>
                  <FormHelperText>
                    Tài khoản sẽ mặc định là người dùng nếu không lựa chọn
                  </FormHelperText>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button size="lg" onClick={onClose} mr={3}>
                Hủy
              </Button>
              <Button
                colorScheme="green"
                shadow="xs"
                border="none"
                id="submit"
                type="submit"
                color={"white"}
                isLoading={isSignUpLoading}
                size="lg"
              >
                Tạo tài khoản
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
