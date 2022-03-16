import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";
import { Box, Image, Text } from "@chakra-ui/react";
import { capitalize } from "../../utility/helper";
import useIcon from "../../hooks/useIcon";
import { Popover } from "antd";

function Folder({ doc, type }) {
  const icon = useIcon("folder");

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
          <Image src={icon} alt="file" width="25px" marginRight="10px" />
          <p className="folder__title">
            {capitalize(doc.document.filename.toLowerCase())}
          </p>
        </Box>
      </Link>
    );
  }

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

  return (
    <Popover content={popOverContent} title="Details" placement="rightTop">
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <div className="folder">
          <Image src={icon} alt="folder" w="80%" padding="10px" />
          <p className="folder__title">{capitalize(doc.document.filename)}</p>
        </div>
      </Link>
    </Popover>
  );
}

export default Folder;
