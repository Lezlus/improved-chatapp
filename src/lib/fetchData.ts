export interface FetchOptions {
  body?: BodyInit;
  credentials?: RequestCredentials;
  method: string;
  cache?: RequestCache;
}

export default function fetchData<T>(url: string, options: FetchOptions): Promise<T> {
  return fetch(url, {
    headers: { Accept: "application/json" },
    ...options,
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error occurred fetching API route ${url}`);
    }
    return res.json() as Promise<T>;
  }).catch(err => {
    throw err;
  })
}