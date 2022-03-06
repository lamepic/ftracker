import React, { useEffect } from "react";
import { loadUser } from "../../http/user";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import { Box, Container } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { Route } from "react-router-dom";
import Home from "../Home/Home";
import Incoming from "../Incoming/Incoming";
import Outgoing from "../Outgoing/Outgoing";
import {
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

function Dashboard() {
  const [store, dispatch] = useStateValue();
  const token = store.token;

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
    fetchNotifications();
  }, []);

  return (
    <Box
      bg="var(--background-color)"
      h="100vh"
      // minW="max"
    >
      {store.user !== null && (
        <Box
          display="flex"
          minH="100%"
          maxW={{ sm: "750px", lg: "100%" }}
          margin={{ sm: "auto" }}
        >
          <Box flex={{ sm: "0", lg: "0.1" }}>
            <Sidebar />
          </Box>
          <Box
            flex={{ sm: "1", lg: "0.8" }}
            minH="100%"
            marginX="auto"
            // marginLeft={{ lg: "30px" }}
          >
            <Navbar />
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
              <ProtectedPage path="/dashboard/archive" component={Archive} />

              <Route path="/dashboard/tracker" component={Tracking} />

              <Route
                path="/dashboard/activate-document"
                component={ActivateDocument}
              />
              <Route
                path="/dashboard/activated-document"
                component={ActivatedDocView}
              />
              <ProtectedPage path="/dashboard/create-flow" component={Flow} />
              {store.openTrackingModal && <TrackingDetail />}
            </main>
          </Box>
        </Box>
      )}
      {/* <Box
        border="1px solid blue"
        h="100vh"
        // maxW="container.xl"
        // h="100%"
        // display="grid"
        // placeItems="center"
      >
        {store.user !== null && (
          <Box
            display="flex"
            flexDirection="row"
            // alignItems="center"
            // h="90%"
            // w="90%"
            // margin="auto"
            bg="yellow"
          >
            <Sidebar />
            <Box w="100%" position="relative" h="100%" marginLeft="30px">
              <Navbar />
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
                <ProtectedPage path="/dashboard/archive" component={Archive} />

                <Route path="/dashboard/tracker" component={Tracking} />

                <Route
                  path="/dashboard/activate-document"
                  component={ActivateDocument}
                />
                <Route
                  path="/dashboard/activated-document"
                  component={ActivatedDocView}
                />
                <ProtectedPage path="/dashboard/create-flow" component={Flow} />
                {store.openTrackingModal && <TrackingDetail />}
              </main>
            </Box>
          </Box>
        )}
      </Box> */}
    </Box>
  );
}

export default Dashboard;
