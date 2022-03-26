import {
  Button,
  Heading,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { useGetArticleForCopyeditorQuery } from "../../features/article";
import {
  BigContainer,
  Card,
  CopyEditorArticleCard,
} from "../../utils/components";

const CopyEditorPage: FC = () => {
  const articlesForCopyeditor = useGetArticleForCopyeditorQuery();

  return (
    <BigContainer>
      <Skeleton h={400} isLoaded={articlesForCopyeditor.isSuccess}>
        <Stack>
          <Card>
            <Stack>
              <Heading size="md">Toàn văn cần biên tập</Heading>
              <Stack>
                {articlesForCopyeditor.data?.length ? (
                  <>
                    {articlesForCopyeditor.data?.map((article) => (
                      <CopyEditorArticleCard article={article} />
                    ))}
                  </>
                ) : (
                  <Text textAlign={"center"}>Bạn không có</Text>
                )}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Skeleton>
    </BigContainer>
  );
};
export default CopyEditorPage;
