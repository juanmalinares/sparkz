
'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question, MatchItem } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { produce } from 'immer';
import { Button } from '../ui/button';

interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onQuestionChange: (updatedQuestion: Question) => void;
}

export function QuestionEditor({ question, questionIndex, onQuestionChange }: QuestionEditorProps) {

  const updateQuestion = (updater: (draft: Question) => void) => {
    onQuestionChange(produce(question, updater));
  };

  const handleOptionChange = (index: number, value: string) => {
    updateQuestion(draft => {
      const oldOptionValue = draft.options?.[index];
      if (draft.options) {
        draft.options[index] = value;
      }
      if (draft.correctAnswer === oldOptionValue) {
        draft.correctAnswer = value;
      }
    });
  };

  const handleTypeChange = (newType: Question['type']) => {
    updateQuestion(draft => {
      draft.type = newType;
      if (newType === 'true_false') {
        draft.options = ['Verdadero', 'Falso'];
        draft.correctAnswer = 'Verdadero';
        delete draft.matchItems;
      } else if (newType === 'multiple_choice') {
        draft.options = draft.options?.slice(0,4) || [];
        while(draft.options.length < 4) draft.options.push('');
        draft.correctAnswer = '';
        delete draft.matchItems;
      } else if (newType === 'matching') {
        draft.matchItems = draft.matchItems || [{ id: `item-${Date.now()}`, prompt: '', match: '' }];
        delete draft.options;
        delete draft.correctAnswer;
      } else {
        delete draft.options;
        delete draft.matchItems;
      }
    });
  };

  const handleMatchItemChange = (index: number, field: 'prompt' | 'match', value: string) => {
    updateQuestion(draft => {
      if (draft.matchItems) {
        draft.matchItems[index][field] = value;
      }
    });
  };

  const addMatchItem = () => {
    updateQuestion(draft => {
      if (!draft.matchItems) draft.matchItems = [];
      draft.matchItems.push({ id: `item-${Date.now()}`, prompt: '', match: '' });
    });
  };

  const removeMatchItem = (index: number) => {
    updateQuestion(draft => {
      draft.matchItems?.splice(index, 1);
    });
  };
  
  const questionType = question.type || 'multiple_choice';

  return (
     <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>Pregunta {questionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
                <Label htmlFor={`question-type-${questionIndex}`}>Tipo de Pregunta</Label>
                <Select value={questionType} onValueChange={(v) => handleTypeChange(v as Question['type'])}>
                    <SelectTrigger id={`question-type-${questionIndex}`}>
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple_choice">Opción Múltiple</SelectItem>
                        <SelectItem value="true_false">Verdadero/Falso</SelectItem>
                        <SelectItem value="fill_in_the_blank">Rellenar Espacio</SelectItem>
                        <SelectItem value="short_answer">Respuesta Corta</SelectItem>
                        <SelectItem value="matching">Emparejamiento</SelectItem>
                        <SelectItem value="dictation">Dictado (Audio)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor={`question-text-${questionIndex}`}>Pregunta / Instrucción</Label>
                <Textarea
                id={`question-text-${questionIndex}`}
                value={question.question}
                onChange={(e) => updateQuestion(draft => { draft.question = e.target.value })}
                rows={3}
                placeholder="Para 'Rellenar Espacio', usá ___ para el espacio en blanco. Para 'Emparejamiento' o 'Dictado', una instrucción general."
                />
            </div>
        </div>

        <div className="space-y-4">
            {(questionType === 'multiple_choice' || questionType === 'true_false') ? (
            <div className="space-y-2">
                <Label>Opciones y Respuesta Correcta</Label>
                <RadioGroup 
                  value={question.correctAnswer || ''} 
                  onValueChange={(val) => updateQuestion(draft => { draft.correctAnswer = val })} 
                  className="gap-3"
                >
                {(question.options || []).map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                    <RadioGroupItem value={option} id={`q-${questionIndex}-option-radio-${index}`} disabled={questionType === 'true_false'}/>
                    <Input
                        id={`q-${questionIndex}-option-input-${index}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1"
                        placeholder={`Opción ${index + 1}`}
                        disabled={questionType === 'true_false'}
                    />
                    </div>
                ))}
                </RadioGroup>
            </div>
            ) : questionType === 'matching' ? (
            <div className="space-y-4">
                <Label>Pares a Emparejar</Label>
                {(question.matchItems || []).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 border rounded-md bg-background">
                        <Input
                            value={item.prompt}
                            onChange={(e) => handleMatchItemChange(index, 'prompt', e.target.value)}
                            placeholder={`Elemento Fijo ${index + 1}`}
                            className="flex-1"
                        />
                        <Input
                            value={item.match}
                            onChange={(e) => handleMatchItemChange(index, 'match', e.target.value)}
                            placeholder={`Elemento a Arrastrar ${index + 1}`}
                            className="flex-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeMatchItem(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={addMatchItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Par
                </Button>
            </div>
            ) : (
            <div className="space-y-2">
                <Label htmlFor={`correct-answer-${questionIndex}`}>Respuesta Correcta / Texto para Audio</Label>
                <Input
                id={`correct-answer-${questionIndex}`}
                value={question.correctAnswer || ''}
                onChange={(e) => updateQuestion(draft => { draft.correctAnswer = e.target.value })}
                placeholder={questionType === 'dictation' ? "El texto que se convertirá en audio" : "La respuesta exacta que el usuario debe escribir."}
                />
            </div>
            )}
        </div>
        
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`explanation-text-${questionIndex}`}>Explicación</Label>
                <Textarea
                id={`explanation-text-${questionIndex}`}
                value={question.explanation || ''}
                onChange={(e) => updateQuestion(draft => { draft.explanation = e.target.value })}
                rows={4}
                placeholder="Explicación opcional para el feedback de la IA."
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    
