export interface academyWithRelations {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  lecturers: { academyId: string; lecturerId: string }[];
  heads: { academyId: string; academyHeadId: string }[];
}

export interface courseWithRelations {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  academyId: string | null;
  description: string | null;
  status: string | null;
  classCount: number;
  fields: {
    id: string;
    name: string;
    total: number;
    courseId: string | null;
  }[];
}
