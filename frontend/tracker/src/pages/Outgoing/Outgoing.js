import React, { useEffect, useState } from "react";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchOutgoing } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import { Box, Grid, Text } from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading";

function Outgoing() {
  const [store] = useStateValue();
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const outgoingCount = store.outgoingCount;

  const _fetchOutgoing = async () => {
    try {
      const res = await fetchOutgoing(store.token);
      const data = res.data;
      setOutgoing(data);
    } catch (e) {
      console.log(e.response);
    }
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
      <Box>
        <Box marginTop="10px">
          <Text
            as="h2"
            fontSize={{ sm: "1.5rem", lg: "1.7rem" }}
            color="var(--dark-brown)"
            fontWeight="600"
          >
            Pending
          </Text>
          {!loading ? (
            <Box maxH={{ sm: "100vh", lg: "80vh" }} overflowY="auto">
              <Grid templateColumns="repeat(6, 1fr)" gap={6}>
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

export default Outgoing;
