import axios from "../utility/axios";

export async function fetchFolders(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("folders/", config);
  return res;
}

export async function fetchSubfolders(token, slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`folders/${slug}`, config);
  return res;
}

export async function createFolder(token, data) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.post("folders/", data, config);
  return res;
}

export async function fetchFiles(token, data) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`files/${data}`, config);
  return res;
}
