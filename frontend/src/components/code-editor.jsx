import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";
import { LangSelect } from "@/components/lang-select";
import BOILERPLATE from "@/contants";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [code, setcode] = useState(BOILERPLATE.javascript);
  const [language, setlanguage] = useState("javascript");
  const onLangChange = (value) => {
    setlanguage(value);
    setcode(BOILERPLATE[value]);
  };
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  return (
    <div className="flex flex-col gap-4">
      <LangSelect language={language} onSelect={onLangChange} />
      <Editor
        width="100%"
        height="75vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setcode(value)}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
