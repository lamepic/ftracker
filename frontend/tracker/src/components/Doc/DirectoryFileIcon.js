import React from "react";
import file from "../../assets/icons/file-icon.svg";
import { capitalize } from "../../utility/helper";

function DirectoryFileIcon({ document, setPreviewDoc, setOpenPreview }) {
  const handleClick = () => {
    setOpenPreview(true);
    setPreviewDoc(document);
  };

  return (
    <div onClick={handleClick}>
      <div className="file">
        <img src={file} alt="file" className="file__img" />
        <p className="file__title">
          {capitalize(document.filename.toLowerCase())}
        </p>
      </div>
    </div>
  );
}

export default DirectoryFileIcon;
