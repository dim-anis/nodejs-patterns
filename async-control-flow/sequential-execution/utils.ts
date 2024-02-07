import * as cheerio from "cheerio";

export function getLinkUrl(currentUrl: string, element: cheerio.Element) {
  const parsedLink = new URL(element.attribs.href || "", currentUrl);
  const currentParsedUrl = new URL(currentUrl);
  if (
    parsedLink.hostname !== currentParsedUrl.hostname ||
    !parsedLink.pathname
  ) {
    return null;
  }
  return parsedLink.toString();
}

export function getPageLinks(currentUrl: string, body: string) {
  return Array.from(cheerio.load(body)("a"))
    .map(function (element) {
      return getLinkUrl(currentUrl, element);
    })
    .filter(Boolean);
}
