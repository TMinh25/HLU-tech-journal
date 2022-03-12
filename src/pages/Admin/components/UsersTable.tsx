import { ChevronDownIcon, ChevronUpIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spacer,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import { useToggleDisableUserMutation } from "../../../features/user";
import User from "../../../interface/user.model";
import { copyTextToClipboard, toRoleString } from "../../../utils";
import { PopoverUserInfoAdmin } from "../../../utils/components";

export default function UsersTable({
  data,
  isLoading,
  refetch,
  isFetching,
  error,
}: // toggleDisabled,
// toggleDisabledIsLoading,
any) {
  const navigate = useNavigate();

  const [toggleDisableUser, toggleDisableUserData] =
    useToggleDisableUserMutation();

  const toggleDisabled = async (id: string) => {
    await toggleDisableUser(id);
    refetch();
  };

  const columns: readonly Column<User>[] = useMemo(
    () => [
      {
        Header: "Tên người dùng",
        accessor: (originalRow) => {
          return (
            <>
              <Flex align={"center"}>
                <Box
                  h={2}
                  w={2}
                  mr={3}
                  borderRadius="100%"
                  bg={originalRow.disabled ? "red.400" : "green.400"}
                />
                {originalRow.displayName}
              </Flex>
              {/* </Link> */}
            </>
          );
        },
      },
      {
        Header: "Email",
        accessor: (originalRow) => {
          return (
            <>
              <Tooltip
                placement="bottom-start"
                label="Copy"
                closeOnClick={false}
              >
                <Text
                  onClick={async () =>
                    await copyTextToClipboard(originalRow.email)
                  }
                >
                  {originalRow.email}
                </Text>
              </Tooltip>
            </>
          );
        },
      },
      {
        Header: "Quyền",
        accessor: (originalRow) => {
          return toRoleString(originalRow.role);
        },
      },
      {
        Header: " ",
        accessor: (user) => {
          return (
            <PopoverUserInfoAdmin user={user}>
              <IconButton
                size="sm"
                aria-label="modifyTable"
                icon={<EditIcon />}
              />
            </PopoverUserInfoAdmin>
          );
        },
        maxWidth: 20,
      },
    ],
    []
  );

  useEffect(() => console.log(data), [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canNextPage,
    nextPage,
    canPreviousPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },

    useSortBy,
    usePagination
  );

  // const currentPage = useMemo(() => {
  //   return page;
  // }, [page]);

  return (
    <>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, trGroupIndex) => (
            <Tr
              {...headerGroup.getHeaderGroupProps({
                key: `user-header-group-${trGroupIndex}`,
              })}
            >
              {headerGroup.headers.map((column, thIndex) => (
                <Th
                  {...column.getHeaderProps({
                    key: `user-column-${thIndex}`,
                  })}
                  {...column.getSortByToggleProps()}
                >
                  <Flex>
                    <Text>{column.render("Header")}</Text>
                    <Spacer />
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon />
                      ) : (
                        <ChevronUpIcon />
                      )
                    ) : null}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, trIndex) => {
            prepareRow(row);
            return (
              <Tr
                {...row.getRowProps({
                  key: `user-row-${trIndex}`,
                })}
              >
                {row.cells.map((cell, tdIndex) => (
                  <Td
                    {...cell.getCellProps({
                      key: `user-cell-${tdIndex}`,
                    })}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
        <TableCaption>
          {(canPreviousPage || canNextPage) && (
            <Flex>
              <Button mr={2} onClick={previousPage} disabled={!canPreviousPage}>
                {"<"}
              </Button>
              <Button onClick={nextPage} disabled={!canNextPage}>
                {">"}
              </Button>
            </Flex>
          )}
        </TableCaption>
      </Table>
    </>
  );
}
