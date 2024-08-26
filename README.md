otomoto srednie ceny dla rocznika dla modelu suva  
trend sredniej ceny, wykres  
powiadomienia mailowe z srednia cena  
strona www z srednia cena  

### Web App
http://ec2-3-126-82-64.eu-central-1.compute.amazonaws.com/


![image](https://github.com/user-attachments/assets/efea81e0-62ec-45eb-bc44-b64371d3a214)





### Project Components:
1. **Lambda Function**:
   - **Tasks**: Web scraping, storing data in DynamoDB, sending emails via STS. Python beautiful soap
   - **Advantages**: Serverless, cost-efficient, scalable.
   - **Considerations**: Ensure Lambda has sufficient permissions for DynamoDB and STS.

2. **DynamoDB**:
   - **Purpose**: Store data and calculate the average car model prices daily.
   - **Advantages**: Fully managed NoSQL database, high performance, scalable.
   - **Considerations**: Design the table schema carefully to handle the data structure.

3. **STS (Simple Email Service)**:
   - **Purpose**: Send emails.
   - **Advantages**: Reliable email sending service.
   - **Considerations**: Configure the email settings and permissions correctly.

4. **EC2 Instance**:
   - **Purpose**: Host an Apache web server with a Node.js application to retrieve data from DynamoDB.
   - **Advantages**: Flexible server configuration.
   - **Considerations**: Ensure the EC2 instance is properly secured and optimized for your use case.

5. **Internet Gateway**:
   - **Purpose**: Provide access to the web server from the internet.
   - **Advantages**: Allows users to access the application.
   - **Considerations**: Set up proper security groups and firewalls.

6. **WWW.otomoto.pl**:
   - **Purpose**: Source website for scraping data.
   - **Considerations**: Make sure to comply with the website’s terms of service regarding web scraping.

### General Considerations:
- **Security**: Implement IAM roles and policies to control access to resources.
- **Cost Management**: Monitor and manage costs, especially for EC2 and Lambda usage.
- **Scalability**: Ensure the architecture can handle the load as the project grows.
- **Error Handling**: Implement robust error handling and logging for debugging and maintenance.
- **Compliance**: Ensure compliance with legal and ethical guidelines, especially regarding web scraping.

### Next Steps:
1. **Setup IAM roles and policies** for your Lambda function and EC2 instance.
2. **Develop the Lambda function** to handle web scraping and data storage.
3. **Configure DynamoDB** tables to store and query your data effectively.
4. **Set up EC2** instance with Apache and Node.js, and develop the application to fetch and display data.
5. **Configure STS** for sending emails.
6. **Test each component** individually and then as a whole integrated system.
7. **Monitor and optimize** the performance and cost of your AWS resources.

This project should provide a comprehensive introduction to various AWS services and help you gain practical experience with cloud architecture and development.
