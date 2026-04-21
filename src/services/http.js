async function getResponseData(response) {
  return response.json().catch(() => null);
}

export async function requestJson(
  url,
  { method = "GET", body, headers = {}, errorMessage } = {},
) {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await getResponseData(response);

  if (!response.ok) {
    throw new Error(data?.message ?? errorMessage ?? "Ocorreu um erro.");
  }

  return data;
}
