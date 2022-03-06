import React, { useEffect, useState } from "react";
import "./ViewDocument.css";
import { Box, Text } from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading";
import {
  createMinute,
  fetchDocument,
  fetchIncomingDocumentTrail,
  fetchNextUserToForwardDoc,
  forwardDocument,
  markComplete,
  previewCode,
} from "../../http/document";
import swal from "sweetalert";
import { useStateValue } from "../../store/StateProvider";
import { useHistory, useParams } from "react-router-dom";
import pdf from "../../assets/images/pdf-img.png";
import Preview from "../../components/Preview/Preview";
import { notification } from "antd";
import ForwardModal from "../../components/ForwardModal/ForwardModal";

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: "Error",
    description,
  });
};

function ViewDocument() {
  const [store] = useStateValue();
  const history = useHistory();
  const { id, type } = useParams();
  const [document, setDocument] = useState(null);
  const [minute, setMinute] = useState("");
  const [loading, setLoading] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);
  const [code, setCode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [nextReceiver, setNextReceiver] = useState(null);
  const [previewDoc, setPreviewDoc] = useState({});
  const [incomingDocumentTrail, setIncomingDocumentTrail] = useState({});

  useEffect(() => {
    fetchPreviewCode();
    _fetchDocument();
    _fetchNextUserToForwardDoc();
  }, []);

  const _fetchDocument = async () => {
    const res = await fetchDocument(store.token, id);
    const data = res.data;
    setDocument(data);
    const incomingTrailDocRes = await fetchIncomingDocumentTrail(
      store.token,
      data.id
    );
    const incomingTrailDocData = incomingTrailDocRes.data;
    setIncomingDocumentTrail(incomingTrailDocData);
    setLoading(false);
  };

  const _fetchNextUserToForwardDoc = async () => {
    const res = await fetchNextUserToForwardDoc(store.token, id);
    const data = res.data;
    setNextReceiver(data);
  };

  const fetchPreviewCode = async () => {
    const res = await previewCode(store.token, store.user.staff_id, id);
    const data = res.data;
    setCode(data[0]);
  };

  const handleMarkComplete = async () => {
    swal({
      title: "Are you sure you want to mark this document as complete?",
      text: "This action is irreversible",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSubmit) => {
      if (willSubmit) {
        const res = await markComplete(store.token, id);
        if (res.status === 200) {
          swal("Document has been marked as complete", {
            icon: "success",
          });
          history.push("/");
        }
      }
    });
  };

  const handleMinute = async (e) => {
    e.preventDefault();
    const res = await createMinute(store.token, id, minute);
    const data = res.data;
    if (res.status === 201) {
      setDocument({ ...document, minute: [data, ...document.minute] });
      setMinute("");
    }
  };

  const handleForwardDocument = async () => {
    if (
      document.document_type === null ||
      document.document_type.name === "Custom"
    ) {
      setOpenModal(true);
    } else {
      swal({
        title: `Are you sure you want to Forward this Document to ${nextReceiver.receiver.first_name} ${nextReceiver.receiver.last_name}?`,
        text: "Forwarding of this Document is irreversible",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willSubmit) => {
        if (willSubmit) {
          const data = {
            receiver: nextReceiver.receiver.staff_id,
            document,
          };
          const res = await forwardDocument(store.token, data);
          if (res.status === 201) {
            setOpenModal(false);
            history.push("/dashboard/outgoing");
            swal("Document has been sent succesfully", {
              icon: "success",
            });
          }
        }
      });
    }
  };

  const handlePreview = (doc) => {
    setPreviewDoc(doc);
    if (code) {
      if (!code?.used) {
        swal("Enter secret token to view this Document", {
          content: "input",
        }).then(async (value) => {
          if (value) {
            const user_id = store.user.staff_id;
            const document_id = document.id;
            const data = {
              code: value,
            };
            try {
              const res = await previewCode(
                store.token,
                user_id,
                document_id,
                data
              );
              if (res.status === 200) {
                setCode({ ...previewCode, used: true });
                console.log("open preview");
                setOpenPreview(true);
              }
            } catch (error) {
              openNotificationWithIcon("Error", "message");
            }
          }
        });
      } else {
        console.log("open preview");
        setOpenPreview(true);
      }
    } else {
      setOpenPreview(true);
    }
  };

  return (
    <>
      {!loading ? (
        <Box marginTop={{ sm: "2rem", lg: "1.2rem" }}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            maxWidth="900px"
            overflowX="auto"
            whiteSpace="nowrap"
          >
            <Text
              fontWeight="600"
              marginRight="20px"
              textTransform="capitalize"
              color="var(--dark-brown)"
              _hover={{ cursor: "pointer" }}
              fontSize="15px"
              padding="2px 8px"
              bg="#e4a66c"
              borderRadius="50px"
            >
              {document.subject}
            </Text>
            {document?.related_document.map((doc) => {
              return (
                <Text
                  key={doc.id}
                  onClick={() => handlePreview(doc)}
                  fontWeight="600"
                  marginRight="20px"
                  textTransform="capitalize"
                  color="var(--dark-brown)"
                  _hover={{ cursor: "pointer" }}
                  fontSize="16px"
                >
                  {doc.subject}
                </Text>
              );
            })}
          </Box>
          <Box
            marginTop={{ sm: "2rem", lg: "1rem" }}
            display="flex"
            justifyContent="space-around"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              flex="0.3"
            >
              <Box
                h="270px"
                w="250px"
                marginTop="10px"
                backgroundColor="var(--lightest-brown)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                borderRadius="10px"
                onClick={() => handlePreview(document)}
              >
                <img
                  src={pdf}
                  alt="logo"
                  className="file-preview-box-img"
                  style={{ width: "80%", opacity: "0.7" }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                width="200px"
                margin="auto"
                marginTop="20px"
              >
                {type === "incoming" && (
                  <>
                    {document.document_type.name !== "Custom" ? (
                      !nextReceiver?.last_receiver && (
                        <button
                          className="file-btn forward disabled"
                          onClick={() => handleForwardDocument()}
                          disabled={code === undefined ? false : !code?.used}
                        >
                          Forward
                        </button>
                      )
                    ) : (
                      <button
                        className="file-btn forward disabled"
                        onClick={() => handleForwardDocument()}
                        disabled={code === undefined ? false : !code?.used}
                      >
                        Forward
                      </button>
                    )}
                    {document.document_type.name !== "Custom" ? (
                      nextReceiver?.last_receiver && (
                        <button
                          className="file-btn submit disabled"
                          onClick={handleMarkComplete}
                          disabled={code === undefined ? false : !code?.used}
                        >
                          Mark Complete
                        </button>
                      )
                    ) : (
                      <button
                        className="file-btn submit disabled"
                        onClick={handleMarkComplete}
                        disabled={code === undefined ? false : !code?.used}
                      >
                        Mark Complete
                      </button>
                    )}
                  </>
                )}
              </Box>
              {type === "incoming" &&
              store.user.is_department &&
              incomingDocumentTrail?.meta_info ? (
                <p className="meta_info">{incomingDocumentTrail?.meta_info}</p>
              ) : null}
            </Box>
            <div className={`vr ${type !== "incoming" && "vr-sm"}`}></div>

            <div className="file-info">
              <div
                className={`minute-box-preview ${
                  type !== "incoming" && "minute-box-preview-lg"
                }`}
              >
                <div>
                  {document?.minute?.map((item) => {
                    return (
                      <div className="minute" key={item?.id}>
                        <p>{item?.content}</p>
                        <p className="employee">{item?.user}</p>
                        <p className="date">
                          Date: {new Date(item?.date).toDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {type === "incoming" && (
                <form
                  onSubmit={(e) => {
                    handleMinute(e);
                  }}
                >
                  <textarea
                    name="minutes"
                    cols="35"
                    rows="7"
                    placeholder="Please add minutes here..."
                    onChange={(e) => setMinute(e.target.value)}
                    value={minute}
                  ></textarea>
                  <input
                    type="submit"
                    value="Add Minute"
                    className="minute-button"
                    disabled={!minute}
                  />
                </form>
              )}
            </div>
          </Box>
        </Box>
      ) : (
        <Loading />
      )}
      {openPreview && (
        <Preview setOpenPreview={setOpenPreview} doc={previewDoc} />
      )}
      <ForwardModal
        document={document}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}

export default ViewDocument;