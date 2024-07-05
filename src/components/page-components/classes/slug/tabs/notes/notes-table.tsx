import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { FC, useState } from "react";
import { TheClass } from "../students";
import { useGetClassNotes, useDeleteClassNote } from "@/query/class-notes";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateTextByWords } from "@/lib/utils";
import ViewNoteModal from "./crud/view-note-modal";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  theClass: TheClass;
}

export interface NoteType {
  id: string;
  body: string;
  createdAt: string;
}

const NotesTable: FC<Props> = ({ theClass }) => {
  const [ConfirmationDialog, deleteNote] = useConfirm({
    title: "Are you sure?",
    message: "You are about to remove a note",
  });

  const [selectedNote, setSelectedNote] = useState<NoteType | undefined>();
  const { data: classNotes, isLoading } = useGetClassNotes(theClass.id);
  const { mutate: doDeleteNote, isPending } = useDeleteClassNote(theClass.id);

  if (isLoading)
    return (
      <div>
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full my-3" />
        ))}
      </div>
    );
  return (
    <>
      <ConfirmationDialog />
      <ViewNoteModal
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
      />
      {classNotes?.length > 0 ? (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[2%]">#</TableHead>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="w-[20%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classNotes?.map((note, idx) => (
              <TableRow key={`note-${note.id}`}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">
                  {idx + 1}
                  {format(note.createdAt, "yyyy-MM-dd")} @{" "}
                  {format(note.createdAt, "HH:mm:ss")}
                </TableCell>
                <TableCell className="p-0 truncate">
                  {truncateTextByWords(note.body, 10)}
                </TableCell>
                <TableCell className="p-0 space-x-2 text-center">
                  <Button size="sm" onClick={() => setSelectedNote(note)}>
                    View Note
                  </Button>
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={async () => {
                      const ok = await deleteNote();

                      if (ok) {
                        doDeleteNote(note.id);
                      }
                    }}
                    variant="destructive"
                  >
                    Trash Note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-neutral-500 text-2xl">
          No notes yet
        </div>
      )}
    </>
  );
};

export default NotesTable;
