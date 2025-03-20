'use client'
import { Button } from "@heroui/button";
import { Mic, MicOff } from "lucide-react";
import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false); // Track recording state
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Audio file URL
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Store MediaRecorder instance
  const audioChunksRef = useRef<Blob[]>([]); // Store audio chunks

  const sendAudioToServer = async () => {
    console.log("sending audio rn.");
    if (audioUrl) {

      console.log("there exists an audioURL");
      downloadAudio();

      // const audioBlob = await fetch(audioUrl).then((res) => res.blob());
      // const formData = new FormData();
      // formData.append("audio", audioBlob, "recording.wav");

      // try {
      //   const response = await fetch("/api/upload-audio", {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (response.ok) {
      //     console.log("Audio file uploaded successfully.");
      //   } else {
      //     console.error("Failed to upload audio.");
      //   }
      // } catch (error) {
      //   console.error("Error uploading audio:", error);
      // }
    }
  };

  // Start or stop recording based on current state
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      sendAudioToServer();
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
          setAudioUrl(audioUrl);
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




  // Download the audio file when clicked
  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = "recording.wav"; // Specify the file name
      link.click();
    }
  };

  return (
    <Button className="h-full aspect-square" onPress={toggleRecording} isIconOnly>
      {isRecording ? <MicOff /> : <Mic />}
    </Button>
  );
};

export default AudioRecorder;