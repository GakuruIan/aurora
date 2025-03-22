import { db } from "../db";

const DEFAULT_CATEGORIES = [
  {
    name: "Personal",
    colorCode: "#20B6B4",
  },
  {
    name: "Work",
    colorCode: "#4F46E5",
  },
  {
    name: "Meeting",
    colorCode: "#F43F5E",
  },
];

export const CreateUserCategories = async (userId: string) => {
  const existingCategories = await db.noteCategory.findMany({
    where: {
      ownerId: userId,
    },
  });

  if (existingCategories.length === 0) {
    await db.$transaction(
      DEFAULT_CATEGORIES.map((category) =>
        db.noteCategory.create({
          data: {
            ...category,
            ownerId: userId,
          },
        })
      )
    );
  }
};
