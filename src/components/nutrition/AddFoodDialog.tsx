import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AddFoodDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export function AddFoodDialog({ open, onClose, onSuccess, userId }: AddFoodDialogProps) {
  const [food, setFood] = useState({
    name: '',
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fats_g: 0,
  });

  const handleAdd = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Food name"
            value={food.name}
            onChange={(e) => setFood({ ...food, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Calories"
            value={food.calories || ''}
            onChange={(e) => setFood({ ...food, calories: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Protein (g)"
            value={food.protein_g || ''}
            onChange={(e) => setFood({ ...food, protein_g: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Carbs (g)"
            value={food.carbs_g || ''}
            onChange={(e) => setFood({ ...food, carbs_g: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Fats (g)"
            value={food.fats_g || ''}
            onChange={(e) => setFood({ ...food, fats_g: Number(e.target.value) })}
          />
          <Button onClick={handleAdd}>Add Food</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
