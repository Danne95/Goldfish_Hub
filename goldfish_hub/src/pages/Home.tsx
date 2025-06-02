import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Birthday, Task, RecurringEvent } from '../types';
import { loadFromStorage } from '../utils/storage';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const birthdays = loadFromStorage<Birthday>('birthdays');
  const tasks = loadFromStorage<Task>('tasks');
  const recurringEvents = loadFromStorage<RecurringEvent>('recurringEvents');

  const today = format(new Date(), 'dd/MM');
  const upcomingBirthdays = birthdays
    .filter(birthday => {
      const [day, month] = birthday.date.split('/');
      const birthdayDate = `${day}/${month}`;
      return birthdayDate >= today;
    })
    .slice(0, 3);

  const urgentTasks = tasks
    .filter(task => task.urgency === 'high')
    .slice(0, 3);

  const todaysEvents = recurringEvents.filter(event => {
    if (event.periodicity === 'daily') return true;
    if (event.periodicity === 'weekly') {
      const dayOfWeek = format(new Date(), 'EEEE').toLowerCase();
      return event.dayOfWeek?.toLowerCase() === dayOfWeek;
    }
    if (event.specificDate) {
      return event.specificDate === today;
    }
    return false;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to GoldFish Hub
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Birthdays
          </Typography>
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map(birthday => (
              <Typography key={birthday.id}>
                {birthday.name} - {birthday.date}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">No upcoming birthdays</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Urgent Tasks
          </Typography>
          {urgentTasks.length > 0 ? (
            urgentTasks.map(task => (
              <Typography key={task.id}>
                {task.text}
                {task.targetDate && ` - Due: ${task.targetDate}`}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">No urgent tasks</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Today's Events
          </Typography>
          {todaysEvents.length > 0 ? (
            todaysEvents.map(event => (
              <Typography key={event.id}>
                {event.text}
              </Typography>
            ))
          ) : (
            <Typography color="text.secondary">No events today</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Home; 