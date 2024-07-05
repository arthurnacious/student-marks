"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { format } from "date-fns";
import { NoteType } from "../notes-table";

interface Props {
  selectedNote?: NoteType;
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteType | undefined>>;
}

const ViewNoteModal: React.FC<Props> = ({ selectedNote, setSelectedNote }) => {
  function onOpenChange(b: boolean) {
    if (!b) {
      setSelectedNote(undefined);
    }
  }

  return (
    <Dialog open={!!selectedNote} onOpenChange={(b) => onOpenChange(b)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            NOTE {selectedNote && format(selectedNote.createdAt, "yyyy-MM-dd")}{" "}
            @ {selectedNote && format(selectedNote.createdAt, "HH:mm:ss")}
          </DialogTitle>
        </DialogHeader>
        {selectedNote && <p>{selectedNote.body}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default ViewNoteModal;
