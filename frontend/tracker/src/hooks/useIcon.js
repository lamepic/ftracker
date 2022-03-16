import defaultFile from "../assets/icons/default-file.svg";
import docIcon from "../assets/icons/doc.svg";
import xlsIcon from "../assets/icons/xls.svg";
import pdfIcon from "../assets/icons/pdf.svg";
import pptIcon from "../assets/icons/ppt.svg";
import folderIcon from "../assets/icons/multiple-files.svg";

const icons = {
  doc: docIcon,
  docx: docIcon,
  xls: xlsIcon,
  xlsx: xlsIcon,
  pptx: pptIcon,
  ppt: pptIcon,
  pdf: pdfIcon,
  folder: folderIcon,
};

function useIcon(filename = null, type = null) {
  let fileExt = null;
  if (filename) {
    const ext = filename?.split(".");
    fileExt = ext[ext.length - 1];
  }

  if (type) {
    fileExt = type;
  }

  const extension = fileExt;

  return icons[extension] || defaultFile;
}

export default useIcon;
