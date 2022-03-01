import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

function Loading() {
  return (
    <Center h="81vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        color="var(--dark-brown)"
        size="xl"
      />
    </Center>
  );
}

export default Loading;
