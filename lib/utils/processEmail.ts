import sanitizeHtml from "sanitize-html";
import LinkifyIt from "linkify-it";

export function PreprocessEmailContent(content: string): string {
  const linkify = new LinkifyIt();

  if (isHtmlContent(content)) {
    return sanitizeHtml(content, {
      allowedTags: ["p", "a", "b", "i", "u", "strong", "em", "br", "span"],
      allowedAttributes: {
        a: ["href", "target", "rel"],
      },
      transformTags: {
        a: sanitizeHtml.simpleTransform("a", {
          target: "_blank",
          rel: "noopener noreferrer",
        }),
      },
    });
  } else {
    return LinkifyText(content, linkify);
  }
}

function isHtmlContent(content: string): boolean {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
}

function LinkifyText(text: string, linkify: LinkifyIt): string {
  const regex = /https?:\/\/(?:www\.)?([^\/]+)/;

  const cleanedText = text.replace(/\(\s*([^()]+?)\s*\)/g, "$1");

  const domain_match = cleanedText.match(regex);
  const domain = domain_match ? domain_match[1] : null;

  const matches = linkify.match(cleanedText);

  if (!matches) return cleanedText;

  let result = "";
  let lastIndex = 0;

  for (const match of matches) {
    result += cleanedText.slice(lastIndex, match.index);
    result += `<a href="${match.url}" target="_blank" rel="noopener noreferrer">${domain}</a>`; // Add the link
    lastIndex = match.lastIndex;
  }

  result += cleanedText.slice(lastIndex);
  return result;
}
