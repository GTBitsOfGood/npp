/**
 * Use to customize HttpResponse outside the defaults.
 * For instance, you want to use a status code other than the
 * default for the current method
 */
export class HttpResponse {
  constructor(
    public readonly statusCode: number,
    public readonly payload: any
  ) {}
}
