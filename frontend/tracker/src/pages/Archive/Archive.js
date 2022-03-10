import React, { useEffect, useState } from "react";

import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchUserArchive } from "../../http/document";
import Loading from "../../components/Loading/Loading";
import { Box, Grid, Text } from "@chakra-ui/react";
import { FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import ToolbarOption from "../../components/Navbar/ToolbarOption";
import CreateFolderModal from "../../components/CustomModals/CreateFolderModal";
import CreateFileModal from "../../components/CustomModals/CreateFileModal";
import { fetchFolders } from "../../http/directory";
import DirectoryIcon from "../../components/Doc/DirectoryIcon";
import * as actionTypes from "../../store/actionTypes";
import DirectoryFileIcon from "../../components/Doc/DirectoryFileIcon";
import Preview from "../../components/Preview/Preview";

function Archive() {
  const [store, dispatch] = useStateValue();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [openCreateFileModal, setOpenCreateFileModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewDoc, setPreviewDoc] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  const archiveCount = store.archiveCount;

  const _fetchUserArchive = async () => {
    const res = await fetchUserArchive(store.token, store.user.staff_id);
    const data = res.data;
    setArchive(data);
  };

  const _fetchFolders = async () => {
    const res = await fetchFolders(store.token);
    const data = res.data;
    setFolders(data);
    dispatch({
      type: actionTypes.CLEAR_BREADCRUMBS,
    });
  };

  useEffect(() => {
    _fetchUserArchive();
    _fetchFolders();
    setLoading(false);
  }, []);

  if (archiveCount === 0) {
    return <EmptyPage type="archived" />;
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
            Archive
          </Text>
          <Box display="flex" alignItems="center" marginTop="5px" bg="#eaeaea">
            <ToolbarOption
              text="New Folder"
              Icon={FolderAddOutlined}
              openModal={setOpenCreateFolderModal}
            />
            <ToolbarOption
              text="Upload File"
              Icon={UploadOutlined}
              openModal={setOpenCreateFileModal}
            />
          </Box>
          {!loading ? (
            <Box
              maxH={{ sm: "100vh", lg: "80vh" }}
              overflowY="auto"
              marginTop="20px"
            >
              <Grid
                templateColumns={{ sm: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}
                gap={6}
              >
                {archive.map((item) => {
                  if (
                    item.document.related_document.length > 0 &&
                    item.closed_by !== null
                  ) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="archive"
                      />
                    );
                  } else if (item.closed_by !== null) {
                    return (
                      <File doc={item} key={item.document.id} type="archive" />
                    );
                  } else if (item.closed_by === null) {
                    return (
                      <DirectoryFileIcon
                        key={item.document.id}
                        setPreviewDoc={setPreviewDoc}
                        setOpenPreview={setOpenPreview}
                        document={item.document}
                      />
                    );
                  }
                })}

                {folders.map((folder) => {
                  return (
                    <DirectoryIcon
                      name={folder.name}
                      key={folder.id}
                      slug={folder.slug}
                    />
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <Loading />
          )}
        </Box>
      </Box>
      {openCreateFolderModal && (
        <CreateFolderModal
          setOpenCreateFolderModal={setOpenCreateFolderModal}
          openCreateFolderModal={openCreateFolderModal}
          addFolder={setFolders}
          parentFolder={folders}
        />
      )}
      {openCreateFileModal && (
        <CreateFileModal
          setOpenCreateFileModal={setOpenCreateFileModal}
          openCreateFileModal={openCreateFileModal}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      {openPreview && (
        <Preview setOpenPreview={setOpenPreview} doc={previewDoc} />
      )}
    </>
  );
}

export default Archive;
