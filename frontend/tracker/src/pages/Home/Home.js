import React, { useEffect } from "react";
import "./Home.css";
import { Box, Image, Text } from "@chakra-ui/react";
import * as actionTypes from "../../store/actionTypes";
import dashboard_hero from "../../assets/icons/dashboard-hero-icon.svg";
import incoming_icon from "../../assets/icons/incoming-tray-icon.svg";
import outgoing_icon from "../../assets/icons/outgoing-tray-icon.svg";
import archive from "../../assets/icons/archive.svg";
import { useStateValue } from "../../store/StateProvider";
import { Link } from "react-router-dom";
import HomeOption from "../../components/HomeOption/HomeOption";
import { fetchIncomingCount, fetchOutgoingCount } from "../../http/document";

function Home() {
  const [store, dispatch] = useStateValue();

  useEffect(() => {
    _fetchIncomingCount();
    _fetchOutgoingCount();
  }, []);

  const _fetchIncomingCount = async () => {
    const res = await fetchIncomingCount(store.token);
    const data = res.data.count;
    dispatch({
      type: actionTypes.SET_INCOMING_COUNT,
      payload: data,
    });
  };

  const _fetchOutgoingCount = async () => {
    const res = await fetchOutgoingCount(store.token);
    const data = res.data.count;
    dispatch({
      type: actionTypes.SET_OUTGOING_COUNT,
      payload: data,
    });
  };

  const userInfo = store.user;
  const incomingCount = store.incomingCount;
  const outgoingCount = store.outgoingCount;

  return (
    <Box
      marginTop={{ sm: "2rem", lg: "2.2rem" }}
      maxW={{ sm: "95%", lg: "100%" }}
      marginX="auto"
      marginLeft={{ sm: "35px", lg: "0" }}
      // bg={{ md: "yellow", lg: "red", xl: "blue" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        marginTop={{ sm: "5rem", lg: "10px" }}
        position="relative"
        flex="1"
      >
        <Box
          position="relative"
          marginTop={{ sm: "0px" }}
          margin="auto"
          w="100%"
        >
          <Box
            w="100%"
            h={{ sm: "130px", lg: "220px" }}
            borderRadius="10px"
            bg="#E3BC97"
            marginTop={{ lg: "2rem" }}
          >
            <Box
              position="absolute"
              top={{ sm: "50px", lg: "90px" }}
              left={{ sm: "15px", lg: "30" }}
              maxW={{ sm: "350px", lg: "600px" }}
              zIndex="100"
            >
              <Text
                as="h3"
                fontSize={{ sm: "2rem", lg: "2.5rem" }}
                fontWeight="600"
                isTruncated
              >
                Hi, {userInfo.first_name}
              </Text>
              <Text as="h4" fontSize={{ lg: "1rem" }} fontWeight="500">
                Ready to start your day with Documents Tracker?
              </Text>
            </Box>
            <Image
              src={dashboard_hero}
              alt="dashboard-hero"
              zIndex="10"
              position="absolute"
              top="0"
              right="0"
              h="100%"
              w="auto"
            />
          </Box>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          marginTop={{ sm: "10rem", lg: "4rem" }}
        >
          <Box marginRight="50px" marginLeft="15px">
            <Link to="/dashboard/incoming">
              <HomeOption
                icon={incoming_icon}
                text="Incoming"
                count={incomingCount}
              />
            </Link>
          </Box>
          <Box marginRight="50px">
            <Link to="/dashboard/outgoing">
              <HomeOption
                icon={outgoing_icon}
                text="Outgoing"
                count={outgoingCount}
              />
            </Link>
          </Box>
          {userInfo.is_department && (
            <Box>
              <Link to="/dashboard/archive">
                <HomeOption icon={archive} text="Archive" />
              </Link>
            </Box>
          )}
        </Box>
      </Box>
      <hr className="divider" />
    </Box>
  );
}

export default Home;
