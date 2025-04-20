import { ResponseFormatJSONSchema } from "openai/resources/shared";

export const insightsResponse: ResponseFormatJSONSchema = {
  type: "json_schema",
  json_schema: {
    name: "insights_response",
    schema: {
      type: "object",
      properties: {
        insights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: {
                type: "string",
                description: "The label of the context data used (e.g. [Market_Data 1])"
              },
              title: {
                type: "string",
                description: "A summarizing title for the insight"
              },
              type: {
                type: "string",
                enum: ["LineData", "CandleData", "PieData", "KpiData", "NewsData", "TableData"],
                description: "The type of the insight card"
              },
              instructions: {
                type: "string",
                description: "Instructions for rendering or what content to show from the context data"
              }
            },
            required: ["label", "title", "type", "instructions"],
            additionalProperties: false
          },
          description: "List of insights generated for the user's query"
        },
        message: {
          type: "string",
          description: "Short natural language response from the assistant to the user"
        }
      },
      required: ["insights", "message"],
      additionalProperties: false
    },
    strict: true
  }
};
