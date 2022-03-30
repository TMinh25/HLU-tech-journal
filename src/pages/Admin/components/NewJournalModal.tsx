import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useGetAllJournalGroupsQuery } from "../../../features/journalGroup";
import { useGetAllUsersQuery } from "../../../features/user";
import { useAuth } from "../../../hooks/useAuth";
import {
  CUIAutoComplete,
  FormControlComponent,
} from "../../../utils/components";

export interface Item {
  value: string;
  label: string;
  photoURL: string;
}

export default function NewJournalModal({
  isOpen,
  onClose,
  onSubmit,
  createJournalData,
}: any) {
  const { currentUser } = useAuth();
  const allUsersQuery = useGetAllUsersQuery();
  const allJournalGroupsQuery = useGetAllJournalGroupsQuery();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const allUsers = useMemo<Item[]>(() => {
    if (allUsersQuery.data) {
      return allUsersQuery.data
        .filter((user) => user._id !== currentUser?._id || user.role === 1) // filter currentUser and user not editor
        .map(
          (user) =>
            ({
              value: user._id,
              label: user.aliases,
              photoURL: user.photoURL,
            } as Item)
        );
    }
    return Array.from<Item>([]);
  }, [allUsersQuery.data]);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      name: "",
      tags: [],
      description: "",
      createdBy: {
        _id: currentUser!._id,
        displayName: currentUser!.displayName,
        at: new Date(),
      },
      journalGroup: "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .required("Tên số là bắt buộc")
        .min(10, "Tên số phải dài hơn 10 kí tự"),
      tags: yup.array().of(yup.string()),
      description: yup.string(),
      journalGroup: yup.string().required("Phải chọn chuyên san cho số!"),
    }),
    onSubmit,
  });

  useEffect(() => {
    console.log(values);
    console.log(errors);
  }, [values, errors]);

  const customRender = (selected: Item) => (
    <Flex alignItems="center" justifyItems={"center"}>
      <Avatar mr={2} size="sm" src={selected.photoURL} />
      <Text>{selected.label}</Text>
    </Flex>
  );

  return (
    <>
      <Modal isCentered size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tạo số mới</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <FormControl
                id="journalGroup"
                pb={4}
                isInvalid={Boolean(touched.journalGroup && errors.journalGroup)}
                isRequired
              >
                <HStack>
                  <FormLabel>Chuyên san</FormLabel>
                  {(touched || errors.journalGroup) && (
                    <>
                      <Spacer />
                      <FormErrorMessage pb={2}>
                        {errors.journalGroup}
                      </FormErrorMessage>
                    </>
                  )}
                </HStack>
                <Select
                  placeholder="Chuyên san"
                  value={values.journalGroup}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {allJournalGroupsQuery.data?.map((group, index) => (
                    <option key={`journal-group-${index}`} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControlComponent
                id="name"
                touched={touched.name?.toString()}
                error={errors.name}
                value={values.name}
                formLabel="Tên số"
                onChange={handleChange}
                onBlur={handleBlur}
                isRequired={true}
              />
              <FormControlComponent
                id="description"
                touched={touched.description?.toString()}
                error={errors.description}
                value={values.description}
                formLabel="Mô tả"
                onChange={handleChange}
                onBlur={handleBlur}
                inputType="textarea"
              />
            </ModalBody>

            <ModalFooter>
              <Button size="lg" onClick={onClose} mr={3}>
                Hủy
              </Button>
              <Button
                isLoading={createJournalData?.isLoading}
                type="submit"
                colorScheme="green"
                shadow="xs"
                border="none"
                size="lg"
              >
                Tạo
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
