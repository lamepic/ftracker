import React from "react";
import "./DocIcon.css";

import folder from "../../assets/icons/folder-icon.svg";
import { Link } from "react-router-dom";

function Folder({ doc, type }) {
  return (
    <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
      <div className="folder">
        <img src={folder} alt="folder" className="folder__img" />
        <p className="folder__title">{doc.document.subject}</p>
      </div>
    </Link>
  );
}

export default Folder;
