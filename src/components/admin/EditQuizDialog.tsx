'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Quiz } from '@/lib/types';
import { fixImgurUrl } from '@/lib/utils';

interface EditQuizDialogProps {
  quiz: Quiz;
  onUpdate: (id: string, updates: Partial<Quiz>) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditQuizDialog({ quiz, onUpdate, onOpenChange }: EditQuizDialogProps) {
  const [title, setTitle] = useState(quiz.title);
  const [imageUrl, setImageUrl] = useState(quiz.image || '');

  useEffect(() => {
    setTitle(quiz.title);
    setImageUrl(quiz.image || '');
  }, [quiz]);

  const handleSave = () => {
    const updates: Partial<Quiz> = {};
    const fixedImageUrl = fixImgurUrl(imageUrl); // Fix the url before saving

    if (title !== quiz.title) {
      updates.title = title;
    }
    if (fixedImageUrl !== (quiz.image || '')) {
      updates.image = fixedImageUrl;
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(quiz.id, updates);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Quiz: {quiz.title}</DialogTitle>
          <DialogDescription>
            Realizá cambios en el título o la imagen del quiz. Los cambios se guardarán permanentemente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              URL de la Imagen
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://placehold.co/600x400.png"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
