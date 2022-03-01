import React from "react";
import "./TrackingCard.css";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import { Button, Card } from "antd";
import { Box, Text } from "@chakra-ui/react";

function TrackingCard({ receiver, deparment, document, id, meta_info }) {
  const [store, dispatch] = useStateValue();

  const openTrackingDetail = () => {
    dispatch({
      type: actionTypes.SET_TRACKING_DOC_ID,
      payload: id,
    });

    dispatch({
      type: actionTypes.SET_OPEN_TRACKING_MODAL,
      payload: true,
    });
  };
  return (
    <Card
      style={{
        width: 400,
        backgroundColor: "var(--lightest-brown)",
        marginBottom: "10px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Text fontSize="16px" color="var(--dark-brown)" fontWeight="600">
            Sent To: {receiver}
          </Text>
          <Text fontSize="16px">Department: {deparment} </Text>
          <Text fontSize="16px">Document: {document} </Text>
        </Box>
        <Box>
          <Button onClick={() => openTrackingDetail()}>Track</Button>
        </Box>
      </Box>
    </Card>
  );
}

export default TrackingCard;
