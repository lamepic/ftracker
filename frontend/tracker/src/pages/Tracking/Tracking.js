import React, { useEffect, useState } from "react";
import "./Tracking.css";
import { Box } from "@chakra-ui/react";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import Loading from "../../components/Loading/Loading";
import TrackingCard from "../../components/TrackingCard/TrackingCard";
import { fetchOutgoing } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";

function Tracking() {
  const [store] = useStateValue();
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const outgoingCount = store.outgoingCount;

  const _fetchOutgoing = async () => {
    const res = await fetchOutgoing(store.token);
    const data = res.data;
    setOutgoing(data);
    setLoading(false);
  };

  useEffect(() => {
    _fetchOutgoing(store.token);
  }, []);

  if (outgoingCount === 0) {
    return <EmptyPage type="tracking" />;
  }
  return (
    <Box>
      <h2 className="tracking__header">Document Tracking</h2>
      <hr className="divider" />
      {!loading ? (
        <div className="tracking__content">
          {outgoing.map((item) => {
            const user = item.receiver;
            const user_department = item.receiver.department?.name;
            const doc = item.document.subject;
            const id = item.document.id;
            const meta_info = item.meta_info;

            return (
              <TrackingCard
                key={item.id}
                receiver={`${user.first_name} ${user.last_name}`}
                deparment={user_department}
                document={doc}
                id={id}
                meta_info={meta_info}
              />
            );
          })}
        </div>
      ) : (
        <Loading />
      )}
    </Box>
  );
}

export default Tracking;
