import { Note, NoteCategory } from "@prisma/client";

export type NotesWithCategory = Note & {
  category: NoteCategory;
};
