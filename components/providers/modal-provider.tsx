"use client";

import { useEffect, useState } from "react";

// components
import CreateNote from "@/components/modals/create-note";
import CreateNoteCategory from "../modals/create-note-category";
import EditNote from "../modals/edit-note";
import DeleteNote from "../modals/delete-note";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateNote />
      <CreateNoteCategory />
      <EditNote />
      <DeleteNote />
    </>
  );
};
