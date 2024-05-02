import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Sections = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [voicePermission, setVoicePermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const navigate = useNavigate();

  const sections = [
    { id: "1", name: "Maths", questionCount: 20 },
    { id: "2", name: "Physics", questionCount: 15 },
    { id: "3", name: "Chemistry", questionCount: 15 },
  ];

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
          navigate("/");
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

  const handleSubmitExam = () => {
    setCameraPermission(false); // Remove camera permission
    setVoicePermission(false); // Remove microphone permission
    setShowCamera(false); // Hide camera view
    navigate("/"); // Navigate back to home or wherever you want
    alert("Exam Submitted");
  };

  return (
    <>
      <div className="flex flex-col gap-10 w-screen min-h-screen bg-slate-600 no-select pt-24 px-52">
        <h1 className="text-5xl">SECTIONS</h1>
        <div className="flex flex-col gap-8">
          {sections.map((section, idx) => {
            return (
              <>
                <div
                  className="flex justify-between bg-white text-slate-600 p-5 rounded-md cursor-pointer hover:border-2 hover:border-white hover:text-white hover:bg-slate-600 hover:box-border"
                  key={idx}
                  onClick={() => {
                    navigate(`/questions/${section.id}`);
                  }}
                >
                  <span>
                    Section - <span className=" font-bold">{idx + 1}</span>
                  </span>
                  <span>
                    <span className=" font-bold">{section.name}</span>
                  </span>
                  <span>
                    Number of Questions -
                    <span className=" font-bold">{section.questionCount}</span>
                  </span>
                </div>
              </>
            );
          })}
        </div>
        <div className="mt-20">
          <button
            className={`mt-100 flex items-center justify-center py-2 px-4 rounded-lg bg-red-500 text-white hover:opacity-80`}
            onClick={() => {
              handleSubmitExam();
            }}
          >
            Submit Exam
          </button>
        </div>
      </div>
      {showCamera && !videoError && (
        <div
          style={{ position: "fixed", bottom: "5px", right: "5px" }}
          className="mt-4 flex items-end justify-between"
        >
          <div>
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
        </div>
      )}
    </>
  );
};

export default Sections;
