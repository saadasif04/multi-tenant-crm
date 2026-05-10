export type Note = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
};