import React, { useEffect, useState } from "react";
import "./ViewDocument.css";
import { Box, Button, Text } from "@chakra-ui/react";
import Loading from "../../components/Loading/Loading";
import {
  createMinute,
  fetchDocument,
  fetchNextUserToForwardDoc,
  forwardDocument,
  markComplete,
  previewCode,
} from "../../http/document";
import swal from "sweetalert";
import { useStateValue } from "../../store/StateProvider";
import { useHistory, useParams } from "react-router-dom";
import Preview from "../../components/Preview/Preview";
import { notification } from "antd";
import ForwardModal from "../../components/ForwardModal/ForwardModal";
import { Image } from "@chakra-ui/react";
import useIcon from "../../hooks/useIcon";

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

  const [filename, setFilename] = useState("");
  const icon = useIcon(filename);

  useEffect(() => {
    fetchPreviewCode();
    _fetchDocument();
    if (type.toLowerCase() !== "copy") _fetchNextUserToForwardDoc();
  }, []);

  const _fetchDocument = async () => {
    const res = await fetchDocument(store.token, id);
    const data = res.data;
    setDocument(data);
    setFilename(data.filename);
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
    try {
      swal({
        title: "Are you sure you want to Archive this document?",
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
    } catch (e) {
      notification.error({
        message: "Error",
        description: e.response.data.detail,
      });
    }
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
            history.replace("/dashboard/outgoing");
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
                setOpenPreview(true);
              }
            } catch (error) {
              notification.error({
                message: "Error",
                description: "Wrong token",
              });
            }
          }
        });
      } else {
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
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                borderRadius="10px"
                onClick={() => handlePreview(document)}
              >
                <Image src={icon} alt="file" width="500px" />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                margin="auto"
                marginTop="20px"
              >
                {type === "incoming" && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {document.document_type.name !== "Custom" ? (
                      !nextReceiver?.last_receiver && (
                        <Button
                          className="file-btn forward"
                          onClick={() => handleForwardDocument()}
                          isDisabled={code === undefined ? false : !code?.used}
                          marginRight="10px"
                        >
                          Forward
                        </Button>
                      )
                    ) : (
                      <Button
                        className="file-btn forward"
                        onClick={() => handleForwardDocument()}
                        isDisabled={code === undefined ? false : !code?.used}
                        marginRight="10px"
                      >
                        Forward
                      </Button>
                    )}
                    {document.document_type.name !== "Custom" ? (
                      nextReceiver?.last_receiver && (
                        <Button
                          className="file-btn submit"
                          onClick={handleMarkComplete}
                          isDisabled={code === undefined ? false : !code?.used}
                        >
                          Archive
                        </Button>
                      )
                    ) : (
                      <Button
                        className="file-btn submit"
                        onClick={handleMarkComplete}
                        isDisabled={code === undefined ? false : !code?.used}
                      >
                        Archive
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            {type !== "copy" && (
              <>
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
                      <Button
                        type="submit"
                        className="minute-button"
                        isDisabled={!minute}
                      >
                        Add Minute
                      </Button>
                    </form>
                  )}
                </div>
              </>
            )}
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
