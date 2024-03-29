import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Center,
  Flex,
  IconButton,
  ListItem,
  OrderedList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Journal from "../../../interface/journal.model";

export default function JournalsTable({ data }: any) {
  const navigate = useNavigate();

  const columns: readonly Column<Journal>[] = useMemo(
    () => [
      {
        Header: "Tên số",
        accessor: "name" as keyof Journal,
      },
      {
        Header: "Chuyên san",
        accessor: (originalRow) => (
          <Badge isTruncated size="sm">
            {originalRow.journalGroup?.name}
          </Badge>
        ),
      },
      {
        Header: "Ban biên tập",
        accessor: (originalRow) => {
          const { editors } = originalRow;
          if (editors.length > 0)
            return (
              <Popover trigger="hover">
                <PopoverTrigger>
                  <AvatarGroup cursor="pointer" size="sm" max={3}>
                    {editors.map((editor) => (
                      <Avatar src={editor.photoURL} name={editor.name} />
                    ))}
                  </AvatarGroup>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight={"bold"}>
                    Ban Biên Tập
                  </PopoverHeader>
                  <PopoverBody>
                    <OrderedList>
                      {editors.map((editor) => (
                        <ListItem>{editor.name}</ListItem>
                      ))}
                    </OrderedList>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            );
          else {
            return <Text>Chưa có biên tập</Text>;
          }
        },
      },
      {
        Header: "Ngày khởi tạo",
        accessor: (originalRow) =>
          new Date(originalRow.createdBy?.at.toString()).toLocaleDateString(
            "vi"
          ),
      },
      {
        Header: "Trạng thái",
        accessor: (originalRow) =>
          originalRow.status ? "Đã xuất bản" : "Đang xuất bản",
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
                  key: `header-group-${trGroupIndex}`,
                })}
              >
                {headerGroup.headers.map((column, thIndex) => (
                  <Th
                    {...column.getHeaderProps({
                      key: `header-${thIndex}`,
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
                      key: `row-${trIndex}`,
                    })}
                    onClick={() => navigate(`journal/${row.original._id}`)}
                  >
                    {row.cells.map((cell, tdIndex) => (
                      <Td
                        {...cell.getCellProps({
                          key: `cell-${tdIndex}`,
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
        {data.length === 0 && <Center color="gray.500">Chưa có số nào!</Center>}
      </TableContainer>
    </>
  );
}
