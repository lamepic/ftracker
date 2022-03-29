import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";
import { Box, Image, Text } from "@chakra-ui/react";
import { capitalize } from "../../utility/helper";
import { Popover } from "antd";
import MultipleFileIcon from "../../assets/icons/multiple-files.svg";

function Folder({ doc, type }) {
  if (type === "archive") {
    return (
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <Box
          display="flex"
          flexDirection="row"
          // justifyContent="center"
          alignItems="center"
          transition="all 500ms ease-in-out"
        >
          <Image
            src={MultipleFileIcon}
            alt="file"
            width="25px"
            marginRight="10px"
          />
          <Text
            isTruncated={true}
            fontSize="14px"
            fontWeight="600"
            color="var(--dark-brown)"
            textAlign="center"
            display="block"
          >
            {capitalize(doc.document.filename.toLowerCase())}
          </Text>
        </Box>
      </Link>
    );
  }

  if (type === "copy") {
    const popOverContent = (
      <div>
        <Text fontWeight="500" color="var(--dark-brown)">
          {type === "copy" &&
            `Sent from: ${doc?.sender?.first_name} ${doc?.sender?.last_name}`}
        </Text>
        {doc.sender
          ? !doc.sender.is_department && (
              <Text fontWeight="500" color="var(--dark-brown)">
                Department: {doc?.sender?.department.name}
              </Text>
            )
          : !doc.receiver.is_department && (
              <Text fontWeight="500" color="var(--dark-brown)">
                Department: {doc?.receiver?.department.name}
              </Text>
            )}
        <Text fontWeight="500" color="var(--dark-brown)">{`Date: ${new Date(
          doc.created_at
        ).toDateString()}`}</Text>
        <Text fontWeight="500" color="var(--dark-brown)">{`Time: ${new Date(
          doc.created_at
        ).toLocaleTimeString()}`}</Text>
      </div>
    );

    return (
      <Popover content={popOverContent} title="Details" placement="rightTop">
        <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
          <div className="folder">
            <Image src={MultipleFileIcon} alt="folder" w="80%" padding="10px" />
            <Text className="folder__title" noOfLines={2} maxW="120px">
              {capitalize(doc.document.filename)}
            </Text>
          </div>
        </Link>
      </Popover>
    );
  }

  const popOverContent = (
    <div>
      <Text fontWeight="500" color="var(--dark-brown)">
        {type === "incoming"
          ? `Sent from: ${doc?.sender?.first_name} ${doc?.sender?.last_name}`
          : `Sent to: ${doc?.receiver?.first_name} ${doc?.receiver?.last_name}`}
      </Text>
      {doc.sender
        ? !doc.sender.is_department && (
            <Text fontWeight="500" color="var(--dark-brown)">
              Department: {doc?.sender?.department.name}
            </Text>
          )
        : !doc.receiver.is_department && (
            <Text fontWeight="500" color="var(--dark-brown)">
              Department: {doc?.receiver?.department.name}
            </Text>
          )}
      <Text fontWeight="500" color="var(--dark-brown)">{`Date: ${new Date(
        doc.created_at
      ).toDateString()}`}</Text>
      <Text fontWeight="500" color="var(--dark-brown)">{`Time: ${new Date(
        doc.created_at
      ).toLocaleTimeString()}`}</Text>
    </div>
  );

  return (
    <Popover content={popOverContent} title="Details" placement="rightTop">
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <div className="folder">
          <Image src={MultipleFileIcon} alt="folder" w="80%" padding="10px" />
          <Text className="folder__title" noOfLines={2} maxW="120px">
            {capitalize(doc.document.filename)}
          </Text>
        </div>
      </Link>
    </Popover>
  );
}

export default Folder;
