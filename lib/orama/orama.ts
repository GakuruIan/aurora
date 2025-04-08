type Document = {
  type: "Email" | "Tasks" | "Notes";
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  embeddings: any;
};

import { create, insert, search, type AnyOrama } from "@orama/orama";

import { restore, persist } from "@orama/plugin-data-persistence";
import { db } from "../db";
import { getEmbeddings } from "../openai/embeddings";

class OramaDB {
  private static instance: OramaDB | null = null;
  private orama: AnyOrama;
  private accountId: string | null = null;

  private constructor() {}

  public static async getInstance(accountId: string) {
    if (!OramaDB.instance) {
      OramaDB.instance = new OramaDB();
      await OramaDB.instance.initialize(accountId);
    } else if (OramaDB.instance.accountId !== accountId) {
      await OramaDB.instance.initialize(accountId);
    }
    return OramaDB.instance;
  }

  async saveIndex() {
    const index = await persist(this.orama, "json");

    await db.oAuthToken.update({
      where: {
        googleId: this.accountId!,
      },
      data: {
        oramaIndex: index,
      },
    });
  }

  private async initialize(accountId: string) {
    this.accountId = accountId;

    const account = await db.oAuthToken.findUnique({
      where: {
        googleId: this.accountId!,
      },
    });

    if (!account) {
      throw new Error("No account found");
    }

    if (account.oramaIndex) {
      this.orama = await restore("json", account.oramaIndex as any);
    } else {
      this.orama = await create({
        schema: {
          type: "string",
          id: "string",
          title: "string",
          content: "string",
          date: "string",
          tags: "string[]",
          embeddings: "vector[384]",
        },
      });
      await this.saveIndex();
    }
  }

  public async insert(document: Document) {
    await insert(this.orama, document);
    await this.saveIndex();
  }

  async vectorSearch({ term }: { term: string }) {
    const embedding = await getEmbeddings(term);

    const results = await search(this.orama, {
      mode: "hybrid",
      term,
      vector: {
        value: embedding,
        property: "embeddings",
      },
      similarity: 0.8,
      limit: 3,
    });

    if (!results.hits || results.hits.length === 0) {
      console.log("No documents found matching term:", term);
      return {
        hits: [],
        count: 0,
      };
    }

    return results;
  }

  async search(
    { term }: { term: string },
    type?: "email" | "task" | "note" | "all"
  ) {
    const results = await search(this.orama, {
      term,
      tolerance: 1,
      properties: ["title", "content"],
    });

    const filteredResults = type
      ? results.hits.filter((item) => item.document.type === type)
      : results.hits;

    return filteredResults;
  }
}

export default OramaDB;
