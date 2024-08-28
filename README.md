### Web App
http://ec2-3-126-82-64.eu-central-1.compute.amazonaws.com/


![image](https://github.com/user-attachments/assets/fd854f18-c199-4586-8781-d1e1a04f303e)



# Car Model Price Scraper and API

## Overview

The project is designed to scrape car model prices from the website [otomoto.pl](https://www.otomoto.pl), calculate the average prices, store this data, and make it accessible through a REST API. The project leverages various AWS services such as Lambda, DynamoDB, SNS, CodeBuild, EC2, and Cognito, providing a scalable and secure solution for tracking car prices.

## Architecture

The architecture consists of several components working together to scrape data, process it, store it, and make it available to users through a web interface and API:

### 1. Web Scraping and Data Processing (AWS Lambda)
- **Functionality**: An AWS Lambda function is triggered to scrape all car model offers from otomoto.pl, calculate the average price, and send the data to DynamoDB for storage.
- **Trigger**: This Lambda function is executed every day by EventBridge schedule.

### 2. Data Storage (DynamoDB)
- **Functionality**: The average price data for car models, along with the date of extraction, is stored in an AWS DynamoDB table. This table serves as the primary data source for the rest of the application.

### 3. Notification and Email Formatting (AWS SNS & Lambda)
- **Functionality**: After the average prices are calculated, a Lambda function formats this data and sends it to an SNS topic. Subscribers to this topic (e.g., email addresses) receive the formatted data.
- **SNS Topic**: A separate SNS topic is set up to handle the distribution of the formatted price data.

### 4. Continuous Integration and Deployment (CodeBuild & GitHub)
- **Functionality**: The project is integrated with AWS CodeBuild for continuous integration. Any changes in the main Lambda function code in the GitHub repository trigger a build process that creates a deployment package and updates the Lambda function.
- **Automation**: This setup ensures that the Lambda function is always running the latest code version.

### 5. Web Interface and API (EC2, Node.js, REST API Gateway, Cognito)
- **Website (EC2)**: An EC2 instance hosts a Node.js application that serves a web interface. This interface provides charts and visualizations generated from the data stored in DynamoDB.
- **REST API Gateway**: The REST API, hosted on AWS API Gateway, allows users to query the average prices by car model. The API integrates with Cognito for user authentication, ensuring that only authorized users can access the data.
- **User Authentication (Cognito)**: AWS Cognito is used to manage user authentication. The API requests are authenticated using tokens provided by Cognito.

## Components

- **AWS Lambda**: Used for data scraping, processing, and API response generation.
- **AWS DynamoDB**: Serves as the database for storing car model price data.
- **AWS SNS**: Handles notification and email distribution.
- **AWS CodeBuild**: Manages continuous integration and deployment.
- **AWS EC2**: Hosts the web application interface.
- **AWS API Gateway**: Provides a RESTful API for accessing the stored data.
- **AWS Cognito**: Manages user authentication for API access.



## Usage

- **Web Interface**: Access the web interface hosted on EC2 to view charts and visualizations of car price data.
- **API**: Use the REST API to programmatically access car model prices by sending requests with a valid Cognito authentication token.


