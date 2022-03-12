import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
  Skeleton,
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
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Article, { ReviewRoundObject } from "../../../interface/article.model";
import { ReviewStatus } from "../../../types";
import { getReviewStatusType, toReviewStatusString } from "../../../utils";
import { useAuth } from "../../../hooks/useAuth";

interface ArchiveArticleTableProps {
  data: Article[];
  isLoading?: Boolean;
  isFetching?: Boolean;
}

const ArchiveArticleTable: FC<ArchiveArticleTableProps> = ({
  data,
  isLoading,
  isFetching,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const allReviews: Array<{
    review: ReviewRoundObject;
    article: Article;
  }> = useMemo(
    () =>
      data
        .map((a) =>
          a
            .detail!.review!.filter((r) => r.reviewer === currentUser?._id)
            .map((r) => {
              return {
                review: r,
                article: a,
              };
            })
            .filter(
              (r) =>
                r.review.status !== ReviewStatus.request &&
                r.review.status !== ReviewStatus.reviewing
            )
        )
        .flat(),
    [data]
  );

  useEffect(() => {
    console.log(allReviews);
  }, [allReviews]);

  const columns: readonly Column<{
    review: ReviewRoundObject;
    article: Article;
  }>[] = useMemo(
    () => [
      {
        Header: "Tên bản thảo",
        accessor: (row) => row.article.title,
      },
      {
        Header: "Chuyên san",
        accessor: (originalRow) => (
          <Text>{originalRow.article.journalGroup.name}</Text>
        ),
      },
      {
        Header: "Tác giả",
        accessor: (originalRow) => {
          const { main, sub } = originalRow.article.authors;
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
          <Alert
            status={getReviewStatusType(row.review.status)}
            height="100%"
            fontWeight={"bold"}
            borderRadius={2}
          >
            <AlertIcon />
            {toReviewStatusString(row.review.status)}
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
    visibleColumns,
  } = useTable(
    {
      columns,
      data: allReviews,
    },

    useSortBy,
    usePagination
  );

  return (
    <>
      <Skeleton isLoaded={!isFetching && !isLoading}>
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
                      onClick={() =>
                        navigate(
                          `article/${row.original.article._id}/${row.original.review._id}`
                        )
                      }
                    >
                      {row.cells.map((cell, tdIndex) => (
                        <Td
                          {...cell.getCellProps({
                            key: `journal-group-cell-${tdIndex}`,
                          })}
                          padding={
                            tdIndex === visibleColumns.length - 1 ? 0 : "md"
                          }
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
          {allReviews.length === 0 && (
            <Center color="gray.500">Bạn không có bản thảo lưu trữ!</Center>
          )}
        </TableContainer>
      </Skeleton>
    </>
  );
};

export default ArchiveArticleTable;
