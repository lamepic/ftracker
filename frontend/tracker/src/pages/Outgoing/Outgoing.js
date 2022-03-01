import React, { useEffect, useState } from "react";
import "./Outgoing.css";
import addIcon from "../../assets/icons/add-icon.svg";

import { Link } from "react-router-dom";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchOutgoing } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import { Box, Image } from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading";

function Outgoing() {
  const [store] = useStateValue();
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const outgoingCount = store.outgoingCount;

  const _fetchOutgoing = async () => {
    const res = await fetchOutgoing(store.token);
    const data = res.data;
    setOutgoing(data);
  };

  useEffect(() => {
    _fetchOutgoing();
    setLoading(false);
  }, []);

  if (outgoingCount === 0) {
    return <EmptyPage type="outgoing" />;
  }

  return (
    <>
      <div className="outgoing">
        <div className="outgoing__container">
          <h2 className="outgoing__header">Pending</h2>
          {!loading ? (
            <div className="outgoing__content">
              <div className="outgoing__items">
                {outgoing.map((item) => {
                  if (item.related_document.length > 0) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="outgoing"
                      />
                    );
                  } else {
                    return (
                      <File doc={item} key={item.document.id} type="outgoing" />
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

export default Outgoing;
