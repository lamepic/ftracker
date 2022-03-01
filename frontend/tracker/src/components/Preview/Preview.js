import React from "react";
import { Box } from "@chakra-ui/react";

function Preview({ setOpenPreview, doc }) {
  return (
    <div>
      <Box
        display="flex"
        position="fixed"
        alignItems="center"
        justifyContent="center"
        top="0"
        left="0"
        bg="rgba(0,0,0,0.5)"
        backdropFilter="blur(4px)"
        w="100%"
        h="100%"
        zIndex="200"
        onClick={() => setOpenPreview(false)}
      >
        <iframe
          src={`http://192.168.40.8:8000${doc?.content}`}
          title="preview document"
          width="70%"
          height="100%"
          type="application/pdf"
        ></iframe>
      </Box>
    </div>
  );
}

export default Preview;
