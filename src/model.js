import Ajv from 'ajv'
const ajv = new Ajv()

const jsonSchemaToModel = ([key, schema]) => {
  const { type, default: defaultValue } = schema

  if (type === 'object') {
    const subParser = createBase(schema)
    return [key, subParser]
  }

  return [key, defaultValue]
}

const createBase = (schema) => Object.fromEntries(
  Object.entries(schema.properties).map(jsonSchemaToModel)
)

const openapiToModel = (schema) => {
  const emptyObject = createBase(schema)
  const validate = ajv.compile(schema)

  class Model {
    constructor (data) {
      this.errors = undefined
      this.setData(data)
    }

    setData (data) {
      const newData = {
        ...emptyObject,
        ...data
      }
      const valid = validate(newData)

      if (!valid) {
        const error = new Error('Invalid data')
        // @ts-ignore
        error.errors = validate.errors
        throw error
      }
      this.value = newData
    }

    valueOf () {
      return this.value
    }
  }
  return Model
}

export {
  openapiToModel
}
