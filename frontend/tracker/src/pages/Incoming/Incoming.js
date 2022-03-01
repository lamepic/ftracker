import React, { useEffect, useState } from "react";
import "./Incoming.css";
import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchIncoming } from "../../http/document";
import { Box, Image } from "@chakra-ui/react";
import addIcon from "../../assets/icons/add-icon.svg";
import Loading from "../../components/Loading/Loading";
import { notification } from "antd";

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: "Error",
    description,
  });
};

function Incoming() {
  const [store] = useStateValue();
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const incomingCount = store.incomingCount;

  const _fetchIncoming = async () => {
    try {
      const res = await fetchIncoming(store.token);
      const data = res.data;
      setIncoming(data);
    } catch (e) {
      openNotificationWithIcon("error", e.response.data.detail);
    }
  };

  useEffect(() => {
    _fetchIncoming();
    setLoading(false);
  }, []);

  if (incomingCount === 0) {
    return <EmptyPage type="incoming" />;
  }

  return (
    <>
      <div className="incoming">
        <div className="incoming__container">
          <h2 className="incoming__header">Received</h2>
          {!loading ? (
            <div className="incoming__content">
              <div className="incoming__items">
                {incoming.map((item) => {
                  if (item.related_document.length > 0) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="incoming"
                      />
                    );
                  } else {
                    return (
                      <File doc={item} key={item.document.id} type="incoming" />
                    );
                  }
                })}
              </div>
              <Box position="absolute" right="20px" bottom="20px">
                <Link to="/dashboard/add-document">
                  <Image src={addIcon} boxSize="45px" />
                </Link>
              </Box>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
}

export default Incoming;
