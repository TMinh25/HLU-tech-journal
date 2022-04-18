import { Box, Flex, Stack, Divider } from "@chakra-ui/react";
import { FC } from "react";
import {
  FaUser,
  FaRegHeart,
  FaRegPaperPlane,
  FaRegChartBar,
  FaRegBell,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { SideNavLink } from "./components/SideNavLink";
import { SearchField } from "./components/SearchField";

const AdminLayout = () => {
  return (
    <Box display="flex" h="fit-content">
      <Flex
        height="100vh"
        width={{ base: "full", sm: "xs" }}
        direction="column"
        // borderRightWidth="1px"
        px={6}
        py={8}
      >
        <SearchField mb={6} />
        <Stack spacing={6}>
          <Stack>
            <SideNavLink to={"/admin"} label="People" icon={FaUser} isActive />
            <SideNavLink to={"/admin"} label="Favorites" icon={FaRegHeart} />
            <SideNavLink
              to={"/admin"}
              label="Workflow"
              icon={FaRegPaperPlane}
            />
            <SideNavLink
              to={"/admin"}
              label="Statistics"
              icon={FaRegChartBar}
            />
          </Stack>
          <Divider />
          <Stack>
            <SideNavLink to={"/admin"} label="Notifications" icon={FaRegBell} />
            <SideNavLink
              to={"/admin"}
              label="Help Center"
              icon={FaRegQuestionCircle}
            />
          </Stack>
        </Stack>
      </Flex>
      <Outlet />
    </Box>
  );
};

export default AdminLayout;
