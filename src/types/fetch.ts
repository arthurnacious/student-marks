export interface academyWithRelations {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  lecturers: { academyId: string; lecturerId: string }[];
  heads: { academyId: string; academyHeadId: string }[];
}
