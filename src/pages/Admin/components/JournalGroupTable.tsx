import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Button,
  Center,
  CircularProgress,
  Flex,
  HStack,
  IconButton,
  ListItem,
  OrderedList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Column, useSortBy, usePagination, useTable } from "react-table";
import JournalGroup from "../../../interface/journalGroup.model";

export default function JournalGroupTable({ data, isLoading }: any) {
  const columns: readonly Column<JournalGroup>[] = useMemo(
    () => [
      {
        Header: "Chuyên san",
        accessor: "name" as keyof JournalGroup,
      },
      {
        Header: "Thẻ",
        accessor: (originalRow) => (
          <HStack spacing={2}>
            {originalRow.tags?.map((tag) => (
              <Tag>{tag}</Tag>
            ))}
          </HStack>
        ),
      },
    ],
    []
  );

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

  return (
    <>
      <TableContainer>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, trGroupIndex) => (
              <Tr
                {...headerGroup.getHeaderGroupProps({
                  key: `journal-group-header-group-${trGroupIndex}`,
                })}
              >
                {headerGroup.headers.map((column, thIndex) => (
                  <Th
                    {...column.getHeaderProps({
                      key: `journal-group-column-${thIndex}`,
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
            {!!page.length &&
              page.map((row, trIndex) => {
                prepareRow(row);
                return (
                  <Tr
                    cursor="pointer"
                    {...row.getRowProps({
                      key: `journal-group-row-${trIndex}`,
                    })}
                  >
                    {row.cells.map((cell, tdIndex) => (
                      <Td
                        {...cell.getCellProps({
                          key: `journal-group-cell-${tdIndex}`,
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
                <IconButton
                  mr={2}
                  onClick={previousPage}
                  disabled={!canPreviousPage}
                  icon={<ChevronLeftIcon />}
                  aria-label="prev-button"
                />
                <IconButton
                  onClick={nextPage}
                  disabled={!canNextPage}
                  icon={<ChevronRightIcon />}
                  aria-label="next-button"
                />
              </Flex>
            )}
          </TableCaption>
        </Table>
        {data.length === 0 && (
          <Center color="gray.500">Chưa có chuyên san nào!</Center>
        )}
      </TableContainer>
    </>
  );
}
