
export const getBaseUrl = (url: string): string => {
  return url.split('#')[0];
}

export const isUrlChange = (prevUrl: string, nextUrl: string): boolean => {
  const prevBase = getBaseUrl(prevUrl);
  const nextBase = getBaseUrl(nextUrl);
  return prevBase !== nextBase;
}