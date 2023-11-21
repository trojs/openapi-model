export declare namespace OpenAPIV3 {
    type NonArraySchemaObjectType = 'boolean' | 'object' | 'number' | 'string' | 'integer';
    type SchemaObject = NonArraySchemaObject | ArraySchemaObject;

    interface ReferenceObject {
        $ref: string;
    }

    interface ArraySchemaObject extends BaseSchemaObject {
        type: ArraySchemaObjectType;
        items?: ReferenceObject | SchemaObject;
    }

    interface NonArraySchemaObject extends BaseSchemaObject {
        type: NonArraySchemaObjectType;
        default?: any;
        example?: any;
        properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
    }

    interface BaseSchemaObject {
        default?: any;
        additionalProperties?: boolean | ReferenceObject | SchemaObject;
        required?: string[];
        properties?: {
            [name: string]: ReferenceObject | SchemaObject;
        };
        example?: any;
    }
}

export interface Options {
    validate?: boolean;
}
export class Model {
    constructor(data?: object);
    set data(data: object);
    get data(): object;
    valueOf(): any;
}
export function openapiToModel(
    schema: BaseSchemaObject,
    options: Options
): Model;
