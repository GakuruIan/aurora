export interface ClerkErrorRoot {
  status: number;
  clerkError: boolean;
  errors: Error[];
}

export interface Error {
  code: string;
  message: string;
  longMessage: string;
}

export interface Tasks {
  title: string;
  status: string;
  importance: string;
  due: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: CategoryResponse;
  ownerId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CategoryResponse {
  name: string;
  colorCode: string;
  id: string;
}
