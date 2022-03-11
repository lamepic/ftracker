import { Box, Text } from "@chakra-ui/react";
import React from "react";
import "./EmptyPage.css";

function EmptyPage({ type }) {
  let header = "";

  if (type === "incoming") {
    header = "Received";
  } else if (type === "outgoing") {
    header = "Pending";
  } else if (type === "tracking") {
    header = "Tracking";
  } else {
    header = "Archive";
  }

  return (
    <Box marginTop="10px">
      <Box>
        <Text
          as="h2"
          fontSize={{ sm: "1.5rem", lg: "1.7rem" }}
          color="var(--dark-brown)"
          fontWeight="600"
        >
          {header}
        </Text>
        <Box minH="80vh" display="flex" justifyContent="center">
          <Text
            as="h3"
            color="var(--light-brown)"
            fontSize="3rem"
            textTransform="uppercase"
            marginTop="10rem"
          >
            No {type} Files
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default EmptyPage;
