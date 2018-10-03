'use strict'

const AWS = require('aws-sdk')

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
  const data = JSON.parse(event.body)
  if (typeof data.dateOfBirth !== 'string') {
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create new User.'
    })
    return
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      name: event.pathParameters.name,
      dateOfBirth: data.dateOfBirth
    }
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.'
      })
      return
    }

    const response = {
      statusCode: 204
    }
    callback(null, response)
  })
}

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      'name': event.pathParameters.name
    }
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error,
          params: params
        })
      })
      return
    }

    let dateOfBirth = new Date(result.Item.dateOfBirth)
    let curentDate = new Date()
    let message = null

    if (
      (dateOfBirth.getUTCMonth() === curentDate.getUTCMonth()) &&
      (dateOfBirth.getUTCDate() === curentDate.getUTCDate())
    ) {
      message = 'Hello, ' + result.Item.name + '! Happy birthday!'
    } else {
      let curentYearBirthDate = new Date(curentDate.getUTCFullYear(), dateOfBirth.getUTCMonth(), dateOfBirth.getUTCDate())
      if (curentDate.getTime() > curentYearBirthDate.getTime()) {
        curentYearBirthDate.setUTCFullYear(curentYearBirthDate.getUTCFullYear() + 1)
      }
      let diff = curentYearBirthDate.getTime() - curentDate.getTime()
      let days = Math.floor(diff / (1000 * 60 * 60 * 24))
      message = 'Hello, ' + result.Item.name + '! Your birthday is in ' + days + ' days!'
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: message })
    }
    callback(null, response)
  })
}
