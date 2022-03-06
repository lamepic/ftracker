import React, { useEffect, useState } from "react";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchIncoming } from "../../http/document";
import { Box, Grid, Text } from "@chakra-ui/react";
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
      <Box>
        <Box marginTop="10px">
          <Text
            as="h2"
            fontSize={{ sm: "1.5rem", lg: "1.7rem" }}
            color="var(--dark-brown)"
            fontWeight="600"
          >
            Received
          </Text>
          {!loading ? (
            <Box maxH={{ sm: "100vh", lg: "80vh" }} overflowY="auto">
              <Grid templateColumns="repeat(6, 1fr)" gap={6}>
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
              </Grid>
            </Box>
          ) : (
            <Loading />
          )}
        </Box>
      </Box>
    </>
  );
}

export default Incoming;
