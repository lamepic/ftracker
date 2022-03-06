import React, { useEffect, useState } from "react";
import "./Tracking.css";
import { fetchTracking } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import Modal from "antd/lib/modal/Modal";
import { CircularProgress } from "@chakra-ui/react";
import { Steps } from "antd";

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
                  title="Forwarded"
                  key={idx}
                />
              ) : (
                <Steps.Step
                  description={label.name}
                  style={{ marginBottom: "2em" }}
                  title="In progress"
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