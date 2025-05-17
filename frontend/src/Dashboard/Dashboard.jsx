import "./Dashboard.css";
import "./../index.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getUserChats,
  getUserMessages,
  replyFromAudio,
  startNewChatFromAudio,
} from "../services/firestore";
import { useAuth } from "../services/AuthContext";
import DashboardChat from "../DashboardChat/DashboardChat";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import Dropzone, { useDropzone } from "react-dropzone";
import Logo from "../components/Logo";
import PDFViewer from "./PDFRenderer";
import { sendFile, sendFileChat } from "./dashboard-actions";

import Markdown from "react-markdown";

function Dashboard() {
  const constraints = { audio: true };
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // use later

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const audioRef = useRef(null);

  const audioInputRef = useRef();
  const [feedback, setFeedback] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [textData, setTextData] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [chatInput, setChatInput] = useState("");

  const [isFetchingData, setisFetchingData] = useState(false);
  const scrollRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function handleDataAvailable(event) {
    console.log("handleDataAvailable:", event);
    if (event.data && event.data.size > 0) {
      recordedChunksRef.current.push(event.data);
    }
  }

  function sendContextFile(e, blob) {
    currentUser.uid, blob, replyFromAudio(currentUser.uid, blob);
  }

  function handleStop(event) {
    console.log("Recorder stopped:", event);
    console.log("Recorded Blobs:", recordedChunksRef.current);

    // If you want to play it back or do something with the blob here:
    const superBuffer = new Blob(recordedChunksRef.current, {
      type: "audio/ogg;codecs=opus",
    });
    setSelectedFile(superBuffer);
    console.log("audio blob:", superBuffer);
    // Optionally set up audio playback
    // setPlay(superBuffer);
  }

  async function startRecording() {
    try {
      recordedChunksRef.current = []; // reset for new recording
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;

      mediaRecorder.start();
      console.log("MediaRecorder started:", mediaRecorder.state);
      setIsRecording(true);
    } catch (error) {
      console.error("Exception while creating MediaRecorder:", error);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("MediaRecorder stopped:", mediaRecorderRef.current.state);
      setIsRecording(false);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      (file.type === "audio/mpeg" || file.type === "application/pdf")
    ) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError("Invalid file type. Please upload an audio/mpeg or PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (
      file &&
      (file.type === "audio/mpeg" || file.type === "application/pdf")
    ) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError("Invalid file type. Please upload an audio/mpeg or PDF file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    sendAudio();
  };

  const handleAudioChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setAudioBlob(null);
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setErrorMessage("Please select an audio file.");
      setAudioBlob(null);
      return;
    }

    setErrorMessage(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      setAudioBlob(blob);
    } catch (error) {
      console.error("Error converting audio to blob:", error);
      setErrorMessage("Error processing audio file.");
      setAudioBlob(null);
    }
  };

  //   function handleDataAvailable(event) {
  //     console.log("handleDataAvailable", event);
  //     if (event.data && event.data.size > 0) {
  //       recordedChunks.push(event.data);
  //     }
  //   }

  function setPlay(blob) {
    audioRef.current.src = null;
    audioRef.current.srcObject = null;
    audioRef.current.src = window.URL.createObjectURL(blob);
    audioRef.current.controls = true;
    // audioRef.current.play();
  }

  //   async function startRecording() {
  //     setIsRecording(true);
  //     let recordedChunks = [];
  //     // var options = { mimeType: "audio/webm;codecs=opus" };
  //     // console.log(navigator.mediaDevices.getUserMedia(constraints));
  //     try {
  //       recordedChunksRef.current = []; // reset for new recording
  //       const stream = await navigator.mediaDevices.getUserMedia(constraints);

  //       const mediaRecorder = new MediaRecorder(stream);
  //       mediaRecorderRef.current = mediaRecorder;

  //       mediaRecorder.ondataavailable = handleDataAvailable;
  //       mediaRecorder.onstop = stopRecording;

  //       mediaRecorder.start();
  //       console.log("MediaRecorder started:", mediaRecorder.state);
  //     } catch (error) {
  //       console.error("Exception while creating MediaRecorder:", error);
  //     }

  //     mediaRecorderRef.current.onstop = (event) => {
  //       console.log("Recorder stopped: ", event);
  //       console.log("Recorded Blobs: ", recordedChunks);
  //       // set audio playback
  //       const superBuffer = new Blob(recordedChunks, {
  //         type: "audio/ogg;codecs=opus",
  //       });
  //       console.log("audio", superBuffer);
  //       // setPlay(superBuffer);
  //     };

  //     mediaRecorderRef.current.ondataavailable = handleDataAvailable;
  //     mediaRecorderRef.current.start();
  //     console.log(
  //       "mediaRecorderRef.current started",
  //       mediaRecorderRef.current.state
  //     );
  //   }

  //   function stopRecording() {
  //     setIsRecording(false);
  //     console.log("Recorder stopped:", event);
  //     console.log("Recorded Blobs:", recordedChunksRef.current);

  //     // If you want to play it back or do something with the blob here:
  //     const superBuffer = new Blob(recordedChunksRef.current, {
  //       type: "audio/ogg;codecs=opus",
  //     });
  //     console.log("audio blob:", superBuffer);
  //     // Optionally set up audio playback
  //     // setPlay(superBuffer);
  //   }

  // will make request to flask backend

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUid, setCurrentChatUid] = useState("");
  const { currentUser } = useAuth();

  //   const [selectedFile, setSelectedFile] = useState(null);

  //   const handleFileChange = (event) => {
  //     setSelectedFile(event.target.files[0]);
  //     console.log(selectedFile);
  //   };
  async function sendAudio() {
    if (selectedFile) {
      // Convert file to Blob
      const reader = new FileReader();
      reader.onload = async function (e) {
        const blob = new Blob([new Uint8Array(e.target.result)], {
          type: selectedFile.type,
        });

        await startNewChatFromAudio(
          currentUser.uid,
          blob,
          updateChats,
          setCurrentChatUid
        );
      };
      reader.readAsArrayBuffer(selectedFile);
      return;
    }
    // If no file, use recorded chunks
    const audioBlob = new Blob(recordedChunksRef.current, {
      type: "audio/ogg;codecs=opus",
    });
    await startNewChatFromAudio(
      currentUser.uid,
      audioBlob,
      updateChats,
      setCurrentChatUid
    );
  }

  // 9. Chat handling
  const updateChats = () => {
    getUserChats(currentUser.uid).then((data) => {
      console.log("User chats:", data);
      setChats(data);
    });
  };

  /*  useEffect(() => {
    updateChats();
  }, []); */

  /* useEffect(() => {
    if (currentChatUid !== "") {
      getUserMessages(currentUser.uid, currentChatUid).then((data) => {
        console.log("Messages:", data);
        setCurrentChat(data);
      });
    } else {
      setCurrentChat(null);
    }
  }, [currentChatUid, currentUser.uid]); */

  const handleSendChat = async () => {
    const inputElement = document.querySelector("#chatInput");
    if (inputElement) {
      localAppendMessages({ content: inputElement.value, fromUser: true });
      inputElement.value = "";
    }

    const scroller = document.querySelector("#scrollId");
    if (scroller) {
      const lastMessage = scroller.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log("Last message DNE");
      }
    } else {
      console.log("Last element DNE");
    }

    setisFetchingData(true);
    var messages = localFetchMessages();
    const lastMessage = messages.pop();
    messages.shift();
    messages = JSON.stringify(messages);
    console.log(
      `${typeof resumeFile} AND ${messages.substring(0, 20)} AND ${
        lastMessage.content
      }`
    );
    const result = await sendFileChat(
      resumeFile,
      messages,
      lastMessage.content
    );

    console.log(result);
    localAppendMessages({
      content: result,
      fromUser: false,
      type: "modelResponse",
    });

    setisFetchingData(false);
  };

  const handleSend = async (addLastMessage = false) => {
    // console.log(chatInput);

    if (addLastMessage) {
      const inputElement = document.querySelector("#chatInput");
      if (inputElement) {
        localAppendMessages({ content: inputElement.value, fromUser: true });
        inputElement.value = "";
      }
    }

    // localAppendMessages({ content: chatInput, fromUser: true });

    setisFetchingData(true);
    var messages = localFetchMessages();
    messages.pop(0);
    messages = JSON.stringify(messages);
    const result = await sendFile(resumeFile, messages);
    console.log(result);
    localAppendMessages({
      content: result,
      fromUser: false,
      type: "modelResponse",
    });
    // localSetResponse(result.feedback);
    setisFetchingData(false);
  };

  const formatSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} bytes`;
    else if (sizeInBytes < 1048576)
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    else return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
  };

  const retrieveFile = (fileData) => {
    const base64String = fileData;
    if (base64String) {
      const byteCharacters = atob(base64String.split(",")[1]); // decode Base64
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      const blob = new Blob(byteArrays, { type: "application/pdf" }); // Adjust MIME type based on file type
      return blob;
    } else {
      alert("No file stored in localStorage");
    }
  };

  const localFetchMessages = () => {
    return JSON.parse(localStorage.getItem("messages"));
  };

  // const localSetResponse = (message) => {
  //   let messages = localFetchMessages();
  //   messages.pop();
  //   messages.push({
  //     content: message,
  //     fromUser: false,
  //   });
  //   setChats(messages);
  //   localStorage.setItem("messages", JSON.stringify(messages));
  // };

  const localAppendMessages = (message) => {
    let oldMessages = localFetchMessages();
    if (oldMessages === null) {
      oldMessages = [];
    }

    oldMessages.push(message);
    localStorage.setItem("messages", JSON.stringify(oldMessages));
    setChats(oldMessages);
  };

  useEffect(() => {
    setChats(localFetchMessages());
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((val) => !val);
  };

  return (
    <div className="w-svw h-svh flex flex-col">
      <section className="py-6 px-8 flex items-center justify-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="black"
          className="size-6 cursor-pointer"
          onClick={toggleSidebar}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <h1
          className="text-xl ml-4 md:hidden"
          onClick={() => {
            if (localStorage.getItem("messages") === null) {
              localStorage.setItem(
                "messages",
                JSON.stringify([
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                    type: "pdf",
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: false,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: false,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: false,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: false,
                  },
                  {
                    content: "I'm good, how are you?",
                    fromUser: true,
                  },
                ])
              );
            } else {
              localStorage.removeItem("messages");
            }
          }}
        >
          Chats
        </h1>
        <a
          className="ml-auto cursor-pointer"
          onClick={() => {
            signOut(auth);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 cursor-pointer"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
        </a>
        <nav
          className={`bg-white fixed inset-0 right-[15%] max-w-[24rem] transition-all z-10 ${
            isCollapsed ? "translate-x-[-100%]" : ""
          }`}
        >
          <div className="py-6 px-8 [&>*:not(:last-child)]:mb-4 h-full flex flex-col">
            <div className="w-full flex items-center justify-between">
              <Logo />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="size-6 cursor-pointer"
                onClick={toggleSidebar}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="bg-[#f3f3f7] px-6 py-5 rounded-2xl flex flex-col gap-3">
              {[
                {
                  name: "New resume analysis",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  ),
                },
                {
                  name: "New interview analysis",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                      />
                    </svg>
                  ),
                },
              ].map((item, index) => {
                return (
                  <>
                    {index !== 0 && (
                      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-300" />
                    )}
                    <a href="https://github.com" target="_blank">
                      <div className="flex items-center justify-start gap-2">
                        {item.icon}
                        {item.name}
                      </div>
                    </a>
                  </>
                );
              })}
            </div>
            <div className="bg-[#f3f3f7] px-8 py-8 rounded-2xl grow">
              <p className="italic text-gray-400 text-center">
                No items to show
              </p>
            </div>
          </div>
        </nav>
      </section>
      {chats !== null ? (
        <div className="w-full h-full px-4">
          <div className="w-full h-full max-w-240 mx-auto -my-4" id="scrollId">
            {chats.map((message) => {
              return message.type === "pdf" ? (
                <div className="max-w-[75%] my-4 rounded-xl ml-auto bg-[#070036] text-white">
                  {/* <iframe
                    src={URL.createObjectURL()}
                    className="w-full border-0 border-none overflow-clip aspect-video rounded-xl"
                    frameborder="0"
                    hspace="0"
                    vspace="0"
                    marginheight="0"
                    marginwidth="0"
                    style={{ pointerEvents: "none", border: "0" }} // Disable interaction (no scrolling)
                    name="Preview"
                  /> */}
                  {retrieveFile(message.content) && (
                    <PDFViewer file={message.content} />
                  )}
                  <div className="p-4">
                    <h1 className="text-xl">{message.name}</h1>
                    <p className="text-[#aaa] text-sm">
                      Size: {formatSize(retrieveFile(message.content).size)}
                    </p>
                  </div>
                </div>
              ) : message.type === "modelResponse" ? (
                <div
                  className={`max-w-[75%] w-fit p-4 my-4 rounded-xl font-medium mr-auto bg-white text-black [&>*:not(:last-child)]:mb-6 [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-2 [&_li:last-child]:mb-6`}
                >
                  {
                    <>
                      {/* <h2 className="mb-4 text-2xl">Your strengths</h2>
                      <Markdown>{message.content["Your Strengths"]}</Markdown>
                      <br />
                      <h2 className="mb-4 text-2xl">Suggested improvements</h2>
                      <Markdown>{message.content["Improvements"]}</Markdown> */}
                      {/* <Markdown>{Object.keys(message.content)}</Markdown> */}
                      <Markdown>{message.content.feedback}</Markdown>
                      {/* {message.content.feedback} */}

                      {/* {Object.keys(message.content).map((key) => {
                        return (
                          <>
                            <h2 className="text-2xl">{key}</h2>
                            <Markdown>{message.content[key]}</Markdown>
                            <div className="mb-4"></div>
                          </>
                        );
                      })} */}
                    </>
                  }
                </div>
              ) : (
                <div
                  className={`max-w-[75%] w-fit p-4 my-4 rounded-xl font-medium ${
                    message.fromUser
                      ? "ml-auto bg-[#070036] text-white text-right"
                      : "mr-auto bg-white text-black text-right"
                  }`}
                >
                  {message.content}
                </div>
              );
            })}
            {isFetchingData && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="size-16 bg-white p-4 rounded-xl"
              >
                <circle
                  fill="#070036"
                  stroke="#070036"
                  stroke-width="12"
                  r="15"
                  cx="40"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4"
                  ></animate>
                </circle>
                <circle
                  fill="#070036"
                  stroke="#070036"
                  stroke-width="12"
                  r="15"
                  cx="100"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2"
                  ></animate>
                </circle>
                <circle
                  fill="#070036"
                  stroke="#070036"
                  stroke-width="12"
                  r="15"
                  cx="160"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0"
                  ></animate>
                </circle>
              </svg>
            )}
            <div className="h-20"></div>
          </div>
          <div className="inline-flex justify-center items-center rounded-2xl bg-white mx-4 px-6 py-4 max-w-240 fixed bottom-4 left-[50%] translate-x-[calc(-50%-1rem)] w-[calc(100vw-4rem)]">
            <input
              id="chatInput"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatInput !== "") {
                  handleSendChat(true);
                }
              }}
              className="grow focus-visible:outline-none"
              placeholder="Type a message"
              onChange={(e) => {
                setChatInput(e.target.value);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              onClick={() => {
                if (chatInput !== "") {
                  handleSendChat(true);
                }
              }}
              stroke={chatInput === "" ? "gray" : "black"}
              className={`size-6 ${chatInput !== "" && "cursor-pointer"}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <Dropzone
            onDrop={(acceptedFiles) => {
              console.log(acceptedFiles);
              setResumeFile(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section className="grow flex flex-col items-center justify-center p-4">
                <div
                  {...getRootProps()}
                  className="border-black border-dashed border-2 flex items-center justify-center flex-col px-8 py-12 rounded-2xl bg-[#070036]/5 w-full max-w-144 cursor-pointer"
                >
                  <input
                    {...getInputProps({
                      accept: "application/pdf",
                      multiple: false,
                    })}
                  />
                  <svg
                    width="114"
                    height="123"
                    viewBox="0 0 114 123"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-30 mb-12"
                  >
                    <g clip-path="url(#clip0_69_11)">
                      <rect x="65" y="76" width="40" height="37" fill="white" />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M65.59 67.32H104.41C106.895 67.3279 109.277 68.3187 111.034 70.0761C112.791 71.8335 113.782 74.2147 113.79 76.7V113.49C113.785 115.977 112.795 118.361 111.037 120.12C109.28 121.88 106.897 122.872 104.41 122.88H65.59C63.103 122.872 60.7202 121.88 58.9626 120.12C57.2049 118.361 56.2153 115.977 56.21 113.49V76.7C56.2179 74.2147 57.2087 71.8335 58.9661 70.0761C60.7235 68.3187 63.1047 67.3279 65.59 67.32ZM60 11.56L79.73 30.07H60V11.56ZM20.87 54C20.3111 54.0361 19.7887 54.2898 19.4148 54.7067C19.0409 55.1236 18.8453 55.6705 18.87 56.23C18.84 56.7908 19.0338 57.3406 19.4087 57.7587C19.7837 58.1768 20.3092 58.429 20.87 58.46H59.65C60.2089 58.4239 60.7313 58.1702 61.1052 57.7533C61.4791 57.3364 61.6747 56.7895 61.65 56.23C61.6676 55.9517 61.6295 55.6727 61.5381 55.4093C61.4467 55.1459 61.3037 54.9033 61.1175 54.6957C60.9313 54.4881 60.7057 54.3197 60.4537 54.2002C60.2018 54.0808 59.9286 54.0127 59.65 54H20.87ZM20.87 70C20.3111 70.0361 19.7887 70.2898 19.4148 70.7067C19.0409 71.1236 18.8453 71.6705 18.87 72.23C18.8538 72.5075 18.8929 72.7854 18.9849 73.0477C19.077 73.3099 19.2202 73.5513 19.4062 73.7578C19.5923 73.9643 19.8174 74.1318 20.0687 74.2507C20.32 74.3695 20.5923 74.4372 20.87 74.45H45.67V70H20.87ZM20.87 86C20.3111 86.0361 19.7887 86.2898 19.4148 86.7067C19.0409 87.1236 18.8453 87.6705 18.87 88.23C18.8524 88.5083 18.8905 88.7873 18.9819 89.0507C19.0733 89.3141 19.2163 89.5567 19.4025 89.7643C19.5887 89.9719 19.8143 90.1403 20.0663 90.2598C20.3182 90.3792 20.5915 90.4473 20.87 90.46H45.67V85.91L20.87 86ZM20.87 38.11C20.3111 38.1461 19.7887 38.3998 19.4148 38.8167C19.0409 39.2336 18.8453 39.7805 18.87 40.34C18.8538 40.618 18.8928 40.8964 18.9847 41.1593C19.0767 41.4221 19.2197 41.6642 19.4056 41.8715C19.5915 42.0788 19.8167 42.2472 20.068 42.3671C20.3193 42.487 20.5919 42.556 20.87 42.57H43.81C44.3689 42.5339 44.8913 42.2802 45.2652 41.8633C45.6391 41.4464 45.8347 40.8995 45.81 40.34C45.8262 40.062 45.7872 39.7836 45.6953 39.5207C45.6033 39.2579 45.4603 39.0158 45.2744 38.8085C45.0884 38.6012 44.8633 38.4328 44.612 38.3129C44.3607 38.193 44.0881 38.124 43.81 38.11H20.87ZM20.87 22.11C20.3111 22.1461 19.7887 22.3998 19.4148 22.8167C19.0409 23.2336 18.8453 23.7805 18.87 24.34C18.8524 24.6183 18.8905 24.8973 18.9819 25.1607C19.0733 25.4241 19.2163 25.6667 19.4025 25.8743C19.5887 26.0819 19.8143 26.2503 20.0663 26.3698C20.3182 26.4892 20.5915 26.5573 20.87 26.57H33.47C34.0289 26.5339 34.5513 26.2802 34.9252 25.8633C35.2991 25.4464 35.4947 24.8995 35.47 24.34C35.4862 24.062 35.4472 23.7836 35.3553 23.5207C35.2633 23.2579 35.1203 23.0158 34.9344 22.8085C34.7484 22.6012 34.5233 22.4328 34.272 22.3129C34.0207 22.193 33.7481 22.124 33.47 22.11H20.87ZM90.72 32.72C90.7229 32.003 90.4907 31.3049 90.0591 30.7323C89.6274 30.1598 89.0201 29.7445 88.33 29.55L59.23 1.21C58.9234 0.831987 58.5362 0.527195 58.0968 0.317861C57.6574 0.108527 57.1767 -6.73639e-05 56.69 3.13505e-08H5.91C4.34257 3.13505e-08 2.83934 0.622659 1.731 1.731C0.622659 2.83934 0 4.34257 0 5.91L0 107.12C0.00793018 108.682 0.634088 110.178 1.74157 111.28C2.84905 112.381 4.34775 113 5.91 113H45.76V106.4H6.61V6.57H53.37V33.36C53.3726 34.2388 53.7236 35.0807 54.3459 35.7011C54.9683 36.3216 55.8112 36.67 56.69 36.67H84.12V58.29H90.72V32.72ZM97.17 97.82C97.5695 97.8381 97.9672 97.7562 98.327 97.5815C98.6867 97.4069 98.9971 97.1451 99.23 96.82C100.31 95.2 98.83 93.6 97.81 92.47C94.9 89.28 88.32 83.47 86.89 81.81C86.6682 81.5291 86.3856 81.302 86.0634 81.146C85.7413 80.9899 85.388 80.9088 85.03 80.9088C84.672 80.9088 84.3187 80.9899 83.9966 81.146C83.6744 81.302 83.3918 81.5291 83.17 81.81C81.68 83.54 74.74 89.67 71.98 92.81C70.98 93.89 69.83 95.37 70.83 96.81C71.0651 97.1352 71.3773 97.3969 71.7387 97.5715C72.1 97.7461 72.4991 97.828 72.9 97.81H78.07V107.08C78.07 107.464 78.1459 107.845 78.2932 108.2C78.4406 108.555 78.6566 108.877 78.9288 109.148C79.201 109.42 79.5241 109.634 79.8795 109.781C80.2349 109.927 80.6157 110.001 81 110H89.1C89.8692 109.995 90.6053 109.686 91.1483 109.141C91.6913 108.596 91.9974 107.859 92 107.09V97.82H97.17Z"
                        fill="#070036"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_69_11">
                        <rect width="113.79" height="122.88" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {resumeFile && (
                    <p className="font-regular text-[#666] text-sm text-center mb-4 -mt-4">
                      Selected file: {resumeFile.name}
                    </p>
                  )}

                  <h1 className="font-bold text-[#070036] text-4xl mb-2 text-center">
                    Drop your resume
                  </h1>
                  <p className="font-regular text-[#666] text-lg text-center">
                    or click here to upload it directly
                  </p>
                </div>
                {resumeFile !== null && (
                  <div className="flex gap-8 mt-4">
                    {[
                      {
                        name: "Cancel",
                        cln: "text-black border-black border-1 px-6 py-2 rounded-full cursor-pointer",
                        onPress: () => {
                          setResumeFile(null);
                        },
                      },
                      {
                        name: "Upload",
                        cln: "bg-[#bcaeec] text-white font-semibold px-6 py-2 rounded-full cursor-pointer",
                        onPress: () => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            console.log(reader.result);
                            const newData = {
                              fromUser: true,
                              content: reader.result,
                              type: "pdf",
                              name: resumeFile.name,
                            };
                            // console.log(newData);
                            localAppendMessages(newData);
                            handleSend();
                          };
                          reader.readAsDataURL(resumeFile);
                        },
                      },
                    ].map((buttonData) => (
                      <button
                        className={buttonData.cln}
                        onClick={buttonData.onPress}
                      >
                        {buttonData.name}
                      </button>
                    ))}
                    {/* <button>Cancel</button> */}
                    {/* <button>Analyse</button> */}
                  </div>
                )}
              </section>
            )}
          </Dropzone>
        </>
      )}
    </div>
  );

  return (
    <div className="dashboard">
      <aside className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="menu-icon" onClick={toggleSidebar}>
            ☰
          </div>
        </div>

        <div
          className="new-chat"
          onClick={() => {
            setCurrentChatUid("");
          }}
        >
          <div className="new-chat-icon">+</div>
          {!isCollapsed && <span>New chat</span>}
        </div>

        {isCollapsed ? null : chats ? (
          <div className="sidebar-section">
            <div className="section-title">Recent</div>
            <ul className="section-list">
              {chats.map((chat) => (
                <li
                  key={chat.docId}
                  className="list-item"
                  onClick={() => setCurrentChatUid(chat.docId)}
                >
                  <span>{chat.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>Loading</div>
        )}
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </button>
      </aside>

      <div className="dashboard-main">
        {currentChat ? (
          <div className="dashboard-wrapper">
            <DashboardChat chat={currentChat} />
          </div>
        ) : (
          <div className="dashboard-content">
            <div className="input-section"></div>
            <div className="button-section">
              {/* <button onClick={() => startRecording()}>Start recording</button>
              <button onClick={() => stopRecording()}>Stop recording</button>
              <button onClick={() => sendAudio()}>Upload</button>
              <input
                type="file"
                accept="audio/*, application/pdf"
                onChange={handleAudioChange}
              /> */}
              <div
                className="file-upload-container"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  accept="audio/mpeg, application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  //   className="file-input"
                />
                <label htmlFor="file-input" className="file-label">
                  {selectedFile
                    ? selectedFile.name
                    : "Drag & drop or click to upload"}
                </label>

                {error && <p className="error-message">{error}</p>}

                {selectedFile && (
                  <button className="upload-button" onClick={handleUpload}>
                    Upload
                  </button>
                )}
              </div>
              {isRecording && (
                <button onClick={() => stopRecording()}>Stop recording</button>
              )}
              {!isRecording && (
                <button onClick={() => startRecording()}>
                  Start recording
                </button>
              )}
            </div>
          </div>
        )}
        {currentChatUid && (
          <div className="textarea-wrapper">
            <textarea
              name=""
              id="input-field"
              defaultValue={""}
              onChange={(e) => {
                setTextData(e.target.value);
              }}
            />
            <svg
              height="48"
              viewBox="0 0 48 48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
              onClick={sendContextFile}
            >
              <path d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z" />
              <path d="M0 0h48v48h-48z" fill="none" />
            </svg>
          </div>
        )}
        {/* <audio ref={audioRef} controls /> */}
      </div>
    </div>
  );
}

export default Dashboard;
