import requests
from bs4 import BeautifulSoup
import time
import random
import re
import boto3
from datetime import datetime
import os

def fetch_car_prices(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")
    prices = []
    for item in soup.select("h3.efpuxbr16.ooa-1n2paoq.er34gjf0"):
        price = item.get_text(strip=True).replace(" ", "").replace("PLN", "")
        try:
            prices.append(int(price))
        except ValueError:
            continue
    return prices

def extract_car_company_and_model_from_url(url):
    match = re.search(r'/osobowe/([^/]+)/([^/]+)/', url)
    if match:
        company = match.group(1).capitalize()
        model = match.group(2).upper()
        return company, model
    return "Unknown", "Unknown"

def fetch_prices_from_multiple_urls(urls):
    all_prices = {}
    for url in urls:
        car_company, car_model = extract_car_company_and_model_from_url(url)
        print(f"Pobieranie cen dla: {car_company} {car_model}")
        car_prices = fetch_car_prices(url)
        if car_prices:
            average_price = int(sum(car_prices) / len(car_prices))
            print(f"Średnia cena dla {car_company} {car_model}: {average_price} PLN")
            all_prices[f"{car_company} {car_model}"] = {
                "prices": car_prices,
                "average_price": average_price
            }
        else:
            print(f"Nie znaleziono cen dla {car_company} {car_model}.")
        time.sleep(random.uniform(2, 6))  # To avoid making requests too quickly
    summary = {car: data['average_price'] for car, data in all_prices.items()}
    return summary

# Initialize the DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
table_name = 'car_prices'
table = dynamodb.Table(table_name)

def add_car_prices(prices_average):
    now = datetime.now()
    timestamp = now.strftime("%d-%m-%y %H:%M:%S")
    item = {'date': timestamp}
    item.update(prices_average)
    table.put_item(Item=item)
    print("Car prices added to the DB table.")

def lambda_handler(event, context):
    # Retrieve URLs from environment variables
    urls = os.environ.get('URLS', '').split(',')

    if not urls or urls == ['']:
        raise ValueError("No URLs provided in environment variables")

    summary = fetch_prices_from_multiple_urls(urls)
    add_car_prices(summary)
    return summary


