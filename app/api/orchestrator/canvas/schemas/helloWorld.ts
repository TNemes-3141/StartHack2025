import { ResponseFormatJSONSchema } from "openai/resources/shared";

export const helloWorldResponse: ResponseFormatJSONSchema = {
    type: "json_schema",
    json_schema: {
      name: "hello_world_response",
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Short natural language response from the assistant to the user"
          }
        },
        required: ["message"],
        additionalProperties: false
      },
      strict: true
    }
  };