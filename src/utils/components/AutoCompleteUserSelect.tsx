/* eslint-disable prettier/prettier */
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  IconProps,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  ComponentWithAs,
  Flex,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps,
  List,
  ListIcon,
  ListItem,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from "downshift";
import { matchSorter } from "match-sorter";
import { useEffect, useRef, useState } from "react";
import useDeepCompareEffect from "react-use/lib/useDeepCompareEffect";

export interface Item {
  label: string;
  value: string;
  photoURL: string;
}

export interface CUIAutoCompleteProps<T extends Item>
  extends UseMultipleSelectionProps<T> {
  items: T[];
  placeholder: string;
  label: string;
  highlightItemBg?: string;
  onCreateItem?: (item: T) => void;
  optionFilterFunc?: (items: T[], value: string) => T[];
  itemRenderer?: (item: T) => string | JSX.Element;
  labelStyleProps?: FormLabelProps;
  inputStyleProps?: InputProps;
  toggleButtonStyleProps?: ButtonProps;
  tagStyleProps?: TagProps;
  listStyleProps?: BoxProps;
  listItemStyleProps?: BoxProps;
  emptyState?: (inputValue: string) => React.ReactNode;
  selectedIconProps?: Omit<IconProps, "name"> & {
    icon: IconProps["name"] | React.ComponentType;
  };
  icon?: ComponentWithAs<"svg", IconProps>;
  hideToggleButton?: boolean;
  createItemRenderer?: (value: string) => string | JSX.Element;
  disableCreateItem?: boolean;
  renderCustomInput?: (inputProps: any, toggleButtonProps: any) => JSX.Element;
  error?: any;
}

function defaultOptionFilterFunc<T>(items: T[], value: string) {
  return matchSorter(items, value, { keys: ["value", "label"] });
}

function defaultCreateItemRenderer(value: string) {
  return (
    <Text>
      <Box as="span">Create</Box>{" "}
      <Box as="span" bg="yellow.300" fontWeight="bold">
        "{value}"
      </Box>
    </Text>
  );
}

const CUIAutoComplete = <T extends Item>(
  props: CUIAutoCompleteProps<T>
): React.ReactElement<CUIAutoCompleteProps<T>> => {
  const {
    items,
    optionFilterFunc = defaultOptionFilterFunc,
    itemRenderer,
    highlightItemBg = "gray.100",
    placeholder,
    label,
    listStyleProps,
    labelStyleProps,
    inputStyleProps,
    toggleButtonStyleProps,
    tagStyleProps,
    selectedIconProps,
    listItemStyleProps,
    onCreateItem,
    icon,
    disableCreateItem = false,
    hideToggleButton = false,
    createItemRenderer = defaultCreateItemRenderer,
    renderCustomInput,
    error,
    ...downshiftProps
  } = props;

  /* States */
  const [isCreating, setIsCreating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputItems, setInputItems] = useState<T[]>(items);

  /* Refs */
  const disclosureRef = useRef(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  /* Downshift Props */
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection(downshiftProps);
  const selectedItemValues = selectedItems.map((item) => item.value);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    selectItem,
    setHighlightedIndex,
  } = useCombobox({
    inputValue,
    selectedItem: undefined,
    items: inputItems,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      const filteredItems = optionFilterFunc(items, inputValue || "");

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false);
      }

      if (!selectedItem) {
        setInputItems(filteredItems);
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: false,
          };
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue,
            isOpen: true,
          };
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            inputValue,
          };
        default:
          return changes;
      }
    },
    // @ts-ignore
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || "");
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            if (selectedItemValues.includes(selectedItem.value)) {
              removeSelectedItem(selectedItem);
            } else {
              if (onCreateItem && isCreating) {
                onCreateItem(selectedItem);
                setIsCreating(false);
                setInputItems(items);
                setInputValue("");
              } else {
                addSelectedItem(selectedItem);
              }
            }

            // @ts-ignore
            selectItem(null);
          }
          break;
        default:
          break;
      }
    },
  });

  useEffect(() => {
    if (inputItems.length === 0 && !disableCreateItem) {
      setIsCreating(true);
      // @ts-ignore
      setInputItems([{ label: `${inputValue}`, value: inputValue }]);
      setHighlightedIndex(0);
    }
  }, [
    inputItems,
    setIsCreating,
    setHighlightedIndex,
    inputValue,
    disableCreateItem,
  ]);

  useDeepCompareEffect(() => {
    setInputItems(items);
  }, [items]);

  /* Default Items Renderer */
  function defaultItemRenderer<T extends Item>(selected: T) {
    return selected.label;
  }

  return (
    <Stack>
      <FormLabel {...{ ...getLabelProps({}), ...labelStyleProps }}>
        {label}
      </FormLabel>

      {/* ---------Stack with Selected Menu Tags above the Input Box--------- */}
      {selectedItems && (
        <Stack spacing={2} isInline flexWrap="wrap">
          {selectedItems.map((selectedItem, index) => (
            <Tag
              key={`selected-item-${index}`}
              size="lg"
              shadow={"lg"}
              {...tagStyleProps}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              <Avatar
                src={selectedItem.photoURL}
                size="xs"
                name={selectedItem.label}
                ml={-1}
                mr={2}
              />
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedItem(selectedItem);
                }}
                aria-label="Remove menu selection badge"
              />
            </Tag>
          ))}
        </Stack>
      )}
      {/* ---------Stack with Selected Menu Tags above the Input Box--------- */}

      {/* -----------Section that renders the input element ----------------- */}
      <Stack isInline {...getComboboxProps()}>
        {renderCustomInput ? (
          renderCustomInput(
            {
              ...inputStyleProps,
              ...getInputProps(
                getDropdownProps({
                  placeholder,
                  onClick: isOpen ? () => {} : openMenu,
                  onFocus: isOpen ? () => {} : openMenu,
                  ref: disclosureRef,
                })
              ),
            },
            {
              ...toggleButtonStyleProps,
              ...getToggleButtonProps(),
              ariaLabel: "toggle menu",
              hideToggleButton,
            }
          )
        ) : (
          <>
            <Input
              {...inputStyleProps}
              {...getInputProps(
                getDropdownProps({
                  placeholder,
                  onClick: isOpen ? () => {} : openMenu,
                  onFocus: isOpen ? () => {} : openMenu,
                  ref: disclosureRef,
                })
              )}
            />
            {!hideToggleButton && (
              <Button
                {...toggleButtonStyleProps}
                {...getToggleButtonProps()}
                aria-label="toggle menu"
                variant="ghost"
                // colorScheme={"red"}
              >
                {error ? "!" : !isOpen ? <ArrowDownIcon /> : <ArrowUpIcon />}
              </Button>
            )}
          </>
        )}
      </Stack>
      {/* -----------Section that renders the input element ----------------- */}
      {/* -----------Section that renders the Menu Lists Component ----------------- */}
      {
        <Box pb={4} mb={4}>
          <List
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="4px"
            border={isOpen && "1px solid rgba(0,0,0,0.1)"}
            boxShadow="6px 5px 8px rgba(0,50,30,0.02)"
            overflow={"hidden"}
            {...listStyleProps}
            {...getMenuProps({ ref: listRef })}
          >
            {isOpen &&
              inputItems.map((item, index) => (
                <ListItem
                  cursor={"pointer"}
                  px={2}
                  py={1}
                  borderBottom="1px solid rgba(0,0,0,0.01)"
                  key={`${item.value}${index}`}
                  _hover={{
                    background: useColorModeValue("gray.300", "gray.500"),
                    stroke: "blue",
                  }}
                  {...listItemStyleProps}
                  {...getItemProps({ item, index })}
                >
                  {isCreating ? (
                    createItemRenderer(item.label)
                  ) : (
                    <Flex alignItems="center" justifyContent="space-between">
                      {itemRenderer
                        ? itemRenderer(item)
                        : defaultItemRenderer(item)}
                      {selectedItemValues.includes(item.value) && (
                        <ListIcon
                          as={icon || CheckCircleIcon}
                          color="green.500"
                          role="img"
                          display="inline"
                          aria-label="Selected"
                          {...selectedIconProps}
                        />
                      )}
                    </Flex>
                  )}
                </ListItem>
              ))}
          </List>
        </Box>
      }
      {/* ----------- End Section that renders the Menu Lists Component ----------------- */}
    </Stack>
  );
};
export default CUIAutoComplete;
