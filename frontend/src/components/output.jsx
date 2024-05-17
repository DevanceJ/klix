import { Button } from "@/components/ui/button";
import { useState } from "react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    console.log("Button clicked");
    if (!sourceCode) return;
    try {
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      //   toast({
      //     title: "An error occurred.",
      //     description: error.message || "Unable to run code",
      //     status: "error",
      //     duration: 6000,
      //   });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex p-5 h-52 rounded border border-gray-500 text-gray-500">
        {output
          ? output.map((line, i) => (
              <p className="text-white" key={i}>
                {line}
              </p>
            ))
          : 'Click "Run Code" to see the output here'}
      </div>
      {/* Need to add a loader function to the button and stylise the frontend to look better, will do later */}
      <div>
        <Button onClick={runCode}> Run Code</Button>
      </div>
    </div>
  );
};

export default Output;
