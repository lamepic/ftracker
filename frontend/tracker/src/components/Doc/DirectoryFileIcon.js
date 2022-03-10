import React from "react";
import file from "../../assets/icons/file-icon.svg";

function DirectoryFileIcon({ document, setPreviewDoc, setOpenPreview }) {
  const handleClick = () => {
    setOpenPreview(true);
    setPreviewDoc(document);
  };

  return (
    <div onClick={handleClick}>
      <div className="file">
        <img src={file} alt="file" className="file__img" />
        <p className="file__title">{document.subject}</p>
      </div>
    </div>
  );
}

export default DirectoryFileIcon;
