import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { FC, FocusEventHandler, LegacyRef } from "react";
import { ChangeEventHandler } from "react";

interface FormControlComponentProps {
  id: string;
  touched?: string;
  error?: any;
  placeholder?: string;
  helperText?: string;
  value?: string | ReadonlyArray<string> | number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  formLabel?: string;
  isRequired?: boolean;
  inputType?: "textarea" | string;
  type?: string;
  noOfLines?: number;
  ref?: LegacyRef<HTMLElement | HTMLTextAreaElement | HTMLInputElement>;
}

const FormControlComponent: FC<FormControlComponentProps> = ({
  id,
  value,
  onChange,
  error,
  touched,
  onBlur,
  type,
  inputType = "input",
  formLabel,
  helperText,
  isRequired,
  placeholder,
  noOfLines = 5,
  ref,
  ...rest
}) => {
  let inputField;

  if (inputType == "textarea")
    inputField = (
      <Textarea
        {...{ value, onChange, onBlur, placeholder, type, noOfLines }}
        ref={ref as LegacyRef<HTMLTextAreaElement>}
      />
    );
  else
    inputField = (
      <Input
        {...{ value, onChange, onBlur, placeholder, type }}
        ref={ref as LegacyRef<HTMLInputElement>}
      />
    );

  return (
    <FormControl
      id={id}
      isInvalid={Boolean(touched && error)}
      pb={4}
      {...{ ...rest, isRequired }}
    >
      <HStack>
        <FormLabel>{formLabel}</FormLabel>
        {(touched || error) && (
          <>
            <Spacer />
            <FormErrorMessage pb={2}>{error}</FormErrorMessage>
          </>
        )}
      </HStack>
      {inputField}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
export default FormControlComponent;
