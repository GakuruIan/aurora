import { openai } from "./openAi";

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    return response.data[0].embedding as number[];
  } catch (error) {
    console.log(`[OPENAI ERROR] - ${error}`);
  }
}
