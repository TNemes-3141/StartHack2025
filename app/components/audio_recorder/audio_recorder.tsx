'use client'
import { transcribe } from "@/app/api/generate/actions";
import { Button } from "@heroui/button";
import { Mic, MicOff } from "lucide-react";
import React, { useState, useRef } from "react";

const AudioRecorder = (props: {
  onWhisperResponse: (response: string) => void,
  className?: string,
}) => {
  const [isRecording, setIsRecording] = useState(false); // Track recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Store MediaRecorder instance
  const audioChunksRef = useRef<Blob[]>([]); // Store audio chunks


  const sendAudioToServer = async (audioUrl: string) => {
    console.log("sending audio rn." + audioUrl);
    if (audioUrl) {

      console.log("there exists an audioURL");
      
      const audioBlob = await fetch(audioUrl).then((res) => res.blob());
      const response = await transcribe({blob: audioBlob});
      props.onWhisperResponse(response);
    }
  };

  // Start or stop recording based on current state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();

    } else {
      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // Create a new MediaRecorder instance
        mediaRecorderRef.current = new MediaRecorder(stream);

        // On data available (when recording), push audio data to chunks
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        // On stop (when recording is stopped), create a Blob and URL
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          sendAudioToServer(audioUrl);

          audioChunksRef.current = []; // Clear the chunks for next recording
        };

        // Start recording
        mediaRecorderRef.current.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    // Toggle the recording state
    setIsRecording(!isRecording);
  };

  return <>
    <div className={props.className}>
      <Button onPress={toggleRecording} isIconOnly className="h-full w-full" >
        {isRecording ? <MicOff /> : <Mic />}
      </Button>
    </div>
  </>
};

export default AudioRecorder;