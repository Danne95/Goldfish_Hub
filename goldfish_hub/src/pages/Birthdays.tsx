import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Birthday } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

const Birthdays: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [formData, setFormData] = useState({ name: '', date: '' });

  useEffect(() => {
    const loadedBirthdays = loadFromStorage<Birthday>('birthdays');
    setBirthdays(loadedBirthdays);
  }, []);

  const handleSave = () => {
    if (editingBirthday) {
      const updatedBirthdays = birthdays.map(b =>
        b.id === editingBirthday.id ? { ...b, ...formData } : b
      );
      setBirthdays(updatedBirthdays);
      saveToStorage('birthdays', updatedBirthdays);
    } else {
      const newBirthday: Birthday = {
        id: generateId(),
        ...formData,
      };
      const updatedBirthdays = [...birthdays, newBirthday];
      setBirthdays(updatedBirthdays);
      saveToStorage('birthdays', updatedBirthdays);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const updatedBirthdays = birthdays.filter(b => b.id !== id);
    setBirthdays(updatedBirthdays);
    saveToStorage('birthdays', updatedBirthdays);
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setFormData({ name: birthday.name, date: birthday.date });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBirthday(null);
    setFormData({ name: '', date: '' });
  };

  const handleAdd = () => {
    setEditingBirthday(null);
    setFormData({ name: '', date: '' });
    setOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Birthdays</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Birthday
        </Button>
      </Box>

      <List>
        {birthdays.map((birthday) => (
          <ListItem key={birthday.id}>
            <ListItemText
              primary={birthday.name}
              secondary={`Birthday: ${birthday.date}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(birthday)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(birthday.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingBirthday ? 'Edit Birthday' : 'Add Birthday'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date (DD/MM)"
            fullWidth
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="DD/MM"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Birthdays; 