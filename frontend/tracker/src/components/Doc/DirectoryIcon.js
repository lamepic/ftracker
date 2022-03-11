import React from "react";
import { Box, Image } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Directory_Icon from "../../assets/icons/Directory.svg";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";
import { capitalize } from "../../utility/helper";

function DirectoryIcon({ name, slug }) {
  const [state, dispatch] = useStateValue();
  const history = useHistory();

  const handleClick = () => {
    dispatch({
      type: actionTypes.SET_BREADCRUMBS,
      payload: { name, slug },
    });
    history.push(`/dashboard/archive/${slug}`);
  };

  return (
    <Box onClick={handleClick}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        _hover={{ backgroundColor: "#e3bc97" }}
        transition="all 500ms ease-in-out"
      >
        <Image src={Directory_Icon} alt="folder" className="folder__img" />
        <p className="folder__title">{capitalize(name)}</p>
      </Box>
    </Box>
  );
}

export default DirectoryIcon;
