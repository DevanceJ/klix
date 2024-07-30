import { Button } from "@/components/ui/button";
import { useState } from "react";
import { executeCode } from "../api";
import Prop from "prop-types";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    setIsError(false);
    setOutput(null);
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      setIsLoading(false);
      return;
    }
    try {
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex p-5 h-52 rounded border border-gray-500 text-gray-500">
        {isLoading ? (
          <p>Running...</p>
        ) : isError ? (
          <p className="text-red-500">
            An error occurred while executing the code.
          </p>
        ) : output ? (
          output.map((line, i) => (
            <p className="text-white" key={i}>
              {line}
            </p>
          ))
        ) : (
          'Click "Run Code" to see the output here'
        )}
      </div>
      <div>
        <Button onClick={runCode} disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            "Run Code"
          )}
        </Button>
      </div>
    </div>
  );
};

Output.propTypes = {
  editorRef: Prop.object.isRequired,
  language: Prop.string.isRequired,
};

export default Output;
