export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

export function getDefaultStatusCodeForMethod(method: HttpMethod) {
  switch (method) {
    case HttpMethod.PUT:
      return 201;
    default:
      return 200;
  }
}
