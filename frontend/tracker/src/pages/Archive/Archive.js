import React, { useEffect, useState } from "react";

import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/Doc/Folder";
import File from "../../components/Doc/File";
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
import { notification } from "antd";
import Toolbar from "../../components/Navbar/Toolbar";
import TableData from "../../components/DataDisplay/TableData";
import { capitalize } from "../../utility/helper";
import moment from "moment";

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

  const _fetchUserArchive = async () => {
    try {
      const res = await fetchUserArchive(store.token, store.user.staff_id);
      const data = res.data;
      setArchive(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
  };

  const _fetchFolders = async () => {
    try {
      const res = await fetchFolders(store.token);
      const data = res.data;
      setFolders(data);
      dispatch({
        type: actionTypes.CLEAR_BREADCRUMBS,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
  };

  useEffect(() => {
    _fetchUserArchive();
    _fetchFolders();
  }, []);

  const folderData = folders.map((folder) => {
    return {
      key: folder.id,
      name: (
        <DirectoryIcon name={folder.name} key={folder.id} slug={folder.slug} />
      ),
      date_created: null,
      type: "Folder",
      foldername: folder.name,
      created_at: moment(folder.created_at).format("DD/MM/YYYY hh:mm A"),
      subject: "-",
    };
  });

  const archiveData = archive.map((item) => {
    let name = null;
    if (item.document.related_document.length > 0 && item.closed_by !== null) {
      name = <Folder doc={item} key={item.document.id} type="archive" />;
    } else if (item.closed_by !== null) {
      name = <File doc={item} key={item.document.id} type="archive" />;
    } else {
      name = (
        <DirectoryFileIcon
          key={item.document.id}
          setPreviewDoc={setPreviewDoc}
          setOpenPreview={setOpenPreview}
          document={item.document}
        />
      );
    }
    return {
      name: name,
      subject: item.document.subject,
      created_at: moment(item.created_at).format("DD/MM/YYYY hh:mm A"),
      type: "File",
      key: item.document.id,
      filename: item.document.filename,
    };
  });

  if (loading) {
    return <Loading />;
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
          <Toolbar>
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
          </Toolbar>
          {archive.length + folders.length > 0 ? (
            <Box
              // maxH={{ sm: "100vh", lg: "70vh" }}
              // overflowY="auto"
              marginTop="20px"
            >
              {/* <Grid
                templateColumns={{ sm: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}
                gap={6}
              > */}
              {/* {archive.map((item) => {
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
                  } else {
                    return (
                      <DirectoryFileIcon
                        key={item.document.id}
                        setPreviewDoc={setPreviewDoc}
                        setOpenPreview={setOpenPreview}
                        document={item.document}
                      />
                    );
                  }
                })} */}

              {/* {folders.map((folder) => {
                  return (
                    <DirectoryIcon
                      name={folder.name}
                      key={folder.id}
                      slug={folder.slug}
                    />
                  );
                })} */}
              {/* </Grid> */}
              <TableData data={[...archiveData, ...folderData]} />
            </Box>
          ) : (
            <Box>
              <Text
                textAlign="center"
                as="h3"
                color="var(--light-brown)"
                fontSize="3rem"
                textTransform="uppercase"
                marginTop="10rem"
              >
                Archive is Empty
              </Text>
            </Box>
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
          appendFileToArchive={setArchive}
          parentFolder={archive}
        />
      )}
      {openPreview && (
        <Preview setOpenPreview={setOpenPreview} doc={previewDoc} />
      )}
    </>
  );
}

export default Archive;
