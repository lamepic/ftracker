import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

function LoadingBackdrop() {
  return (
    <Center h="100vh" w="100%" bg="lightgrey">
      <Spinner
        thickness="4px"
        speed="0.65s"
        color="var(--light-brown)"
        size="xl"
      />
    </Center>
  );
}

export default LoadingBackdrop;
