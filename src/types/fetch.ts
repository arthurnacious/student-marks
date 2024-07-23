export interface departmentWithRelations {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  lecturers: { departmentId: string; lecturerId: string }[];
  leaders: { departmentId: string; departmentLeaderId: string }[];
}

export interface courseWithRelations {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  slug: string;
  departmentId: string | null;
  description: string | null;
  status: string | null;
  classCount: number;
  price: number;
  fields: {
    id: string;
    name: string;
    total: number;
    courseId: string | null;
  }[];
}
