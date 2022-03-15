import React from "react";
import "./DocIcon.css";
import { Link } from "react-router-dom";
import { capitalize } from "../../utility/helper";
import defaultFile from "../../assets/icons/default-file.svg";
import docIcon from "../../assets/icons/doc.svg";
import xlsIcon from "../../assets/icons/xls.svg";
import pdfIcon from "../../assets/icons/pdf.svg";
import pptIcon from "../../assets/icons/ppt.svg";
import { Image } from "@chakra-ui/react";

const icons = {
  doc: docIcon,
  docx: docIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  pptx: pptIcon,
  ppt: pptIcon,
  pdf: pdfIcon,
};

function File({ doc, type }) {
  const ext = doc.document.filename.split(".");
  const fileExt = ext[ext.length - 1];

  return (
    <Link to={`/dashboard/document/${type}/${doc.document.id}/`}>
      <div className="file">
        <Image
          src={icons[fileExt] || defaultFile}
          alt="file"
          className="file__img"
        />
        <p className="file__title">{capitalize(doc.document.filename)}</p>
      </div>
    </Link>
  );
}

export default File;
