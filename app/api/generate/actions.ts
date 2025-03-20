"use server"

import fs from "fs";
import openai from '@/lib/openai/openai';
import { Readable } from "stream";

export type GenerateRequest = {
  prompt: string;
}


export async function generateResponse(request: GenerateRequest) {
  const prompt = request.prompt;

  if (!prompt) {
    return "Prompt is required";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Failed to generate response:" + error;
  }
}


export type TransciptionRequest = {
  blob: Blob;
}

export async function transcribe(request: TransciptionRequest) {
  const { blob } = request;

  try {
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    // Create a File object that OpenAI's API can accept
    // The OpenAI SDK expects a File object, not a FormData object
    const file = new File([buffer], "audio.wav", { type: "audio/wav" });
    
    // Send to OpenAI API with proper parameters
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      language: "en",
      model: "whisper-1",
    });
    
    return transcription.text;
  } catch (error) {
    console.error(error);
    return "Failed to generate response:" + error;
  }
}

export async function textToSpeech(text: string): Promise<Blob> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "ash",
    input: text,
  });

  // Read the response as an ArrayBuffer
  const arrayBuffer = await response.arrayBuffer();

  // Convert ArrayBuffer to Blob
  return new Blob([arrayBuffer], { type: "audio/mpeg" });
}