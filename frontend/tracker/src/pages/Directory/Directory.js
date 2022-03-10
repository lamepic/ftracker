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
import { fetchSubfolders } from "../../http/directory";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

function Directory() {
  const [store, dispatch] = useStateValue();
  const params = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState();
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [openCreateFileModal, setOpenCreateFileModal] = useState(false);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    setFolders([]);
    _fetchFolders();
    setLoading(false);
  }, [params]);

  useEffect(() => {});

  const _fetchFolders = async () => {
    const res = await fetchSubfolders(store.token, params.slug);
    const data = res.data[0];
    setFolders(data);
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
          <Text
            marginTop="20px"
            _hover={{ cursor: "pointer" }}
            fontSize="0.8rem"
            color="var(--dark-brown)"
            fontWeight="500"
          >
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                onClick={() => history.push(`/dashboard/archive/`)}
              >
                Archive
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
                    {breadcrumb.name}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </Text>

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
                {folders.children?.map((folder) => {
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
        />
      )}
      {openCreateFileModal && (
        <CreateFileModal
          setOpenCreateFileModal={setOpenCreateFileModal}
          openCreateFileModal={openCreateFileModal}
        />
      )}
    </>
  );
}

export default Directory;
