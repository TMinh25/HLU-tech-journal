import { HStack, SpaceProps, Tag, TagCloseButton } from "@chakra-ui/react";

interface IArticleTags {
  tags?: Array<string>;
  onRemoveTag?: (index: number) => void;
  marginTop?: SpaceProps["marginTop"];
  marginBottom?: SpaceProps["marginBottom"];
}

const TagsComponent: React.FC<IArticleTags> = ({
  tags,
  onRemoveTag,
  marginTop,
  marginBottom,
}) => {
  return (
    <HStack
      spacing={2}
      marginTop={marginTop || 0}
      marginBottom={marginBottom || 0}
    >
      {tags?.map((tag, index) => {
        return (
          <Tag size={"md"} variant="solid" key={tag}>
            {tag}
            {onRemoveTag && (
              <TagCloseButton onClick={() => onRemoveTag(index)} />
            )}
          </Tag>
        );
      })}{" "}
    </HStack>
  );
};

export default TagsComponent;
