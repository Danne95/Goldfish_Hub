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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Task } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

type UrgencyLevel = 'low' | 'medium' | 'high';

interface TaskFormData {
  text: string;
  notes: string;
  urgency: UrgencyLevel;
  targetDate: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    text: '',
    notes: '',
    urgency: 'low',
    targetDate: '',
  });

  useEffect(() => {
    const loadedTasks = loadFromStorage<Task>('tasks');
    setTasks(loadedTasks);
  }, []);

  const handleSave = () => {
    if (editingTask) {
      const updatedTasks = tasks.map(t =>
        t.id === editingTask.id ? { ...t, ...formData } : t
      );
      setTasks(updatedTasks);
      saveToStorage('tasks', updatedTasks);
    } else {
      const newTask: Task = {
        id: generateId(),
        ...formData,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveToStorage('tasks', updatedTasks);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    saveToStorage('tasks', updatedTasks);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      text: task.text,
      notes: task.notes,
      urgency: task.urgency,
      targetDate: task.targetDate || '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setFormData({
      text: '',
      notes: '',
      urgency: 'low',
      targetDate: '',
    });
  };

  const handleAdd = () => {
    setEditingTask(null);
    setFormData({
      text: '',
      notes: '',
      urgency: 'low',
      targetDate: '',
    });
    setOpen(true);
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Task
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {task.text}
                  <Chip
                    label={task.urgency}
                    color={getUrgencyColor(task.urgency)}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <>
                  {task.notes}
                  {task.targetDate && (
                    <Typography component="span" sx={{ display: 'block' }}>
                      Target Date: {task.targetDate}
                    </Typography>
                  )}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Add Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task"
            fullWidth
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Urgency</InputLabel>
            <Select
              value={formData.urgency}
              label="Urgency"
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Target Date"
            type="date"
            fullWidth
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
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

export default Tasks; 