/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import { LangSelect } from "@/components/lang-select";
// import BOILERPLATE from "@/contants";
import Output from "./output";
import Prop from "prop-types";
const CodeEditor = ({ socketRef, roomId, onCodeChange, onLanguageChange }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  // const isTypingLocal = useRef(false);
  const onLangChange = (value) => {
    // const newCode = BOILERPLATE[value];
    onLanguageChange(value);
    socketRef.current.emit("language-change", { roomId, language: value });
    setLanguage(value);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const handleCodeChange = (value) => {
    setCode(value);
    onCodeChange(value);
    socketRef.current.emit("code-change", { roomId, code: value });
  };

  useEffect(() => {
    // console.log("roomId", roomId);
    // console.log("socketRef", socketRef);
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null) {
          setCode(code);
          onCodeChange(code);
          // editorRef.current?.setValue(code);
        }
      });
      socketRef.current.on("language-change", ({ language }) => {
        if (language !== null) {
          setLanguage(language);
          onLanguageChange(language);
        }
      });
    }
    return () => {
      socketRef.current.off("code-change");
      socketRef.current.off("language-change");
    };
  }, [socketRef.cuurent]);
  return (
    <div className="flex flex-col gap-4">
      <LangSelect language={language} onSelect={onLangChange} />
      <Editor
        width="100%"
        height="55vh"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => {
          handleCodeChange(value);
        }}
        onMount={handleEditorDidMount}
      />

      <Output editorRef={editorRef} language={language} />
    </div>
  );
};

CodeEditor.propTypes = {
  // socketRef: Prop,
  roomId: Prop.string,
  onCodeChange: Prop.func,
  onLanguageChange: Prop.func,
};
export default CodeEditor;
