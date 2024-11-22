import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { deepMerge } from '@trojs/deep-merge'

const defaultExtraAjvFormats = ['date', 'time', 'uri', 'uuid', 'email', 'hostname', 'regex']
/**
 * @typedef {import('./schema.d.ts').OpenAPIV3.BaseSchemaObject} BaseSchemaObject
 * @typedef {import('./schema.d.ts').OpenAPIV3.SchemaObject} SchemaObject
 * @typedef {import('./schema.d.ts').Options} Options
 * @typedef {import('./schema.d.ts').Model} Model
 */

/**
 * @param {[key: string, schema: SchemaObject]} params
 * @returns {[key: string, defaultValue: any]}
 */
const createPropertyWithDefaultValue = ([key, schema]) => {
    const { type, default: defaultValue } = schema

    if (type === 'object') {
        const subParser = createBaseObjectFromSchema(schema)
        return [key, subParser]
    }

    return [key, defaultValue]
}

/**
 * @param {BaseSchemaObject|SchemaObject} schema
 * @returns {object}
 */
const createBaseObjectFromSchema = (schema) => Object.fromEntries(
    Object.entries(schema.properties).map(createPropertyWithDefaultValue)
)

const openapiToModel = (schema, options = {}) => {
    const { validate = true } = options
    const emptyObject = createBaseObjectFromSchema(schema)

    const ajv = new Ajv({
        strict: options.strict || false
    })
    const extraAjvFormats = options.extraAjvFormats || []
    addFormats(ajv, [...defaultExtraAjvFormats, ...extraAjvFormats])
    const compile = ajv.compile(schema)

    class Model {
    /**
     * @param {object=} data
     */
        constructor (data) {
            this.errors = undefined
            this.data = data || {}
            this.schema = schema
            this.emptyObject = emptyObject
        }

        /**
         * Set the data for the model, including defaults, and validate it against the schema
         * @param {object=} data
         */
        set data (data) {
            const newData = deepMerge(emptyObject, data)
            const valid = compile(newData)

            if (validate && !valid) {
                const error = new Error('Invalid data')
                // @ts-ignore
                error.errors = compile.errors
                // @ts-ignore
                error.schema = schema
                // @ts-ignore
                error.data = data
                // @ts-ignore
                error.newData = newData
                // @ts-ignore
                error.emptyObject = emptyObject
                throw error
            }
            this.value = newData
        }

        /**
         * @returns {object}
         */
        get data () {
            return this.value
        }

        /**
         * @returns {object}
         */
        valueOf () {
            return this.value
        }
    }
    return Model
}

export {
    openapiToModel,
    createBaseObjectFromSchema,
    createPropertyWithDefaultValue
}
