import { BrowserRouter, Route, Routes } from "react-router-dom";
import Exams from "./components/Exams";
import Sections from "./components/Sections";
import "./App.css";
import Questions from "./components/Questions";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Exams />} />
        <Route path="/sections" element={<Sections />} />
        <Route path="/questions/:id" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
