import fetch from "isomorphic-unfetch";
import urls from "../../utils/urls";

type GenericJsonBody = Record<string, unknown>;

interface FetchJson {
  success: boolean;
  message?: string;
  payload: GenericJsonBody;
}

export const helloWorld = (): Promise<GenericJsonBody> =>
  fetch(urls.baseUrl + urls.api.example, {
    method: "get",
    mode: "same-origin",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((json: FetchJson) => {
      if (json == null) {
        throw new Error("Could not connect to API!");
      } else if (!json.success) {
        throw new Error(json.message);
      }

      return json.payload;
    });
