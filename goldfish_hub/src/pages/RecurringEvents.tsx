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
import { RecurringEvent } from '../types';
import { loadFromStorage, saveToStorage, generateId } from '../utils/storage';

type Periodicity = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface EventFormData {
  text: string;
  periodicity: Periodicity;
  dayOfWeek?: string;
  specificDate?: string;
  time?: string;
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const RecurringEvents: React.FC = () => {
  const [events, setEvents] = useState<RecurringEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RecurringEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    text: '',
    periodicity: 'daily',
    time: '09:00', // Default time
  });

  useEffect(() => {
    const loadedEvents = loadFromStorage<RecurringEvent>('recurringEvents');
    setEvents(loadedEvents);
  }, []);

  const handleSave = () => {
    const eventData = {
      ...formData,
      dayOfWeek: formData.periodicity === 'weekly' ? formData.dayOfWeek : undefined,
      specificDate: ['monthly', 'yearly'].includes(formData.periodicity) ? formData.specificDate : undefined,
    };

    if (editingEvent) {
      const updatedEvents = events.map(e =>
        e.id === editingEvent.id ? { ...e, ...eventData } : e
      );
      setEvents(updatedEvents);
      saveToStorage('recurringEvents', updatedEvents);
    } else {
      const newEvent: RecurringEvent = {
        id: generateId(),
        ...eventData,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveToStorage('recurringEvents', updatedEvents);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    saveToStorage('recurringEvents', updatedEvents);
  };

  const handleEdit = (event: RecurringEvent) => {
    setEditingEvent(event);
    setFormData({
      text: event.text,
      periodicity: event.periodicity,
      dayOfWeek: event.dayOfWeek,
      specificDate: event.specificDate,
      time: event.time || '09:00',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setFormData({
      text: '',
      periodicity: 'daily',
      time: '09:00',
    });
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      text: '',
      periodicity: 'daily',
      time: '09:00',
    });
    setOpen(true);
  };

  const getPeriodicityLabel = (event: RecurringEvent) => {
    const timeStr = event.time ? ` at ${event.time}` : '';
    switch (event.periodicity) {
      case 'daily':
        return `Every day${timeStr}`;
      case 'weekly':
        return `Every ${event.dayOfWeek}${timeStr}`;
      case 'monthly':
        return `Monthly on ${event.specificDate}${timeStr}`;
      case 'yearly':
        return `Yearly on ${event.specificDate}${timeStr}`;
      default:
        return event.periodicity;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Recurring Events</Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Event
        </Button>
      </Box>

      <List>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {event.text}
                  <Chip
                    label={getPeriodicityLabel(event)}
                    color="primary"
                    size="small"
                  />
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(event)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(event.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'Add Event'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event"
            fullWidth
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Periodicity</InputLabel>
            <Select
              value={formData.periodicity}
              label="Periodicity"
              onChange={(e) => {
                const periodicity = e.target.value as Periodicity;
                setFormData({
                  ...formData,
                  periodicity,
                  dayOfWeek: undefined,
                  specificDate: undefined,
                });
              }}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          {formData.periodicity === 'weekly' && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.dayOfWeek || ''}
                label="Day of Week"
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {['monthly', 'yearly'].includes(formData.periodicity) && (
            <TextField
              margin="dense"
              label={formData.periodicity === 'monthly' ? 'Day of Month (DD)' : 'Date (DD/MM)'}
              fullWidth
              value={formData.specificDate || ''}
              onChange={(e) => setFormData({ ...formData, specificDate: e.target.value })}
              placeholder={formData.periodicity === 'monthly' ? 'DD' : 'DD/MM'}
            />
          )}

          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min steps
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

export default RecurringEvents; 