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
                        "description": "OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Get products list"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "$ref": "#/components/responses/error/Unauthorized"
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
                        "description": "Success",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Get product"
                                }
                            }
                        }
                    },
                    "404": {
                        "$ref": "#/components/responses/error/Not found"
                    }
                }
            }
        },
        "/api/products/": {
            "post": {
                "summary": "Create product",
                "tags": ["Products"],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Create product"
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Success",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Get product"
                                }
                            }
                        }
                    },
                    "400": {
                        "$ref": "#/components/responses/error/Bad request"
                    },
                    "401": {
                        "$ref": "#/components/responses/error/Unauthorized"
                    }
                }
            }
        }
    },
    "components": {
        "securitySchemes": {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        },
        "schemas": {
            "Get products list": {
                "type": "object",
                "required": ["Product", "IsSuccess", "ErrorMessage"],
                "properties": {
                    "Products": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["name", "amount", "price", "manufacturer", "_id", "createdOn", "notes"],
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
                                },
                                "createdOn": {
                                    "type": "string",
                                    "format": "date-time",
                                    "description": "The creation date"
                                },
                            }
                        },
                    },
                    "IsSuccess": {
                        "type": "boolean",
                        "description": "Indicates whether the request was successful."
                    },
                    "ErrorMessage": {
                        "type": null,
                        "description": "An error message, if any."
                    }
                }
            },
            "Get product": {
                "type": "object",
                "required": ["Product", "IsSuccess", "ErrorMessage"],
                "properties": {
                    "Products": {
                        "type": "object",
                        "required": ["name", "amount", "price", "manufacturer", "_id", "createdOn", "notes"],
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
                            },
                            "createdOn": {
                                "type": "string",
                                "format": "date-time",
                                "description": "The creation date"
                            },
                        }

                    },
                    "IsSuccess": {
                        "type": "boolean",
                        "description": "Indicates whether the request was successful."
                    },
                    "ErrorMessage": {
                        "type": ["string"],
                        "description": "An error message, if any."
                    }
                }
            },
            "Create product": {
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
            }
        },
        "responses": {
            "success": {},
            "error": {
                "Unauthorized": {
                    "description": "Unauthorized",
                    "type": "object",
                    "required": ["IsSuccess", "ErrorMessage"],
                    "content": {
                        "application/json": {
                            "example": {
                                "IsSuccess": false,
                                "ErrorMessage": "Unauthorized"
                            }
                        }
                    }
                },
                "Bad request": {
                    "description": "Bad request",
                    "type": "object",
                    "required": ["IsSuccess", "ErrorMessage", "SchemaErrors"],
                    "content": {
                        "application/json": {
                            "example": {
                                "IsSuccess": false,
                                "ErrorMessage": "Incorrect request body",
                                "SchemaErrors": [
                                    {
                                        "instancePath": "/amount",
                                        "schemaPath": "#/properties/amount/type",
                                        "keyword": "type",
                                        "params": {
                                            "type": "integer"
                                        },
                                        "message": "must be integer"
                                    }
                                ]
                            }
                        }
                    }
                },
                "Not found": {
                    "description": "Not found",
                    "type": "object",
                    "required": ["IsSuccess", "ErrorMessage", ],
                    "content": {
                        "application/json": {
                            "example": {
                                "IsSuccess": false,
                                "ErrorMessage": "Product with id '989268309480fd7d87293h1w' wasn't found"
                            }
                        }
                    }
                }
            }
        }
    },
    "security": [
        {
            "BearerAuth": []
        }
    ]
}