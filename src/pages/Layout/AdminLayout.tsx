import { Box, Flex, Stack, Divider } from "@chakra-ui/react";
import {
  FaUser,
  FaRegHeart,
  FaRegPaperPlane,
  FaRegChartBar,
  FaRegBell,
  FaRegQuestionCircle,
  FaRegNewspaper,
  FaRegUser,
  FaNewspaper,
  FaQuestionCircle,
} from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { SideNavLink } from "./components/SideNavLink";
import { SearchField } from "./components/SearchField";
import { RiHomeFill, RiHomeLine } from "react-icons/ri";

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
            <SideNavLink
              to={"/admin"}
              label="Tổng Quan"
              icon={RiHomeLine}
              activeIcon={RiHomeFill}
            />
            <SideNavLink
              to={"/admin/user"}
              label="Người Dùng"
              icon={FaRegUser}
              activeIcon={FaUser}
            />
            <SideNavLink
              to={"/admin/journal-group"}
              label="Chuyên San"
              icon={FaRegPaperPlane}
              activeIcon={FaRegUser}
            />
            <SideNavLink
              to={"/admin/journal"}
              label="Số Tạp Chí"
              icon={FaRegNewspaper}
              activeIcon={FaNewspaper}
            />
          </Stack>
          <Divider />
          <Stack>
            <SideNavLink to={"/admin"} label="Notifications" icon={FaRegBell} />
            <SideNavLink
              to={"/admin"}
              label="Help Center"
              icon={FaRegQuestionCircle}
              activeIcon={FaQuestionCircle}
            />
          </Stack>
        </Stack>
      </Flex>
      <Outlet />
    </Box>
  );
};

export default AdminLayout;
