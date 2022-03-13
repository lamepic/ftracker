import React from "react";
import Home from "../Home/Home";
import Flow from "../Flow/Flow";
import Archive from "../Archive/Archive";
import Incoming from "../Incoming/Incoming";
import Outgoing from "../Outgoing/Outgoing";
import Tracking from "../Tracking/Tracking";
import Directory from "../Directory/Directory";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import TrackingDetail from "../Tracking/TrackingDetail";
import ProtectedPage from "../../utility/ProtectedPage";
import ViewDocument from "../ViewDocument/ViewDocument";
import { useStateValue } from "../../store/StateProvider";
import { Box, useDisclosure } from "@chakra-ui/react";
import CreateDocument from "../CreateDocument/CreateDocument";
import ActivateDocument from "../ActivateDocument/ActivateDocument";
import ActivatedDocView from "../ActivateDocument/ActivatedDocView";
import useFetchCount from "../../hooks/useFetchCount";
import useFetchUser from "../../hooks/useFetchUser";

function Dashboard() {
  useFetchCount(true, true, true, true);
  const user = useFetchUser();
  const [store, dispatch] = useStateValue();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="var(--background-color)" h="100vh">
      {user !== null && (
        <Box
          display="flex"
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
              {/* <Route path="*" component={() => <p>404</p>} /> */}
              <ProtectedPage path="/dashboard/create-flow" component={Flow} />
              {store.openTrackingModal && <TrackingDetail />}
            </main>
          </Box>
          {/* <Box
            position="fixed"
            right={{ sm: "60px", lg: "68px" }}
            bottom={{ sm: "10px", lg: "20px" }}
          >
            <Link to="/dashboard/add-document">
              <Image src={addIcon} boxSize="45px" />
            </Link>
          </Box> */}
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
