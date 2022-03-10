import React, { useEffect, useState } from "react";
import { FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import { Box, Grid, Text } from "@chakra-ui/react";
import { Breadcrumb } from "antd";
import { useHistory, useParams } from "react-router-dom";
import CreateFileModal from "../../components/CustomModals/CreateFileModal";
import CreateFolderModal from "../../components/CustomModals/CreateFolderModal";
import DirectoryIcon from "../../components/Doc/DirectoryIcon";
import Loading from "../../components/Loading/Loading";
import ToolbarOption from "../../components/Navbar/ToolbarOption";
import { fetchFiles, fetchSubfolders } from "../../http/directory";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import DirectoryFileIcon from "../../components/Doc/DirectoryFileIcon";
import Preview from "../../components/Preview/Preview";

function Directory() {
  const [store, dispatch] = useStateValue();
  const params = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState();
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [openCreateFileModal, setOpenCreateFileModal] = useState(false);
  const [folder, setFolder] = useState({});
  const [files, setFiles] = useState();
  const [previewDoc, setPreviewDoc] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => {
    setFolder({});
    _fetchFolders();
    setLoading(false);
  }, [params]);

  useEffect(() => {});

  const _fetchFolders = async () => {
    const res = await fetchSubfolders(store.token, params.slug);
    const data = res.data[0];
    setFolder(data);
    _fetchFiles(data.id);
    console.log(data);
  };

  const _fetchFiles = async (id) => {
    const res = await fetchFiles(store.token, id);
    const data = res.data;
    console.log(data);
  };

  return (
    <>
      <Box>
        <Box marginTop="20px">
          <Box
            display="flex"
            alignItems="center"
            marginTop="5px"
            borderTop="0.5px solid #000"
            borderBottom="0.5px solid #000"
          >
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
          <Box marginTop="20px">
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                onClick={() => history.push(`/dashboard/archive/`)}
              >
                <Text
                  _hover={{ cursor: "pointer" }}
                  fontSize="0.9rem"
                  // color="var(--dark-brown)"
                  fontWeight="500"
                  as="span"
                >
                  Archive
                </Text>
              </Breadcrumb.Item>
              {store.breadcrumbs.map((breadcrumb, idx) => {
                return (
                  <Breadcrumb.Item
                    onClick={() => {
                      dispatch({
                        type: actionTypes.REMOVE_BREADCRUMBS,
                        payload: idx,
                      });
                      history.push(`/dashboard/archive/${breadcrumb.slug}`);
                    }}
                    key={breadcrumb.slug}
                  >
                    <Text
                      _hover={{ cursor: "pointer" }}
                      fontSize="0.9rem"
                      // color="var(--dark-brown)"
                      fontWeight="500"
                      as="span"
                    >
                      {breadcrumb.name}
                    </Text>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </Box>
          {!loading ? (
            <Box
              maxH={{ sm: "100vh", lg: "80vh" }}
              overflowY="auto"
              marginTop="20px"
            >
              <Grid
                templateColumns={{
                  sm: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                }}
                gap={6}
              >
                {folder.documents?.map((document) => {
                  return (
                    <DirectoryFileIcon
                      key={document.id}
                      setPreviewDoc={setPreviewDoc}
                      setOpenPreview={setOpenPreview}
                      document={document}
                    />
                  );
                })}
                {folder.children?.map((folder) => {
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
          folderId={folder.id}
          appendSubFolder={setFolder}
          parentFolder={folder}
        />
      )}
      {openCreateFileModal && (
        <CreateFileModal
          setOpenCreateFileModal={setOpenCreateFileModal}
          openCreateFileModal={openCreateFileModal}
        />
      )}
      {openPreview && (
        <Preview setOpenPreview={setOpenPreview} doc={previewDoc} />
      )}
    </>
  );
}

export default Directory;
