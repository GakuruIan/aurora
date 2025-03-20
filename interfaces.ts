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
