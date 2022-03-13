import { Box, Image } from "@chakra-ui/react";
import React from "react";
import file from "../../assets/icons/file-icon.svg";
import { capitalize } from "../../utility/helper";

function DirectoryFileIcon({ document, setPreviewDoc, setOpenPreview }) {
  const handleClick = () => {
    setOpenPreview(true);
    setPreviewDoc(document);
  };

  return (
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
  );
}

export default DirectoryFileIcon;
