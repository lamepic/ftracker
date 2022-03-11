import React from "react";
import "./DocIcon.css";

import folder from "../../assets/icons/folder-icon.svg";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";
import { capitalize } from "../../utility/helper";

function Folder({ doc, type }) {
  return (
    <>
      <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
        <div className="folder">
          <Image src={folder} alt="folder" className="folder__img" />
          <p className="folder__title">{capitalize(doc.document.filename)}</p>
        </div>
      </Link>
    </>
  );
}

export default Folder;
