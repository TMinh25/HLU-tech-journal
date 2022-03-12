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
  Box,
  Flex,
  IconButton,
  Skeleton,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Article from "../../../interface/article.model";
import { getArticleStatusType, toArticleStatusString } from "../../../utils";

const ArticleTable: FC<
  TableContainerProps & { data: Article[]; isLoading: boolean }
> = ({ data, isLoading, ...props }) => {
  const navigate = useNavigate();

  const columns: readonly Column<Article>[] = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (row) => <Text isTruncated>{row?._id}</Text>,
      },
      {
        Header: "Tên",
        accessor: (row) => {
          return (
            <Tooltip label={row?.title}>
              <Text isTruncated>{row?.title}</Text>
            </Tooltip>
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
      <Skeleton isLoaded={!isLoading}>
        <TableContainer mt={4} borderRadius={6} shadow="outline" {...props}>
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup, trGroupIndex) => (
                <Tr
                  {...headerGroup.getHeaderGroupProps({
                    key: `author-article-header-group-${trGroupIndex}`,
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
                        key: `author-article-row-${trIndex}`,
                      })}
                      onClick={() =>
                        navigate(`/author/article/${row.original._id}`)
                      }
                    >
                      {row.cells.map((cell, tdIndex) => (
                        <Td
                          {...cell.getCellProps({
                            key: `author-article-cell-${tdIndex}`,
                          })}
                          maxW={tdIndex == 0 ? "3xs" : "base"}
                          p={tdIndex == 2 ? 0 : "base"}
                          isTruncated
                        >
                          {cell.render("Cell")}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
            </Tbody>
            <TableCaption py={4}>
              {data?.length === 0 && (
                <Box color="gray.500" textAlign="center">
                  <Text>Bạn chưa tham gia đóng góp vào bài báo nào, </Text>
                  <Text> hãy tích cực lên nhé!</Text>
                </Box>
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
      </Skeleton>
    </>
  );
};
export default ArticleTable;
