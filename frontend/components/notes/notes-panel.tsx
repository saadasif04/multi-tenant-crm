'use client';

import { AddNoteForm } from './add-note-form';
import { NotesList } from './notes-list';
import { Card } from '@/components/ui/card';

export function NotesPanel({ customerId }: { customerId: number }) {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="font-semibold text-lg">Notes</h2>

      <AddNoteForm customerId={customerId} />

      <NotesList customerId={customerId} />
    </Card>
  );
}