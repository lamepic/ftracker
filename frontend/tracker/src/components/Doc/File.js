import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";
import { capitalize } from "../../utility/helper";
import defaultFile from "../../assets/icons/default-file.svg";
import docIcon from "../../assets/icons/doc.svg";
import xlsIcon from "../../assets/icons/xls.svg";
import pdfIcon from "../../assets/icons/pdf.svg";
import pptIcon from "../../assets/icons/ppt.svg";
import { Box, Image, Text } from "@chakra-ui/react";
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

  const popOverContent = (
    <div>
      <Text fontWeight="500" color="var(--dark-brown)">
        {type === "incoming"
          ? `Sent from: ${doc.sender.first_name} ${doc.sender.last_name}`
          : `Sent to: ${doc.receiver.first_name} ${doc.receiver.last_name}`}
      </Text>
      {doc.sender
        ? !doc.sender.is_department && (
            <Text fontWeight="500" color="var(--dark-brown)">
              Department: {doc.sender.department.name}
            </Text>
          )
        : !doc.receiver.is_department && (
            <Text fontWeight="500" color="var(--dark-brown)">
              Department: {doc.receiver.department.name}
            </Text>
          )}
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
