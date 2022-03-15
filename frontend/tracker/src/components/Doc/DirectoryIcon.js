import React, { useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Directory_Icon from "../../assets/icons/Directory.svg";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import { capitalize } from "../../utility/helper";
import { checkFolderEncryption } from "../../http/directory";
import { notification } from "antd";
import PasswordModal from "../CustomModals/PasswordModal";

function DirectoryIcon({ name, slug }) {
  const [store, dispatch] = useStateValue();
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);

  const handleClick = async () => {
    let data;
    try {
      const checkEncrypt = await checkFolderEncryption(store.token, slug);
      data = checkEncrypt.data;
    } catch (e) {
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }

    if (data.encrypted === true) {
      setOpenModal(true);
    } else {
      dispatch({
        type: actionTypes.SET_BREADCRUMBS,
        payload: { name, slug },
      });
      history.push(`/dashboard/archive/${slug}`);
    }
  };

  return (
    <>
      <Box onClick={handleClick}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          transition="all 500ms ease-in-out"
        >
          <Image
            src={Directory_Icon}
            alt="folder"
            width="15px"
            marginRight="5px"
          />
          <p className="folder__title">{capitalize(name)}</p>
        </Box>
      </Box>
      <PasswordModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={{ name, slug, type: "folder" }}
      />
    </>
  );
}

export default DirectoryIcon;
