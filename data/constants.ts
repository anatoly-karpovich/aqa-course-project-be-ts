export const RESPONSE_STATUSES = {
    created: 201,
    deleted: 204,
    server_error: 500
}

export const VALIDATION_ERROR_MESSAGES = {
    ["Customer Name"]: `Customer's name should contain only 1-40 alphabetical characters and one space between`,
    ["City"]: `City's name should contain only 1-20 alphabetical characters and one space between`,
    ["Address"]: `Address should contain only 1-20 alphanumerical characters and one space between`,
    ["Email"]: "Invalid Email Address",
    ["Phone"]: "Mobile Number should be at least 10 characters and start with a +",
    ["Notes"]: "Notes should be in range 0-250 and without < or > symbols",
    ["Product Name"]: "Products's name should contain only 3-40 alphanumerical characters and one space between",
    ['Amount']: "Amount should be in range 0-999",
    ['Price']: "Price should be in range 1-99999",
    ['Country']: "No such country is defined",
    ['Manufacturer']: "No such manufacturer is defined"
  };

export const ORDER_STATUSES = ['Draft', 'In Process', 'Partially Received', 'Received', 'Canceled']

export const CUSTOMER_REQUIRED_KEYS = ["email", "name", "country", "city", "address", "phone"]

export const COUNTRIES = ["USA", "Canada", "Belarus", "Ukraine", "Germany", "France", "Great Britain", "Russia"]

export const MANUFACTURERS = ["Apple", "Samsung", "Google", "Microsoft", "Sony", "Xiaomi", "Amazon", "Tesla"]