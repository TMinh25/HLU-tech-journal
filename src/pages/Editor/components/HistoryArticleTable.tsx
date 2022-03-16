import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Avatar,
  AvatarGroup,
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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Article from "../../../interface/article.model";
import { getArticleStatusType, toArticleStatusString } from "../../../utils";

export default function HistoryArticleTable({ data }: any) {
  const navigate = useNavigate();

  const columns: readonly Column<Article>[] = useMemo(
    () => [
      {
        Header: "Tên",
        accessor: (row) => {
          return (
            <Tooltip label={row.title}>
              <Text isTruncated>{row.title}</Text>
            </Tooltip>
          );
        },
      },
      {
        Header: "Số",
        accessor: (row) => (
          <Tooltip label={row.journal.name}>
            <Text isTruncated>{row.journal.name}</Text>
          </Tooltip>
        ),
      },
      {
        Header: "Tác giả",
        accessor: (originalRow) => {
          const { main, sub } = originalRow.authors;
          return (
            <Popover trigger="hover">
              <PopoverTrigger>
                <AvatarGroup cursor="pointer" size="sm" max={3}>
                  <Avatar name={main.displayName} src={main.photoURL} />
                  {sub?.map((editor) => (
                    <Avatar name={editor.displayName} />
                  ))}
                </AvatarGroup>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader fontWeight={"bold"}>Các tác giả</PopoverHeader>
                <PopoverBody>
                  <OrderedList>
                    <ListItem>{main.displayName}</ListItem>
                    {sub?.map((author) => (
                      <ListItem>{author.displayName}</ListItem>
                    ))}
                  </OrderedList>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          );
        },
      },
      {
        Header: "Trạng thái",
        accessor: (row) => (
          <Alert borderRadius={2} status={getArticleStatusType(row.status)}>
            <AlertIcon />
            <AlertTitle>{toArticleStatusString(row.status)}</AlertTitle>
          </Alert>
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
                  >
                    {row.cells.map((cell, tdIndex) => (
                      <Td
                        {...cell.getCellProps({
                          key: `cell-${tdIndex}`,
                        })}
                        width={"fit-content"}
                        maxW={tdIndex == 0 ? "96" : tdIndex == 1 ? "32" : "sm"}
                        p={tdIndex === 3 ? "0" : "sm"}
                        onClick={() => navigate("article/" + row.original._id)}
                        isTruncated
                      >
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
          </Tbody>
          <TableCaption>
            {data.length === 0 && (
              <Center color="gray.500">Không có bản thảo nào!</Center>
            )}
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
      </TableContainer>
    </>
  );
}
