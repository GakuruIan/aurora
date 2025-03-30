export const extractEmailPayload = (payload: any) => {
  if (!payload) return "No content";

  if (payload?.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      // Check for text/html or text/plain
      if (part.mimeType === "text/html" || part.mimeType === "text/plain") {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }
  }

  return "No content";
};
