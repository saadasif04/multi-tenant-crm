type Note = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
};

export function NoteItem({ note }: { note: Note }) {
  return (
    <div className="border rounded-md p-3 space-y-1 bg-muted/30">
      <p className="text-sm">{note.content}</p>

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>{note.user?.name}</span>
        <span>{new Date(note.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}