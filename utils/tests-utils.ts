export function getRandomEnumValue<T extends object>(enumObject: T): T[keyof T] {
  const values = Object.values(enumObject);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}

export function errorResponse(message: string) {
  return { IsSuccess: false, ErrorMessage: message }
}

export function successResponse<T>(data: T) { 
  return { ...data, IsSuccess: true, ErrorMessage: null }
}

export function setupErrorResponse(method: Function, errorMessage: string) {
  (method as jest.Mock).mockRejectedValue(new Error(errorMessage));
  const expectedResponse = errorResponse(errorMessage);
  return expectedResponse;
}
