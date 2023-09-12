import { useState } from "react";
import Message from "./chat/message";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import audioRecorder from "@/lib/audioRecorder";
import converter from "@/lib/converter";
import webService from "@/service/webService";

export default function Layout() {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = () => {
    setIsRecording(true);
    audioRecorder.start().then(() => {
      console.log("Recording audio");
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    audioRecorder
      .stop()
      .then((blob) => converter.blobToBase64(blob))
      .then((res) => {
        const reqBody = {
          file_name:
            Math.floor(Math.random() * (99999999999 - 1 + 1) + 1) + ".wav",
          file_content: res,
        };
        webService.upload("en", reqBody).then((res) => console.log(res));
      });
  };

  const getLangs = () => {
    webService.getSupportedLangs().then((res) => console.log(res));
  };

  return (
    <div className="w-full h-full bg-slate-100">
      <div className="flex flex-col h-full max-w-3xl gap-2 p-8 mx-auto">
        {/* <div className="flex justify-between">
          <h1 className="text-xl font-bold">Voice to Text</h1>
          <Button className="">Record Voice</Button>
        </div> */}
        <Card className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 gap-2 p-2 overflow-auto">
            <Message from="me" msg="this is content" lng="en" />
            <Message from="ai" msg="this is content" lng="en" />
          </div>
          <div className="flex items-center gap-2 p-2">
            <div className="border border-solid h-[35px] rounded-sm flex-1"></div>
            <Button onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? "Stop Recording" : "Record Voice"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
