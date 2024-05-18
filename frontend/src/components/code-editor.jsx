import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import { socket } from "@/socket";
import { LangSelect } from "@/components/lang-select";
import BOILERPLATE from "@/contants";
import Output from "./output";

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(BOILERPLATE.python);
  const [language, setlanguage] = useState("python");
  const onLangChange = (value) => {
    setlanguage(value);
    setCode(BOILERPLATE[value]);
  };

  useEffect(() => {
    socket.on("code-change", (message) => {
      setCode(message);
    });
  });

  const setCodeAndEmitEvent = (value) => {
    setCode(value);
    socket.emit("code-change", value);
  }

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  return (
    <div className="flex flex-col gap-4">
      <LangSelect language={language} onSelect={onLangChange} />
      <Editor
        width="100%"
        height="55vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCodeAndEmitEvent(value)}
        onMount={handleEditorDidMount}
      />

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

export default CodeEditor;
