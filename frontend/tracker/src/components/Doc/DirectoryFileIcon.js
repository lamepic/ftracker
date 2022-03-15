import React, { useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import defaultFile from "../../assets/icons/default-file.svg";
import { capitalize } from "../../utility/helper";
import { checkFileEncryption } from "../../http/directory";
import { notification } from "antd";
import { useStateValue } from "../../store/StateProvider";
import PasswordModal from "../CustomModals/PasswordModal";
import docIcon from "../../assets/icons/doc.svg";
import xlsIcon from "../../assets/icons/xls.svg";
import pdfIcon from "../../assets/icons/pdf.svg";
import pptIcon from "../../assets/icons/ppt.svg";

const icons = {
  doc: docIcon,
  docx: docIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  pptx: pptIcon,
  ppt: pptIcon,
  pdf: pdfIcon,
};

function DirectoryFileIcon({ document, setPreviewDoc, setOpenPreview }) {
  const [store, dispatch] = useStateValue();
  const [openModal, setOpenModal] = useState(false);

  const ext = document.filename.split(".");
  const fileExt = ext[ext.length - 1];

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
          <Image
            src={icons[fileExt] || defaultFile}
            alt="file"
            width="25px"
            marginRight="10px"
          />
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
