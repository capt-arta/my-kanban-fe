'use client'
import axios from 'axios';
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import React, { useEffect, useState } from 'react'

const GanttChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/task-list');
        const fetchedData = response.data.data;
        setData(fetchedData);
    } catch (error) {
        console.error('An error occurred:', error);
    } 
      finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  
  function parseDateString(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
  
    return  {year, month, day};
  }

  const formattedTasks = data.map((task) => {
    const startDate = parseDateString(task.start_date);
    const endDate = parseDateString(task.end_date);
    console.log({startDate, endDate});
    return {
      id: task.id,
      name: task.name,
      start: new Date(startDate.year, startDate.month, startDate.day ) ,
      end: new Date(endDate.year, endDate.month, endDate.day),
      type:'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    }
  });
  
  // console.log({data, formattedTasks});
  return (
    <div className='w-full flex flex-col'>
        <h1>Gantt Chart</h1>
        <div className='mt-8'>
          {!loading && <Gantt tasks={formattedTasks} />}  
        </div>
    </div>
  )
}

export default GanttChart