import requests
import json

def fetch_ohlcv_data(symbol, start_date, end_date, api_key):
    base_url = f"https://financialmodelingprep.com/api/v3/historical-price-full/{symbol}"
    params = {
        "from": start_date,
        "to": end_date,
        "apikey": api_key
    }

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=4))  # Pretty print JSON
    else:
        print(f"Request failed with status code {response.status_code}")
        print(response.text)

# Example usage
if __name__ == "__main__":
    symbol = "AAPL"
    start_date = "2023-10-10"
    end_date = "2023-10-12"
    api_key = "Ct4XUOtrsCbgQX9sgVU4ZFjaWj8MFrac"

    fetch_ohlcv_data(symbol, start_date, end_date, api_key)
