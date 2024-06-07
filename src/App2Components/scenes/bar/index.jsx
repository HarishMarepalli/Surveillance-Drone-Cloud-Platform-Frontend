import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

const Bar = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [droneId, setDroneId] = useState('D001'); // Assuming a default droneId

  const dummySchedules = [
    {
      drone_id: "D001",
      start_time: "2024-04-26T10:00:00Z",
      end_time: "2024-04-26T11:00:00Z",
      schedule_id: "S001"
    },
    {
      drone_id: "D001",
      start_time: "2024-04-27T17:00:00Z",
      end_time: "2024-04-27T19:00:00Z",
      schedule_id: "S002"
    },
    // Add more dummy schedules as needed
  ];

  useEffect(() => {
    setSchedules(dummySchedules);
  }, [])

  // useEffect(() => {
  //   // Fetch schedules from the database
  //   const fetchSchedules = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/schedules/${droneId}`);
  //       setSchedules(response.data);
  //     } catch (error) {
  //       console.error('Error fetching schedules:', error);
  //     }
  //   };

  //   fetchSchedules();
  // }, [droneId]);

  const handleSlotSelect = (info) => {
    // Check if the selected slot is available (not already occupied)
    console.log(info);
    const isSlotAvailable = !schedules.some(schedule => {
      const slotStart = new Date(info.startStr);
      const slotEnd = new Date(info.endStr);
      const scheduleStart = new Date(schedule.start_time);
      const scheduleEnd = new Date(schedule.end_time);
      return (
        (slotStart >= scheduleStart && slotStart < scheduleEnd) ||
        (slotEnd > scheduleStart && slotEnd <= scheduleEnd) ||
        (slotStart <= scheduleStart && slotEnd >= scheduleEnd)
      );
    });

    if (isSlotAvailable) {
      setSelectedSlot(info);
    } else {
      setSelectedSlot(null);
      // Optionally show a message to the user that the slot is not available
    }


    const title = prompt("Please enter a new title for your event");
      const calendarApi = info.view.calendar;
      calendarApi.unselect();
  
      if (title) {
        calendarApi.addEvent({
          id: `${info.dateStr}-${title}`,
          title,
          start: info.startStr,
          end: info.endStr,
          allDay: info.allDay,
        });
      }
  };

  const handleSaveSlot = async () => {
    try {
      console.log('Selected Slot Start:', selectedSlot.startStr);
      console.log('Selected Slot End:', selectedSlot.endStr);
      // await axios.post('${BASE_URL}/api/addschedule', {
      //   drone_id: droneId,
      //   start_time: selectedSlot.startStr,
      //   end_time: selectedSlot.endStr
      // });
      setOpenDialog(false);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error saving slot:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleEventDrop = (info) => {
    console.log("Drop: "+ info);
    // const updatedEvents = schedules.map(event => {
    //   if (event.id === info.event.id) {
    //     // Update the start and end times of the dropped event
    //     return {
    //       ...event,
    //       start: info.event.startStr,
    //       end: info.event.endStr
    //     };
    //   }
    //   return event;
    // });
    // setSchedules(updatedEvents);
    // setSelectedSlot(info);
  };

  const handleEventResize = (info) => {
    console.log("Resize: "+ info.event);
    // const updatedEvents = schedules.map(event => {
    //   if (event.id === info.event.id) {
    //     // Update the start and end times of the dropped event
    //     return {
    //       ...event,
    //       start: info.event.startStr,
    //       end: info.event.endStr
    //     };
    //   }
    //   return event;
    // });
    // setSchedules(updatedEvents);
    setSelectedSlot(info.event);
  };

  const eventClassNames = (arg) => {
    // Check if the event is a dummy schedule
    const isDummySchedule = dummySchedules.some(schedule => {
      const scheduleStart = new Date(schedule.start_time);
      const scheduleEnd = new Date(schedule.end_time);
      return (
        (arg.start >= scheduleStart && arg.start < scheduleEnd) ||
        (arg.end > scheduleStart && arg.end <= scheduleEnd) ||
        (arg.start <= scheduleStart && arg.end >= scheduleEnd)
      );
    });

    console.log(isDummySchedule);
    // Add a custom CSS class if the event is a dummy schedule
    return isDummySchedule ? 'dummy-schedule' : '';
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        startIcon={<AddCircleOutlineIcon />}
      >
        Create Schedule
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
        <DialogTitle>Create Schedule</DialogTitle>
        <DialogContent>
          <FullCalendar
            plugins={[dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            selectable={true}
            editable={true}
            select={handleSlotSelect}
            events={schedules}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventClassNames={eventClassNames}
            validRange={{ start: new Date(), end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) }} // Two months from today
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSlot} disabled={!selectedSlot}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Bar;
