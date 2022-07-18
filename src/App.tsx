import "./App.css";

import { Add } from "@mui/icons-material";
import { Button, CssVarsProvider } from "@mui/joy";
import { Fab } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Editor from "./features/editor/Editor";
import Feed from "./features/feed/Feed";
import Viewer from "./features/Viewer/Viewer";

function App() {
  return (
    <CssVarsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/forms" replace />} />
          <Route path="/forms" element={<Feed />} />
          <Route path="/forms/:formId" element={<Editor />} />
          <Route path="/forms/:formId/view" element={<Viewer />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
