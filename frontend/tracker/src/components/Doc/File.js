import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";
import { capitalize } from "../../utility/helper";
import defaultFile from "../../assets/icons/default-file.svg";
import docIcon from "../../assets/icons/doc.svg";
import xlsIcon from "../../assets/icons/xls.svg";
import pdfIcon from "../../assets/icons/pdf.svg";
import pptIcon from "../../assets/icons/ppt.svg";
import { Box, Image } from "@chakra-ui/react";
import { Popover } from "antd";

const icons = {
  doc: docIcon,
  docx: docIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  pptx: pptIcon,
  ppt: pptIcon,
  pdf: pdfIcon,
};

function File({ doc, type }) {
  const ext = doc.document.filename.split(".");
  const fileExt = ext[ext.length - 1];

  console.log(doc);

  const popOverContent = (
    <div>
      {/* <p>Sent from: {doc.sender.first_name}</p> */}
      <p>Content</p>
    </div>
  );

  if (type === "archive") {
    return (
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          transition="all 500ms ease-in-out"
        >
          <Image
            src={icons[fileExt] || defaultFile}
            alt="file"
            width="25px"
            marginRight="10px"
          />
          <p className="folder__title">
            {capitalize(doc.document.filename.toLowerCase())}
          </p>
        </Box>
      </Link>
    );
  }

  return (
    <Popover content={popOverContent} title="Details" placement="rightTop">
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <div className="file">
          <Image
            src={icons[fileExt] || defaultFile}
            alt="file"
            width="80px"
            padding="10px"
          />
          <p className="file__title">{capitalize(doc.document.filename)}</p>
        </div>
      </Link>
    </Popover>
  );
}

export default File;
