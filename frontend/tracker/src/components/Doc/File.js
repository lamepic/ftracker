import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";

import file from "../../assets/icons/file-icon.svg";

function File({ doc, type }) {
  return (
    <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
      <div className="file">
        <img src={file} alt="file" className="file__img" />
        <p className="file__title">{doc.document.subject}</p>
      </div>
    </Link>
  );
}

export default File;
