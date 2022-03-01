import { Box, CircularProgress, Heading, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import "./Navbar.css";
import Search from "../Input/Search";
import { BellFilled, DownOutlined } from "@ant-design/icons";
import { useStateValue } from "../../store/StateProvider";
import { logout } from "../../http/auth";
import * as actionTypes from "../../store/actionTypes";
import { useHistory } from "react-router-dom";
import { fetchActivateDocument, fetchRequest } from "../../http/document";
import { Menu, Dropdown } from "antd";
import CustomBadge from "../Badge/CustomBadge";
import moment from "moment";

const MenuDropDown = ({ userInfo, handleLogout }) => {
  const menu = (
    <Menu>
      <Menu.Item key="000" onClick={handleLogout}>
        <Text color="var(--light-brown)" fontWeight="400" fontSize="16px">
          Logout
        </Text>
      </Menu.Item>
    </Menu>
  );

  return (
    <Box _hover={{ cursor: "pointer" }}>
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <span
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            isTruncated
            fontSize="1.1rem"
            color="#9D4D01"
            fontWeight="600"
            maxW="150px"
            marginLeft="5px"
          >
            {userInfo.first_name} {userInfo.last_name}
          </Text>{" "}
          <DownOutlined
            style={{
              fontSize: "0.8rem",
              color: "#9D4D01",
              fontWeight: "600",
              marginLeft: "2px",
            }}
          />
        </span>
      </Dropdown>
    </Box>
  );
};

function NotificationDropDown() {
  const history = useHistory();
  const [store, dispatch] = useStateValue();
  const [pendingRequest, setPendingRequest] = useState([]);
  const [activatedDocuments, setActivatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (event) => {
    fetchPendingRequest();
  };

  const fetchPendingRequest = async () => {
    const requestRes = await fetchRequest(store.token);
    const requestData = requestRes.data;
    setPendingRequest(requestData);
    const activatedDocumentRes = await fetchActivateDocument(store.token);
    const activatedDocumentData = activatedDocumentRes.data;
    setActivatedDocuments(activatedDocumentData);
    setLoading(false);
  };

  const handleRequest = (details) => {
    dispatch({
      type: actionTypes.SET_REQUEST_DETAILS,
      payload: details,
    });
    history.push("/dashboard/activate-document");
  };

  const handleOpenActivatedDoc = (details) => {
    dispatch({
      type: actionTypes.SET_ACTIVATED_DOCUMENTS_DETAILS,
      payload: details,
    });
    history.push("/dashboard/activated-document");
  };

  const menu = (
    <Menu>
      <Menu.Item key="0101">
        <div className="request__header" key="00">
          <BellFilled
            style={{ fontSize: "22px", color: "var(--dark-brown)" }}
          />
          <p>Notifications</p>
        </div>
      </Menu.Item>
      {!loading ? (
        pendingRequest.map((request) => {
          const id = request.id;
          const name = `${request.requested_by.first_name} ${request.requested_by.last_name}`;
          const document = request.document.subject;
          const department = request.requested_by.department.name;
          const date = new Date(request.created_at);
          return (
            <Menu.Item onClick={() => handleRequest(request)} key={id}>
              <div className="request">
                <div className="request__content">
                  <div className="request_from">
                    <Text
                      color="var(--dark-brown)"
                      fontWeight="600"
                      fontSize="15px"
                    >
                      {name}
                    </Text>
                  </div>
                  <p className="request_department">{department}</p>
                  <p className="document__name">{document}</p>
                </div>
                <p className="request__date">{moment(date).fromNow()}</p>
              </div>
            </Menu.Item>
          );
        })
      ) : (
        <Menu.Item key="01">
          <div className="notification__loading">
            <CircularProgress color="inherit" />
          </div>
        </Menu.Item>
      )}
      {activatedDocuments.map((doc) => {
        const id = doc.id;
        const name = `${doc.document_sender.first_name} ${doc.document_sender.last_name}`;
        const document = doc.document.subject;
        const date = new Date(doc.date_activated);

        return (
          <Menu.Item onClick={() => handleOpenActivatedDoc(doc)} key={id}>
            <div className="request">
              <div className="request__content">
                <div className="request_from">
                  <Text
                    color="var(--dark-brown)"
                    fontWeight="600"
                    fontSize="15px"
                  >
                    {name}
                  </Text>
                </div>
                <p className="activate__msg">Document request granted</p>
                <p className="activate__document__name">{document}</p>
              </div>
              <p className="request__date">{moment(date).fromNow()}</p>
            </div>
          </Menu.Item>
        );
      })}
      {!loading && store.notificationsCount === 0 && (
        <Menu.Item key="001">
          <div className="request">
            <p className="empty__request">You have 0 Notifications</p>
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Box onClick={handleClick} position="relative">
      <CustomBadge
        count={store.notificationsCount}
        size="20px"
        position={{ top: "0", right: "0" }}
      />
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        placement="bottomCenter"
        arrow
      >
        <BellFilled style={{ fontSize: "32px", color: "var(--dark-brown)" }} />
      </Dropdown>
    </Box>
  );
}

function Navbar() {
  const [store, dispatch] = useStateValue();

  const userInfo = store.user;
  const getDay = () => {
    const event = new Date();
    const options = { weekday: "long" };
    return event.toLocaleDateString("en-US", options);
  };

  const getMonth = () => {
    const event = new Date();
    const options = { month: "long" };
    return event.toLocaleDateString("en-US", options);
  };

  const handleLogout = async () => {
    const res = await logout(store.token);
    if (res.status === 200) {
      dispatch({
        type: actionTypes.LOGOUT_SUCCESS,
      });
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 15px 15px 0"
    >
      <Box>
        <Heading as="h2" fontSize="1.2rem">
          Dashboard
        </Heading>
        <Heading as="h3" fontSize="0.8rem" color="var(--dark-brown)">
          {getDay()}{" "}
          <Text
            color="var(--light-brown)"
            display="inline"
            fontWeight="600"
          >{`${new Date().getDate()} ${getMonth()} ${new Date().getFullYear()}`}</Text>
        </Heading>
      </Box>
      <Box>
        <Search />
      </Box>
      <Box _hover={{ cursor: "pointer" }}>
        {/* <CustomBadge
          count={store.notificationsCount}
          size="20px"
          position={{ top: "0", right: "0" }}
        /> */}
        <NotificationDropDown />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          className="initials"
          display="inline"
          bg="var(--lighter-brown)"
          padding="5px 8px"
          borderRadius="5px"
          textTransform="uppercase"
          color="var(--dark-brown)"
          fontWeight="600"
          fontSize="17px"
        >{`${userInfo.first_name[0]}${userInfo.last_name[0]}`}</Text>
        <MenuDropDown userInfo={userInfo} handleLogout={handleLogout} />
      </Box>
    </Box>
  );
}

export default Navbar;
