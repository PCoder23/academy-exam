import { useEffect, useState } from "react";
import { FaCamera, FaMicrophone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Instruction = () => {
  const instructions = [
    "Read all questions carefully before answering.",
    "Allocate time wisely for each question.",
    "Attempt all questions.",
    "Ensure your answers are clear and legible.",
    "Review your answers before submitting.",
  ];

  const [cameraPermission, setCameraPermission] = useState(false);
  const [voicePermission, setVoicePermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [videoError, setVideoError] = useState(null);

  const handleCameraPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setCameraPermission(true);
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setVideoError(err);
      });
  };

  const handleVoicePermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setVoicePermission(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  useEffect(() => {
    const checkPermissions = () => {
      navigator.permissions.query({ name: "camera" }).then((result) => {
        if (result.state === "granted") {
          setCameraPermission(true);
        } else {
          setCameraPermission(false);
          setShowCamera(false);
        }
      });

      navigator.permissions.query({ name: "microphone" }).then((result) => {
        if (result.state === "granted") {
          setVoicePermission(true);
        } else {
          setVoicePermission(false);
          setShowCamera(false);
        }
      });
    };

    const permissionCheckInterval = setInterval(checkPermissions, 1000);

    return () => {
      clearInterval(permissionCheckInterval);
    };
  }, []);

  useEffect(() => {
    if (cameraPermission && voicePermission) {
      setShowCamera(true);
    }
  }, [cameraPermission, voicePermission]);

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.querySelector("video");
          videoElement.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          setVideoError(err);
        });
    }
  }, [showCamera]);

  return (
    <>
      <div className="flex flex-col gap-10 w-screen min-h-screen bg-slate-600 no-select pt-24 px-52">
        <h1 className="text-5xl">ENTRANCE EXAM</h1>
        <div className="flex justify-between bg-white text-slate-600 p-5 rounded-md">
          <p className="text-xl">
            Duration - <span className=" font-bold">2 Hours</span>
          </p>
          <p className="text-xl">
            Program - <span className=" font-bold">B. Tech</span>
          </p>
          <p className="text-xl">
            Total Marks - <span className=" font-bold">100</span>
          </p>
          <p className="text-xl">
            Total No of questions - <span className=" font-bold">50</span>
          </p>
        </div>
        <div className="flex flex-col gap-8 mt-10">
          <h3 className="text-2xl">INSTRUCTIONS</h3>
          <ul>
            {instructions.map((instruction, index) => (
              <li type="circle" key={index} className="text-lg mb-3">
                {instruction}
              </li>
            ))}
          </ul>
        </div>
        {videoError && (
          <div className="text-red-500">{`Error accessing camera: ${videoError.message}`}</div>
        )}
        {!showCamera && (
          <div className="mt-4">
            <h3 className="text-2xl">Permissions</h3>
            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={handleCameraPermission}
                className={`flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:opacity-80 ${
                  cameraPermission ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={cameraPermission}
              >
                <FaCamera className="mr-2" /> Allow Camera
              </button>
              <button
                onClick={handleVoicePermission}
                className={`flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:opacity-80 ${
                  voicePermission ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={voicePermission}
              >
                <FaMicrophone className="mr-2" /> Allow Microphone
              </button>
            </div>
          </div>
        )}
        {showCamera && !videoError && (
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h3 className="text-2xl">Camera View</h3>
              <video
                className="mt-2 w-64 h-48 rounded-md border border-gray-400"
                autoPlay
                playsInline
                muted
                onLoadedMetadata={(e) => console.log("Video metadata:", e)}
                onError={(e) => {
                  setVideoError(e.target.error);
                }}
              ></video>
            </div>
            <div>
              <Link to={"/sections"}>
                <button
                  className={`mt-100 flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:opacity-80`}
                >
                  Proceed
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Instruction;
