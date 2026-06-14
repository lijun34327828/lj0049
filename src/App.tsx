import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import EditorPage from "@/pages/EditorPage";
import PreviewPage from "@/pages/PreviewPage";

const isPreviewMode = import.meta.env.VITE_IS_PREVIEW === 'true';
const appMode = import.meta.env.VITE_APP_MODE;

export default function App() {
  if (isPreviewMode || appMode === 'preview') {
    return <PreviewPage />;
  }

  if (appMode === 'editor') {
    return <EditorPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
