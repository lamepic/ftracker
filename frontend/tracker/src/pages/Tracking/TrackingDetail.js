import React, { useEffect, useState } from "react";
import "./Tracking.css";
import { fetchTracking } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import Modal from "antd/lib/modal/Modal";
import { CircularProgress, Text } from "@chakra-ui/react";
import { Popover, Steps } from "antd";

function TrackingDetail() {
  const [store, dispatch] = useStateValue();
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentId = store.trackingDocId;

  const _fetchTracking = async () => {
    const res = await fetchTracking(store.token, documentId);
    const data = res.data;
    setTracking(data);
    setLoading(false);
  };

  useEffect(() => {
    _fetchTracking();
  }, []);

  const handleOk = () => {
    dispatch({
      type: actionTypes.SET_OPEN_TRACKING_MODAL,
      payload: false,
    });
    dispatch({
      type: actionTypes.SET_TRACKING_DOC_ID,
      payload: null,
    });
  };

  return (
    <div>
      <Modal
        title="Tracker"
        visible={store.openTrackingModal}
        onCancel={handleOk}
        footer={null}
        width={800}
        centered
      >
        {!loading ? (
          <Steps
            size="small"
            current={tracking.length - 1}
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              overflowX: "none",
              padding: "20px",
            }}
          >
            {tracking.map((label, idx) =>
              tracking.length - 1 !== idx ? (
                <Steps.Step
                  description={label.name}
                  style={{ marginBottom: "2em" }}
                  title={
                    <Popover
                      content={
                        <>
                          <Text
                            fontSize="0.8rem"
                            fontWeight="500"
                            color="var(--dark-brown)"
                          >
                            Department: {label.department}
                          </Text>
                          <Text
                            fontSize="0.8rem"
                            fontWeight="500"
                            color="var(--dark-brown)"
                          >
                            Date: Don't forget to add timestamp to db
                          </Text>
                        </>
                      }
                    >
                      <Text _hover={{ cursor: "pointer" }}>Forwarded</Text>
                    </Popover>
                  }
                  key={idx}
                />
              ) : (
                <Steps.Step
                  description={label.name}
                  style={{ marginBottom: "2em" }}
                  title={
                    <Popover
                      content={
                        <>
                          <Text
                            fontSize="0.8rem"
                            fontWeight="500"
                            color="var(--dark-brown)"
                          >
                            Department: {label.department}
                          </Text>
                          <Text
                            fontSize="0.8rem"
                            fontWeight="500"
                            color="var(--dark-brown)"
                          >
                            Date: Don't forget to add timestamp to db
                          </Text>
                        </>
                      }
                    >
                      <Text _hover={{ cursor: "pointer" }}>In progress</Text>
                    </Popover>
                  }
                  key={idx}
                />
              )
            )}
          </Steps>
        ) : (
          <div className="loading__spinner">
            <CircularProgress />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TrackingDetail;
