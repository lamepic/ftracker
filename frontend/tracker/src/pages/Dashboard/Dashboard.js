import React, { useEffect } from "react";
import { loadUser } from "../../http/user";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import { Box, Image, useDisclosure } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { Link, Route } from "react-router-dom";
import Home from "../Home/Home";
import Incoming from "../Incoming/Incoming";
import Outgoing from "../Outgoing/Outgoing";
import {
  fetchArchiveCount,
  fetchIncomingCount,
  fetchOutgoingCount,
  notificationsCount,
} from "../../http/document";
import CreateDocument from "../CreateDocument/CreateDocument";
import Tracking from "../Tracking/Tracking";
import TrackingDetail from "../Tracking/TrackingDetail";
import ViewDocument from "../ViewDocument/ViewDocument";
import ProtectedPage from "../../utility/ProtectedPage";
import Archive from "../Archive/Archive";
import ActivateDocument from "../ActivateDocument/ActivateDocument";
import ActivatedDocView from "../ActivateDocument/ActivatedDocView";
import Flow from "../Flow/Flow";
import addIcon from "../../assets/icons/add-icon.svg";
import Directory from "../Directory/Directory";

function Dashboard() {
  const [store, dispatch] = useStateValue();
  const token = store.token;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchUser = async () => {
    try {
      const res = await loadUser(token);
      dispatch({
        type: actionTypes.USER_LOADED,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: actionTypes.AUTH_ERROR,
      });
    }
  };

  const _fetchIncomingCount = async () => {
    const res = await fetchIncomingCount(store.token);
    const data = res.data.count;
    dispatch({
      type: actionTypes.SET_INCOMING_COUNT,
      payload: data,
    });
  };

  const _fetchArchiveCount = async () => {
    const res = await fetchArchiveCount(store.token);
    const data = res.data.count;
    dispatch({
      type: actionTypes.SET_ARCHIVE_COUNT,
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

  const fetchNotifications = async () => {
    const res = await notificationsCount(store.token);
    const data = res.data;
    dispatch({
      type: actionTypes.SET_NOTIFICATIONS_COUNT,
      payload: data.count,
    });
  };

  useEffect(() => {
    fetchUser();
    _fetchIncomingCount();
    _fetchOutgoingCount();
    _fetchArchiveCount();
    fetchNotifications();
  }, []);

  return (
    <Box bg="var(--background-color)" h="100vh">
      {store.user !== null && (
        <Box
          display="flex"
          // minH="100%"
          maxW={{ sm: "750px", lg: "100%" }}
          margin={{ sm: "auto" }}
        >
          <Box flex={{ sm: "0", lg: "0.1" }}>
            <Sidebar onClose={onClose} isOpen={isOpen} />
          </Box>
          <Box
            flex={{ sm: "1", lg: "0.8" }}
            minH="100%"
            marginX="auto"
            // paddingX="1.5rem"
            // marginLeft={{ lg: "30px" }}
            h="100vh"
            overflow="auto"
          >
            <Navbar onOpen={onOpen} />
            <main>
              <Route exact path="/dashboard" component={Home} />
              <Route path="/dashboard/incoming" component={Incoming} />
              <Route path="/dashboard/outgoing" component={Outgoing} />
              <Route
                path="/dashboard/add-document"
                component={CreateDocument}
              />
              <Route
                path={`/dashboard/document/:type/:id/`}
                component={ViewDocument}
              />
              <ProtectedPage
                exact
                path="/dashboard/archive/"
                component={Archive}
              />

              <Route path="/dashboard/tracker" component={Tracking} />

              <Route
                path="/dashboard/activate-document"
                component={ActivateDocument}
              />
              <Route
                path="/dashboard/activated-document"
                component={ActivatedDocView}
              />
              <Route
                exact
                path="/dashboard/archive/:slug"
                component={Directory}
              />

              <ProtectedPage path="/dashboard/create-flow" component={Flow} />
              {store.openTrackingModal && <TrackingDetail />}
            </main>
          </Box>
          <Box
            position="fixed"
            right={{ sm: "60px", lg: "68px" }} //use this when you reset the width to default
            bottom={{ sm: "10px", lg: "20px" }}

            // right={{ sm: "10px", lg: "135px" }}
            // bottom={{ sm: "300px", lg: "20px" }}
          >
            <Link to="/dashboard/add-document">
              <Image src={addIcon} boxSize="45px" />
            </Link>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
