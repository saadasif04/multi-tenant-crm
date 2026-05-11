'use client';

type Note = {
  id: number;
  content: string;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
};

export function NoteItem({ note }: { note: Note }) {
  return (
    <div className="border rounded-md p-3 space-y-1 bg-muted/30">
      <p className="text-sm">{note.content}</p>

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>{note.createdBy?.name}</span>
        <span>{new Date(note.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}