import { HttpMethod } from "../models/HttpMethod";
import urls from "../../utils/urls";

export async function callInternalAPI<T>(
  route: string,
  method: HttpMethod,
  requestBody: any = null
): Promise<T> {
  const fetchConfig: RequestInit = {
    method: method,
    mode: "same-origin",
    credentials: "include",
  };
  if (requestBody) {
    fetchConfig.body = JSON.stringify(requestBody);
    fetchConfig.headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(urls.baseUrl + route, fetchConfig);
  const json = await response.json();

  if (json == null) {
    throw new Error(
      `Could not connect to API! Status code: ${response.status}`
    );
  } else if (!json.success) {
    const errorUUID: string | null = json.errorUUID;
    let message: string = json.message;
    if (errorUUID) {
      message += ` (uuid=${errorUUID})`;
    }
    throw new Error(message);
  }

  return json.payload as T;
}
