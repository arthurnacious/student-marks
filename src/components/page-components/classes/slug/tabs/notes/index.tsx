"use client";
import React, { FC } from "react";
import { TheClass } from "../students";
import NotesTable from "./notes-table";
import AddNoteModal from "./crud/add-note";

interface Props {
  theClass: TheClass;
}

const NotesTab: FC<Props> = ({ theClass }) => {
  return (
    <div>
      <AddNoteModal classId={theClass.id} />
      <NotesTable theClass={theClass} />
    </div>
  );
};

export default NotesTab;
