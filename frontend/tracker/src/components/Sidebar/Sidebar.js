import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import SidebarOption from "./SidebarOption";
import tracker from "../../assets/icons/tracker-icon.svg";
import home from "../../assets/icons/home-icon.svg";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <Box w="150px" h="100%" bg="var(--dark-brown)" borderRadius="10px">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Image src={logo} alt="logo" w="90px" objectFit="contain" />
      </Box>
      <Box marginTop="5rem">
        <Link to="/dashboard">
          <SidebarOption icon={home} name="home" />
        </Link>
        <Link to="/dashboard/tracker">
          <SidebarOption icon={tracker} name="tracker" />
        </Link>
      </Box>
    </Box>
  );
}

export default Sidebar;
