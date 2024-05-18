import CodeEditor from "@/components/code-editor";

import { AspectRatio } from "@/components/ui/aspect-ratio";

const Interview = () => {
  return (
    <div className="flex items-center h-screen gap-[10px]">
      <div className="flex justify-center items-center mt-2.5 w-9"></div>
      <div className=" m-4 w-3/5">
        <CodeEditor />
      </div>
      <div className="flex flex-col gap-[54px]">
        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Image"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>

        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Image"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>
        <div className=" h-[200px] border border-white rounded"></div>
      </div>
    </div>
  );
};

export default Interview;
