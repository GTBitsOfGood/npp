/**
 * This error will be directly propagated to the user from the backend
 * They will receive this message and status code
 */
export class PublicError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number
  ) {}
}
