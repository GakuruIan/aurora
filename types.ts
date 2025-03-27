import { Note, NoteCategory } from "@prisma/client";

export type NotesWithCategory = Note & {
  category: NoteCategory;
};

export type ThreadMessage = {
  id: string;
  threadId: string;
  labelIds: [string];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: Payload;
  sizeEstimate: number;
  raw: string;
};

export type Payload = {
  partId: string;
  mimeType: string;
  filename: string;
  headers: [
    {
      name: string;
      value: string;
    }
  ];
  body?: {
    attachmentId?: string;
    size?: number;
    data?: string;
  };
  parts?: Array<{
    mimeType: string;
    body?: {
      data?: string;
      size?: number;
    };
    parts?: Array<{
      mimeType: string;
      body?: {
        data?: string;
        size?: number;
      };
    }>;
  }>;
};
