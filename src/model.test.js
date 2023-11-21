import test from 'node:test'
import assert from 'node:assert'
import { openapiToModel } from './model.js'

test('Test the openapiToModel helpers', async (t) => {
  await t.test('It should create the object from the OpenAPI spec', async () => {
    const spec = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
          default: 'bar'
        },
        bar: {
          type: 'number',
          default: 42
        },
        baz: {
          type: 'object',
          properties: {
            qux: {
              type: 'string'
            },
            quux: {
              type: 'number',
              default: 3.14
            }
          },
          required: ['quux']
        }
      },
      required: ['foo', 'baz'],
      additionalProperties: false
    }
    const ExampleModel = openapiToModel(spec)
    const expected = {
      foo: 'bar',
      bar: 42,
      baz: {
        qux: undefined,
        quux: 3.14
      }
    }

    const response = new ExampleModel()

    assert.deepEqual(
      response.valueOf(),
      expected
    )

    const response2 = new ExampleModel({
      bar: 3.14
    })

    assert.deepEqual(
      response2.valueOf(),
      {
        foo: 'bar',
        bar: 3.14,
        baz: {
          qux: undefined,
          quux: 3.14
        }
      }
    )

    const response3 = new ExampleModel({
      baz: {
        qux: '42',
        quux: 42
      }
    })

    assert.deepEqual(
      response3.valueOf(),
      {
        foo: 'bar',
        bar: 42,
        baz: {
          qux: '42',
          quux: 42
        }
      }
    )

    try {
      // eslint-disable-next-line no-new
      new ExampleModel({
        baz: {
          qux: '42'
        }
      })
    } catch (error) {
      assert.equal(error.message, 'Invalid data')
      assert.deepEqual(
        error.errors,
        [
          {
            instancePath: '/baz',
            keyword: 'required',
            message: "must have required property 'quux'",
            params: {
              missingProperty: 'quux'
            },
            schemaPath: '#/properties/baz/required'
          }
        ]
      )
    }
  })
})
