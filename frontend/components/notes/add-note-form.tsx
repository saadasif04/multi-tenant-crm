'use client';

import { useState } from 'react';
import { api } from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function AddNoteForm({ customerId }: { customerId: number }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const addNote = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await api.post('/notes', {
        content: text,
        customerId,
      });
      setText('');
      queryClient.invalidateQueries({ queryKey: ['notes', customerId] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        onClick={addNote}
        disabled={loading || !text.trim()}
        size="sm"
        className="w-full"
      >
        {loading ? 'Saving...' : 'Add Note'}
      </Button>
    </div>
  );
}