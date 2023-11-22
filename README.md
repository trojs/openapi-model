# OpenAPI Model

[![NPM version][npm-image]][npm-url] [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=coverage)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) 
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=bugs)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=hckrnews_openapi-model&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=hckrnews_openapi-model)

Create easy a Model from a OpenAPI spec.

## Installation

`npm install @hckrnews/openapi-model`
or
`yarn add @hckrnews/openapi-model`

## Test the package

`npm run test`
or
`yarn test`

## How to use

```javascript
const schema = {
    type: 'object',
    properties: {
        foo: {
            type: 'string',
            default: 'bar'
        }
    },
    required: ['foo'],
    additionalProperties: false
}

const options = {
    validate: true,
    strict: false,
    extraAjvFormats: ['date-time']
}

const ExampleModel = openapiToModel(schema, options)

// Create an empty model, with the default values
const example = new ExampleModel()
/*
{
    foo: 'bar'
}
*/

// Create a model with the default values, but overwrite the given properties
const example2 = new ExampleModel({
    foo: 'It works!'
})
/*
{
    foo: 'It works!'
}
*/

// Create a model with the default values, but overwrite the given properties
const example2 = new ExampleModel({
    foo: 3.14
})
/*
    Throws an Error because the type is wrong

    error.message
    "Invalid data"

    error.errors
    [
      {
        instancePath: '/foo',
        keyword: 'type',
        message: 'must be string',
        params: {
          type: 'string'
        },
        schemaPath: '#/properties/foo/type'
      }
    ]

    error.schema
    {
        type: 'object',
        properties: {
            foo: {
                type: 'string',
                default: 'bar'
            }
        },
        required: ['foo'],
        additionalProperties: false
    }

    // The object that is send to the model
    error.data
    {
        foo: 3.14
    }

    // The object that is send to the model, but also with the default values
    error.newData
    {
        foo: 3.14
    }
*/
```


[npm-url]: https://www.npmjs.com/package/@hckrnews/openapi-model
[npm-image]: https://img.shields.io/npm/v/@hckrnews/openapi-model.svg
