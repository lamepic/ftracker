import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Autocomplete.css";
import { useStateValue } from "../../store/StateProvider";
import { requestDocument, Search } from "../../http/document";
import { Button, CircularProgress } from "@mui/material";
import useClickOutside from "../../hooks/useClickOutside";
import * as actionTypes from "../../store/actionTypes";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

function SearchAutocomplete() {
  const [store, dispatch] = useStateValue();
  const [search, setSearch] = useState([]);
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const history = useHistory();
  useClickOutside(ref, setShow);

  const _Search = useCallback(async (term) => {
    const res = await Search(store.token, term);
    const data = res.data;
    setLoading(false);
    setSearch(data);
    if (data.length === 0) {
      setLoading(false);
      setShow(true);
    }
  });

  const clearResults = useCallback(() => setSearch([]));

  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  useEffect(() => {
    if (term !== "") {
      setLoading(true);
      _Search(term);
    } else {
      clearResults();
    }
  }, [term]);

  const handleTrack = (id) => {
    dispatch({
      type: actionTypes.SET_TRACKING_DOC_ID,
      payload: id,
    });
    dispatch({
      type: actionTypes.SET_OPEN_TRACKING_MODAL,
      payload: true,
    });
    clearResults();
    setTerm("");
  };

  const handleView = (route, id) => {
    history.push(`/dashboard/document/${route}/${id}/`);
    clearResults();
    setTerm("");
  };

  const handleRequest = async (id) => {
    const data = {
      document_id: id,
    };
    swal({
      title: "Request this Document?",
      text: "This action is irreversible",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSubmit) => {
      if (willSubmit) {
        const res = await requestDocument(store.token, data);
        if (res.status === 201) {
          swal("Your Request for the document has been sent", {
            icon: "success",
          });
          history.push("/dashboard/");
        }
        if (res.status === 200) {
          swal({
            title: "Request Pending",
            text: res.data.msg,
            icon: "warning",
          });
          history.push("/dashboard/");
        }
      }
    });
  };

  const handleOpenActivatedDoc = (details) => {
    dispatch({
      type: actionTypes.SET_ACTIVATED_DOCUMENTS_DETAILS,
      payload: details,
    });
    history.push("/dashboard/activated-document");
  };

  return (
    <>
      <div className="search">
        <input
          type="text"
          placeholder="Search documents"
          onChange={(e) => setDebouncedTerm(e.target.value)}
          value={debouncedTerm}
        />
        <div className="search__results" ref={ref}>
          {search.length > 0 && !loading ? (
            search.map((item, idx) => {
              return (
                <div className="search__item" key={idx}>
                  <div className="item__description">
                    <p className="item__title">{item.document.subject}</p>
                    <p className="item__ref">{item.document.ref}</p>
                  </div>
                  <div className="item__action">
                    {item.route === "outgoing" && (
                      <Button
                        size="small"
                        sx={{ color: "#9d4d01", fontWeight: 600 }}
                        onClick={() => handleTrack(item.document.id)}
                      >
                        Track
                      </Button>
                    )}
                    {(item.route === "outgoing" ||
                      item.route === "incoming") && (
                      <Button
                        size="small"
                        sx={{ color: "#9d4d01", fontWeight: 600 }}
                        onClick={() => handleView(item.route, item.document.id)}
                      >
                        View
                      </Button>
                    )}
                    {item.route === "activated" && (
                      <Button
                        size="small"
                        sx={{ color: "#9d4d01", fontWeight: 600 }}
                        onClick={() => handleOpenActivatedDoc(item)}
                      >
                        View
                      </Button>
                    )}
                    {item.route === "archive" && (
                      <Button
                        size="small"
                        sx={{ color: "#9d4d01", fontWeight: 600 }}
                        onClick={() => handleRequest(item.document.id)}
                      >
                        Request
                      </Button>
                    )}
                    {item.route === "pending" && (
                      <Button
                        size="small"
                        sx={{ color: "#9d4d01", fontWeight: 600 }}
                        disabled
                      >
                        Pending
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className={`search__item ${
                show && !loading ? "search__item-show" : "search__item-hide"
              }`}
            >
              <div className="item__not-found">
                <p>No document Found</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="search__item-loading">
              <CircularProgress color="inherit" size={30} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchAutocomplete;
