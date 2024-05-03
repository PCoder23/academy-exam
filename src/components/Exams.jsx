import { useEffect, useState } from "react";
import Instruction from "./Instruction";

const Exams = () => {

  //   useEffect(() => {
  //       const handleKeyDown = (e) => {
  //           if (e.ctrlKey && e.shiftKey && e.key === 'I') {
  //             alert('Developer tools are disabled');
  //             return false; 
  //           }
  //         };
      
  //         document.addEventListener('keydown', handleKeyDown);

  //   const noSelectElements = document.querySelectorAll(".no-select");
  //   noSelectElements.forEach((element) => {
  //     element.style.webkitUserSelect = "none";
  //     element.style.mozUserSelect = "none";
  //     element.style.msUserSelect = "none";
  //     element.style.userSelect = "none";
  //   });
  //   const handleVisibilityChange = () => {
  //     console.log("Visibility changed to", document.visibilityState);
  //     if (document.hidden) {
  //       alert("You are not allowed to switch tabs during the exam");
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    alert("Right click not allowed");
  };
  const handleCopyPaste = (e) => {
    e.preventDefault();
    alert("Copy-Paste not allowed");
  };

  return (
    <div
      // onContextMenu={handleContextMenu}
      // onCopy={handleCopyPaste}
      // onCut={handleCopyPaste}
      // onSelect={handleCopyPaste}
    >
      <Instruction />
    </div>
  );
};

export default Exams;
