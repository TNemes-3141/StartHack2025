import { helloWorldResponse } from "./schemas/helloWorld";
import OpenAI from "openai";

type AiResponse = {
    message: string,
}

export async function getHello(ai: OpenAI): Promise<AiResponse | undefined> {
    try {
        const query = `Say "Hello world!`;

        const completion = await ai.beta.chat.completions.parse({
            model: "gpt-4.1",
            messages: [
                { role: "user", content: query },
            ],
            response_format: helloWorldResponse
        });

        if (completion.choices[0].finish_reason === "length") {
            throw new Error("Incomplete response");
        }

        const response = completion.choices[0].message.parsed;

        if (response) {
            return {
                message: JSON.stringify(response["message"])
            };
        }
        else {
            return {
                message: ""
            };
        }
    } catch (error) {
        console.error(`Error calling:`, error);
        return undefined
    }
}
