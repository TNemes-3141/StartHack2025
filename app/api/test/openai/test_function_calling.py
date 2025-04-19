from openai import OpenAI
import json

client = OpenAI(api_key="")

def load_function_schemas(json_files):
    tools = []
    for file_path in json_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                tool_schema = json.load(f)
                tools.append(tool_schema)
        except Exception as e:
            print(f"Failed to load {file_path}: {e}")
    return tools

# Example usage
if __name__ == "__main__":
    # Option 1: Explicit list of file paths
    json_files = [
        "./app/api/test/fmp/balance_sheet_data.json",
        "./app/api/test/fmp/company_data.json",
        "./app/api/test/fmp/daily_stock_eod_data.json",
        "./app/api/test/fmp/full_quote.json",
        "./app/api/test/fmp/intraday_stock_data.json",
        "./app/api/test/fmp/key_metrics_data.json",
        "./app/api/test/fmp/market_cap_data.json",
        "./app/api/test/fmp/sector_performance_data.json",
        "./app/api/test/fmp/stock_price_change_data.json",
        "./app/api/test/fmp/stock_screener.json",
    ]
    
    # Option 2: Automatically read all JSON files in a directory
    # json_files = [os.path.join("schemas", f) for f in os.listdir("schemas") if f.endswith(".json")]

    tools = load_function_schemas(json_files)

    system_prompt = """You will be acting as a part of a pipeline meant to provide wealth managers, portfolio managers and financial analysts with valuable insights in their decision making regarding their queries. It enables a completely novel human-AI interaction where users can work with information with minimal text input. At the end of the pipeline, components like charts, text paragraphs and KPIs will be generated that are relevant to the user's query.

    You should adhere to the provided specifications completely.

    In this stage, you will make queries to your tools to gather relevant information. Output the queries that should be made to these tools in their respectively correct formats. The results of the queries should be directly relevant to solve the user's question.

    Here is the user's question: I would like to invest in some high-dividend stocks. Which should I buy?

    Today's date is 2025-04-19. What information would you retrieve from your tools to help the user solve his case? Think of companies whose data could be relevant. Think first before you respond."""
    
    completion = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": system_prompt}],
        tools=tools,
        tool_choice="required"
    )

    tool_calls = completion.choices[0].message.tool_calls

    for tool_call in tool_calls:
        print(tool_call.function.name + ":")
        print(tool_call.function.arguments + "\n")
