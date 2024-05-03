import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionNavigator from "./QuestionNavigator";
import * as faceapi from "face-api.js";

const Questions = () => {
  const videoRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [voicePermission, setVoicePermission] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 3,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 4,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 5,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 6,
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correctAnswer: "Paris",
    },
    {
      id: 7,
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "J.K. Rowling", "Stephen King", "George Orwell"],
      correctAnswer: "Harper Lee",
    },
  ];

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  useEffect(() => {
    const checkPermissions = () => {
      navigator.permissions.query({ name: "camera" }).then((result) => {
        if (result.state === "granted") {
          setCameraPermission(true);
        } else {
          setCameraPermission(false);
          setShowCamera(false);
          navigate("/");
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

  useEffect(() => {
    async function detectFaces() {
      console.log("Loading models");
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      console.log("Detecting faces");
      // check the number of faces in the video stream and alert if more than one face is detected or if no face detected in the video stream
      const video = videoRef.current;
      if (video === null) return;
      const canvas = faceapi.createCanvas(video);
      document.body.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      setInterval(async () => {
        console.log("Checking faces");
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        console.log(detections);
        if (detections.length === 0) {
          alert("No face detected in the video stream");
        } else if (detections.length > 1) {
          alert("More than one face detected in the video stream");
        }else{
          console.log(detections.length);
        }
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }, 3000);

      
    }
    if (showCamera && videoRef.current !== null && !videoError){
      detectFaces();
    }
  }, [showCamera]);

  return (
    <>
      <div className="flex gap-20 w-screen min-h-screen text-black bg-white no-select pr-40">
        <div className="bg-slate-600 pt-24 px-10">
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
        </div>

        <div className="pt-8 w-3/4">
          <div className="flex justify-end">
            <button
              className={`mt-100 flex items-center justify-center py-2 px-4 rounded-lg bg-red-500 text-white hover:opacity-80`}
              onClick={() => {
                navigate("/sections");
                alert(`Section ${id} Submitted`);
              }}
            >
              Submit Section
            </button>
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-5">
              Question {currentQuestionIndex + 1}
            </h1>
            {questions.map((question, index) => (
              <div
                key={question.id}
                style={{
                  display: index === currentQuestionIndex ? "block" : "none",
                }}
              >
                <h2 className=" font-medium text-lg mb-5">
                  {question.question}
                </h2>
                <div className="flex flex-col gap-3">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        className="cursor-pointer"
                        type="radio"
                        id={`option-${optionIndex}`}
                        name={`question-${question.id}`}
                        value={option}
                      />
                      <label className="ml-2" htmlFor={`option-${optionIndex}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-10 flex gap-5">
              {currentQuestionIndex > 0 && (
                <button
                  className={`mt-100 flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:opacity-80`}
                  onClick={handlePreviousQuestion}
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 && (
                <button
                  className={`mt-100 flex items-center justify-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:opacity-80`}
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              )}
            </div>
          </div>
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
              ref={videoRef}
            ></video>
          </div>
        </div>
      )}
    </>
  );
};

export default Questions;
