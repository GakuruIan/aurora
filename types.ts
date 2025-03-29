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
  payload?: Payload;
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

export type TasksList = {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  tasks: Task[];
};

export type Task = {
  kind: string;
  id: string;
  etag: string;
  title: string;
  updated: string;
  selfLink: string;
  parent?: string;
  position: string;
  notes: string;
  status: string;
  due: string;
  completed: string;
  isCompleted: boolean;
  deleted?: boolean;
  hidden?: boolean;
  links?: [
    {
      type: string;
      description: string;
      link: string;
    }
  ];
  webViewLink?: string;
  assignmentInfo?: AssignmentInfo;
};

export type AssignmentInfo = {
  linkToTask: string;
  surfaceType: ContextType;
  driveResourceInfo: {
    driveFileId: string;
    resourceKey: string;
  };
  spaceInfo: {
    space: string;
  };
};

enum ContextType {
  CONTEXT_TYPE_UNSPECIFIED,
  GMAIL,
  DOCUMENT,
  SPACE,
}
