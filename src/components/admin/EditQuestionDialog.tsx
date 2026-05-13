
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Quiz, Question } from '@/lib/types';
import { QuestionEditor } from './QuestionEditor';

interface EditQuestionDialogProps {
  quiz: Quiz;
  question: Question;
  questionIndex: number;
  onUpdate: (quizId: string, questionIndex: number, updatedQuestion: Question) => void;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditQuestionDialog({ quiz, question, questionIndex, onUpdate, onOpenChange }: EditQuestionDialogProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  
  const handleSave = () => {
    onUpdate(quiz.id, questionIndex, editedQuestion);
    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Pregunta</DialogTitle>
          <DialogDescription>
            Quiz: {quiz.title}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-6 -mr-6">
            <QuestionEditor 
                question={editedQuestion} 
                questionIndex={questionIndex}
                onQuestionChange={setEditedQuestion}
            />
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

    