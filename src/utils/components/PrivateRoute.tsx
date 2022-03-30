import { Text } from "@chakra-ui/react";
import { FC, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../types";
import { toRoleString } from "../../utils";

const PrivateRoute: FC<{ privateRole?: Role }> = ({ privateRole }) => {
  const location = useLocation();
  const { authenticated, role, currentUser } = useAuth();
  const { toast } = useAppState();

  const privateOutlet = useMemo(() => {
    console.log(role <= Number(privateRole));
    if (Boolean(privateRole)) {
      if (authenticated && role === privateRole) {
        toast.closeAll();
        return <Outlet />;
      } else {
        toast.closeAll();
        toast({
          status: "error",
          title: (
            <Text>
              Vui lòng đăng nhập bằng tài khoản{" "}
              <Text as="span" textDecor={"underline"}>
                {toRoleString(privateRole)}
              </Text>
            </Text>
          ),
        });
      }
    } else {
      if (authenticated) return <Outlet />;
    }
    return (
      <Navigate
        to="/signin"
        state={{ from: location.pathname, privateRole }}
        replace
      />
    );
  }, [currentUser]);

  return privateOutlet;
};
export default PrivateRoute;
