export function convertTimestamp(timestamp: Date): string {
  const createdAt = new Date(timestamp);
  const now = new Date();

  const diffinsec = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  //    minutes past
  if (diffinsec < 3600) {
    const minutes = Math.floor(diffinsec / 60);
    return `${minutes} minutes ago`;
  }

  //    hours past
  if (diffinsec < 86400) {
    const hours = Math.floor(diffinsec / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const diffindays = Math.floor(diffinsec / 86400);

  if (diffindays < 7) {
    return `${diffindays} day${diffindays > 1 ? "s" : ""} ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(createdAt);
}

export function TruncateText(content: string, wordCount = 35): string {
  if (!content) return "";

  const split_words = content.split(/\s+/);

  return split_words.length > wordCount
    ? split_words.splice(0, wordCount).join(" ") + "..."
    : content;
}
