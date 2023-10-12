import pkg from "../package.json";

const {version} = pkg;

export const spec = {

    openapi: "3.0.0",
    info: {
        title: "Sales Portal API",
        version: version,
        description: "AQA course project API",
    },
    servers: [
        {
            url: `https://aqa-course-project.app/`,
        },
    ],
    "paths": {
        "/api/products": {
            "get": {
                "summary": "Get the list of products",
                "tags": ["Products"],
                "responses": {
                    "200": {
                        "description": "The list of products",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        $ref: "#/components/schemas/Product"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Error: Unauthorized",
                        content: {
                            'application/json': {
                                example: {
                                    "IsSuccess": false,
                                    "ErrorMessage": "Not authorized"
                                },
                                schema: {
                                    type: 'object',
                                    items: {
                                        $ref: '#/components/schemas/Unauthorized'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/products/{id}": {
            "get": {
                "summary": "Get the product by Id",
                "tags": ["Products"],
                "parameters": [
                    {
                        "in": "path",
                        "name": "id",
                        "schema": {
                            "type": "string"
                        },
                        "required": true,
                        "description": "The product id"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The product by Id",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Product"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "The product was not found"
                    }
                }
            }
        }
    },
    components: {
        schemas: {
            "Product": {
                "type": "object",
                "required": ["name", "amount", "price", "manufacturer"],
                "properties": {
                    "_id": {
                        "type": "string",
                        "description": "The auto-generated id of the product"
                    },
                    "name": {
                        "type": "string",
                        "description": "The product's name"
                    },
                    "amount": {
                        "type": "number",
                        "description": "The product's amount"
                    },
                    "price": {
                        "type": "number",
                        "description": "The product's price"
                    },
                    "manufacturer": {
                        "type": "string",
                        "enum": ["Apple", "Samsung", "Google", "Microsoft", "Sony", "Xiaomi", "Amazon", "Tesla"],
                        "description": "The product's manufacturer"
                    },
                    "notes": {
                        "type": "string",
                        "description": "The product's notes"
                    }
                }
            },
            "ProductWithoutId": {
                "type": "object",
                "required": ["name", "amount", "price", "manufacturer"],
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The product's name"
                    },
                    "amount": {
                        "type": "number",
                        "description": "The product's amount"
                    },
                    "price": {
                        "type": "number",
                        "description": "The product's price"
                    },
                    "manufacturer": {
                        "type": "string",
                        "enum": ["Apple", "Samsung", "Google", "Microsoft", "Sony", "Xiaomi", "Amazon", "Tesla"],
                        "description": "The product's manufacturer"
                    },
                    "notes": {
                        "type": "string",
                        "description": "The product's notes"
                    }
                }
            },
            "Unauthorized": {
                "type": 'object',
                "required": ["IsSuccess", "ErrorMessage"],
                "properties": {
                    'IsSuccess': {
                        "type": 'boolean',
                        "description": 'Operation successful or not'
                    },
                    'ErrorMessage': {
                        "type": 'string',
                        "description": 'Error message'
                    },
                    "example": {
                        "IsSuccess": "false",
                        "ErrorMessage": "Not authorized"
                    }
                }
            }
        }
    }
}