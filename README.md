# Simple serverless application.


## 1. App
The application has been written in node.js.
It contains 2 functions that handling endpoints from the task. He works with the DynamoDB nosql base.

## 2. Diagram

https://cloudcraft.co/view/6535696f-ea48-462a-9f37-636763712cdf?key=Y9YaeLb6KcD0W3ga1BkTiA&interactive=true&embed=true

## 3. Conf script

All configuration are save in `serverless.yml`.
Serverless deployed app in to AWS Lambda's and automatically init and configure DynamoDB and AWS Lambda.

```
npm install -g serverless
serverless deploy
```
