'use client';

import { useCustomerNotes } from './hooks/useNotes';
import { NoteItem } from './note-item';
import { Note } from './types/note';

export function NotesList({ customerId }: { customerId: number }) {
  const { data, isLoading } = useCustomerNotes(customerId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading notes...</p>;
  }

  if (!data?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No notes yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
    {(data as Note[]).map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  );
}