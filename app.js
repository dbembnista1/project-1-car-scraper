const AWS = require('aws-sdk');
const express = require('express');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const path = require('path');
const moment = require('moment'); // Import Moment.js
require('chartjs-adapter-moment'); // Import the moment adapter

// Set up DynamoDB client (credentials are automatically handled by the IAM role)
AWS.config.update({ region: 'eu-central-1' }); // Change to your region
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'car_prices'; // Replace with your DynamoDB table name

// Express setup
const app = express();
const port = 3000;

// Chart.js setup
const width = 800; // width of the chart
const height = 600; // height of the chart
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

app.get('/', async (req, res) => {
  // Fetch data from DynamoDB
  const params = {
    TableName: tableName
  };

  try {
    const data = await dynamodb.scan(params).promise();
    const items = data.Items;

    // Discover all car models
    const carModels = new Set();
    items.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') { // Assuming 'date' is the only non-car model key
          carModels.add(key);
        }
      });
    });

    // Generate charts for each car model
    const charts = {};
    for (const model of carModels) {
      const dates = [];
      const prices = [];

      items.forEach(item => {
        if (item[model]) {
          dates.push(item.date);
          prices.push(Number(item[model]));
        }
      });

      if (dates.length > 0) {
        // Parse and sort data by date using Moment.js
        const sortedData = dates.map((date, i) => ({
          date: moment(date, 'DD-MM-YY HH:mm:ss').toDate(),
          price: prices[i]
        })).sort((a, b) => a.date - b.date);

        console.log(`Sorted Data for ${model}:`, sortedData); // Debugging output

        // Generate chart
        const configuration = {
          type: 'line',
          data: {
            labels: sortedData.map(data => data.date),
            datasets: [{
              label: `${model} Price`,
              data: sortedData.map(data => data.price),
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            }]
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  tooltipFormat: 'DD-MM-YY HH:mm:ss', // Format for tooltip
                }
              }
            },
            plugins: {
              legend: {
                display: true
              }
            }
          }
        };

        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        charts[model] = image.toString('base64'); // Store the chart as a Base64 string
      }
    }

    // Create HTML content
    let htmlContent = '<html><head><title>Car Prices</title></head><body>';
    htmlContent += '<h1>Car Prices Over Time</h1>';

    for (const [model, chart] of Object.entries(charts)) {
      htmlContent += `<h2>${model}</h2>`;
      htmlContent += `<img src="data:image/png;base64,${chart}" alt="${model} chart">`;
    }

    htmlContent += '</body></html>';

    // Send the HTML content
    res.send(htmlContent);

  } catch (err) {
    console.error('Error fetching data from DynamoDB', err);
    res.status(500).send('Error generating charts');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
