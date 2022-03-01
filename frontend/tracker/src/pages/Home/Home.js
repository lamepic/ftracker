import React, { useEffect } from "react";
import "./Home.css";
import { Box, Image } from "@chakra-ui/react";
import * as actionTypes from "../../store/actionTypes";
import dashboard_hero from "../../assets/icons/dashboard-hero-icon.svg";
import incoming_icon from "../../assets/icons/incoming-tray-icon.svg";
import outgoing_icon from "../../assets/icons/outgoing-tray-icon.svg";
import addIcon from "../../assets/icons/add-icon.svg";
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
    <Box h="65vh">
      <Box h="100%" display="flex" flexDirection="column">
        <Box
          position="relative"
          marginTop="20px"
          margin="auto"
          // border="1px solid red"
        >
          <img
            src={dashboard_hero}
            className="dashboard__hero-img"
            alt="dashboard-hero"
          />
          <div className="dashboard-hero-background"></div>
          <div className="hero__text">
            <h3 className="hero__title">Hi, {userInfo.first_name}</h3>
            <h4 className="hero__subtitle">
              Ready to start your day with Documents Tracker?
            </h4>
          </div>
        </Box>

        <Box display="flex" alignItems="center" marginTop="1rem">
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
      <Box position="absolute" right="20px" bottom="20px">
        <Link to="/dashboard/add-document">
          <Image src={addIcon} boxSize="45px" />
        </Link>
      </Box>
    </Box>
  );
}

export default Home;
