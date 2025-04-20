import { ResponseFormatJSONSchema } from "openai/resources/shared";

export const components: ResponseFormatJSONSchema = {
  type: "json_schema",
  json_schema: {
    name: "card_components",
    schema: {
      type: "object",
      description: "Structured financial dashboard components",
      properties: {
        cards: {
          type: "array",
          description: "A list of insight cards to show on the dashboard",
          items: {
            type: "object",
            required: ["type", "title", "data"],
            additionalProperties: false,
            properties: {
              type: {
                type: "string",
                enum: ["line", "candle", "news", "kpi", "pie", "table"],
                description: "The type of insight card"
              },
              title: {
                type: "string",
                description: "A descriptive title for the card"
              },
              data: {
                anyOf: [
                  {
                    type: "array",
                    description: "Line chart data",
                    items: {
                      type: "object",
                      required: ["x", "y"],
                      properties: {
                        x: { type: "string", description: "label in YYYY-MM-DD format" },
                        y: { type: "number", description: "data point" }
                      },
                      additionalProperties: false
                    }
                  },
                  {
                    type: "array",
                    description: "Candle chart data",
                    items: {
                      type: "object",
                      required: ["x", "y"],
                      properties: {
                        x: { type: "string", description: "label in YYYY-MM-DD format" },
                        y: {
                          type: "array",
                          description: "An array representing an OHLC (Open, High, Low, Close) datapoint. Contains exactly 4 entries.",
                          items: { type: "number" },
                        }
                      },
                      additionalProperties: false
                    }
                  },
                  {
                    type: "object",
                    description: "KPI data",
                    required: ["number", "footer"],
                    properties: {
                      number: { type: "number", description: "KPI number" },
                      footer: { type: "string", description: "KPI footer" }
                    },
                    additionalProperties: false
                  },
                  {
                    type: "object",
                    description: "Pie chart data",
                    required: ["label", "data"],
                    properties: {
                      label: {
                        type: "array",
                        items: { type: "string", description: "chart segment labels" }
                      },
                      data: {
                        type: "array",
                        items: { type: "number", description: "chart segment size" }
                      }
                    },
                    additionalProperties: false
                  },
                  {
                    type: "object",
                    description: "News data",
                    required: ["content", "source"],
                    properties: {
                      content: { type: "string", description: "news fragment" },
                      source: { type: "string", description: "source link" }
                    },
                    additionalProperties: false
                  },
                  {
                    type: "object",
                    description: "Tabular data",
                    required: ["header", "content"],
                    additionalProperties: false,
                    properties: {
                      header: {
                        type: "array",
                        description: "Column headers for the table",
                        items: { type: "string" }
                      },
                      content: {
                        type: "array",
                        description: "Array of rows; each row is an array of {key, value} objects where 'key' corresponds to a column header",
                        items: {
                          type: "array",
                          items: {
                            type: "object",
                            required: ["key", "value"],
                            properties: {
                              key: { type: "string" },
                              value: { type: "string" }
                            },
                            additionalProperties: false
                          }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      required: ["cards"],
      additionalProperties: false
    },
    strict: true
  }
};
