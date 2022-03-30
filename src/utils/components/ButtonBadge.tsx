import { IconButton, css, Box, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { FaBell } from "react-icons/fa";

export interface ButtonBadgeProps extends IconButtonProps {
  count?: number;
}

const ButtonBadge: FC<ButtonBadgeProps> = ({ count, ...props }) => {
  return (
    <IconButton
      css={`
        position: relative !important;
      `}
      py={"2"}
      colorScheme={"gray"}
      size={"lg"}
      icon={
        <>
          <FaBell color={"gray.750"} />
        </>
      }
      {...props}
      aria-label={"icon-button-with-badge"}
    />
  );
};
export default ButtonBadge;
