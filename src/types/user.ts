export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  role: string;
  isGardian: boolean | null;
  activeTill: string | null;
  createdAt: string;
  updatedAt: string | null;
};
