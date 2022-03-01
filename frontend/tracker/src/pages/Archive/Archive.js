import React, { useEffect, useState } from "react";
import "./Archive.css";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchUserArchive } from "../../http/document";
import Loading from "../../components/Loading/Loading";
import { Box, Image } from "@chakra-ui/react";
import addIcon from "../../assets/icons/add-icon.svg";

function Archive() {
  const [store] = useStateValue();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  const _fetchUserArchive = async () => {
    const res = await fetchUserArchive(store.token, store.user.staff_id);
    const data = res.data;
    console.log(data);
    setArchive(data);
  };

  useEffect(() => {
    _fetchUserArchive();
    setLoading(false);
  }, []);

  if (archive.length === 0) {
    return <EmptyPage type="archived" />;
  }

  return (
    <>
      <div className="archive">
        <div className="archive__container">
          <h2 className="archive__header">Archive</h2>
          {!loading ? (
            <div className="archive__content">
              <div className="archive__items">
                {archive.map((item) => {
                  if (item?.document.related_document?.length > 0) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="archive"
                      />
                    );
                  } else {
                    return (
                      <File doc={item} key={item.document.id} type="archive" />
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
          )}{" "}
        </div>
      </div>
    </>
  );
}

export default Archive;
