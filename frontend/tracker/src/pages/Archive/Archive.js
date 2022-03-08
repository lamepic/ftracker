import React, { useEffect, useState } from "react";

import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchUserArchive } from "../../http/document";
import Loading from "../../components/Loading/Loading";
import { Box, Grid, Text } from "@chakra-ui/react";
import { FileAddOutlined, FolderAddOutlined } from "@ant-design/icons";

function Archive() {
  const [store] = useStateValue();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  const archiveCount = store.archiveCount;

  const _fetchUserArchive = async () => {
    const res = await fetchUserArchive(store.token, store.user.staff_id);
    const data = res.data;
    setArchive(data);
  };

  useEffect(() => {
    _fetchUserArchive();
    setLoading(false);
  }, []);

  if (archiveCount === 0) {
    return <EmptyPage type="archived" />;
  }

  return (
    <>
      <Box>
        <Box marginTop="10px">
          <Box display="flex" alignItems="center">
            <Text
              as="h2"
              fontSize={{ sm: "1.5rem", lg: "1.7rem" }}
              color="var(--dark-brown)"
              fontWeight="600"
            >
              Archive
            </Text>
            <Box
              marginLeft="30px"
              display="flex"
              alignItems="center"
              // w="100%"
              // padding="5px"
            >
              <Box
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "var(--lightest-brown)",
                }}
                marginRight="10px"
                padding="5px"
              >
                <FolderAddOutlined
                  style={{ color: "var(--dark-brown)", fontSize: "1.5rem" }}
                />
              </Box>
              <Box
                _hover={{
                  cursor: "pointer",
                  backgroundColor: "var(--lightest-brown)",
                }}
                padding="5px"
              >
                <FileAddOutlined
                  style={{ color: "var(--dark-brown)", fontSize: "1.5rem" }}
                />
              </Box>
            </Box>
          </Box>
          {!loading ? (
            <Box
              maxH={{ sm: "100vh", lg: "80vh" }}
              overflowY="auto"
              marginTop="10px"
            >
              <Grid
                templateColumns={{ sm: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}
                gap={6}
              >
                {archive.map((item) => {
                  if (item.document.related_document.length > 0) {
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

export default Archive;
