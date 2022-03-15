import React, { useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import file from "../../assets/icons/file-icon.svg";
import { capitalize } from "../../utility/helper";
import { checkFileEncryption } from "../../http/directory";
import { notification } from "antd";
import { useStateValue } from "../../store/StateProvider";
import PasswordModal from "../CustomModals/PasswordModal";

function DirectoryFileIcon({ document, setPreviewDoc, setOpenPreview }) {
  const [store, dispatch] = useStateValue();
  const [openModal, setOpenModal] = useState(false);

  const handleClick = async () => {
    let data;
    try {
      const checkEncrypt = await checkFileEncryption(store.token, document.id);
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
      setPreviewDoc(document);
      setOpenPreview(true);
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
          // _hover={{ backgroundColor: "#e3bc97" }}
          transition="all 500ms ease-in-out"
        >
          <Image src={file} alt="file" width="13px" marginRight="5px" />
          <p className="folder__title">
            {capitalize(document.filename.toLowerCase())}
          </p>
        </Box>
      </Box>
      <PasswordModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={{ document, setOpenPreview, setPreviewDoc, type: "file" }}
      />
    </>
  );
}

export default DirectoryFileIcon;
