import React, { useState } from "react";
import { Box, CircularProgress, Heading, Image, Text } from "@chakra-ui/react";
import logo from "../../assets/images/logo.png";
import VerificationForm from "./VerificationForm";
import LoginForm from "./LoginForm";
import { useStateValue } from "../../store/StateProvider";
import { Redirect } from "react-router-dom";

function LoginCard() {
  const [sentVerificationToken, setSentVerificationToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [store, dispatch] = useStateValue();

  if (store.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <Box
        borderRadius="8px"
        boxShadow="3px 3px 5px 5px #49494929"
        w={{ sm: "50%", lg: "90%" }}
        h="auto"
        margin={{ sm: "auto", lg: "0" }}
        marginTop={{ sm: "10rem", lg: "2.5rem" }}
        padding="0 10px 10px 10px"
      >
        <Box textAlign="center" marginTop="10px" paddingTop="10px">
          <Heading
            as="h3"
            color="var(--light-brown)"
            fontWeight="500"
            textTransform="uppercase"
            fontSize="1rem"
            marginTop="10px"
          >
            Welcome To
          </Heading>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            marginTop="10px"
          >
            <Image src={logo} htmlWidth="50px" objectFit="contain" />
            <Box
              h="30px"
              w="1px"
              bg="var(--light-brown)"
              marginRight="7px"
            ></Box>
            <Box padding="2px" color="var(--light-brown)">
              <Text fontSize={{ lg: "1rem", md: "0.8rem" }} fontWeight="700">
                Ghana Cocoa Board
              </Text>
              <Text fontSize="0.49rem" fontWeight="600">
                Poised to Maintain Premium Quality Cocoa
              </Text>
            </Box>
          </Box>
          <Text marginTop="20px" fontWeight="500" fontSize="0.9rem">
            Login to Proceed to your Dashboard
          </Text>
          {/* <Text marginTop="7px" color="var(--light-brown)" fontWeight="600">
            Don't have an account?
          </Text> */}
          <VerificationForm
            setSentVerificationToken={setSentVerificationToken}
            setVerifiedEmail={setVerifiedEmail}
            setLoading={setLoading}
          />

          {loading && (
            <CircularProgress isIndeterminate color="var(--light-brown)" />
          )}

          {sentVerificationToken && (
            <Box paddingBottom="10px" marginTop="-15px">
              <Text fontSize="0.9rem" color="var(--light-brown)">
                A verification has been sent to
              </Text>
              <Text fontSize="0.9rem" color="var(--green)" fontWeight="600">
                {verifiedEmail}
              </Text>
              <LoginForm verifiedEmail={verifiedEmail} />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default LoginCard;
