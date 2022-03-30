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
import {
  useGetTempReviewerQuery,
  useToggleDisableUserMutation,
} from "../../../features/user";
import User, { TempReviewer } from "../../../interface/user.model";
import { copyTextToClipboard, toRoleString } from "../../../utils";
import { PopoverUserInfoAdmin } from "../../../utils/components";

export default function TempReviewerTable(props: any) {
  const { data, error, isLoading, isFetching, refetch } =
    useGetTempReviewerQuery();

  const allTempReviewer = useMemo(() => {
    console.log(data);
    if (data?.length) {
      return Array.from<TempReviewer>(data);
    }
    return Array.from<TempReviewer>([]);
  }, [data]);

  const columns: readonly Column<TempReviewer>[] = useMemo(
    () => [
      {
        Header: "Tên phản biện",
        accessor: "displayName" as keyof TempReviewer,
      },
      {
        Header: "Email",
        accessor: (row) => {
          return (
            <>
              <Tooltip
                placement="bottom-start"
                label="Copy"
                closeOnClick={false}
              >
                <Text
                  onClick={async () => await copyTextToClipboard(row.email)}
                >
                  {row.email}
                </Text>
              </Tooltip>
            </>
          );
        },
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
      data: allTempReviewer,
    },

    useSortBy,
    usePagination
  );

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
