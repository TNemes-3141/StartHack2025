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
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const transcription = await openai.audio.transcriptions.create({
      file: stream,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error(error);
    return "Failed to generate response:" + error;
  }
}