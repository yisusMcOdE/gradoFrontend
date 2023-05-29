import React from "react";
import { FrappeGantt } from "frappe-gantt-react";
import { useStyles } from "./gantt.styles";

export const Gantt = () => {

  let d1 = new Date();
  let d2 = new Date();
  d2.setDate(d2.getDate() + 5);
  let d3 = new Date();
  d3.setDate(d3.getDate() + 8);
  let d4 = new Date();
  d4.setDate(d4.getDate() + 20);
  
  let tasks = require('../../__mock__/tareas.json');
  tasks = tasks.map(item=>{return{...item,start:new Date(item.start), end:new Date(item.end)}});
  console.log(tasks);

  const classes = useStyles();


  return <div className={classes.container}>
    <FrappeGantt
        tasks={tasks}
        onClick={task => console.log(task, "click")}
        onDateChange={(task, start, end) =>
          console.log(task, start, end, "date")
        }
        onProgressChange={(task, progress) =>
          console.log(task, progress, "progress")
        }
        onTasksChange={tasks => console.log(tasks, "tasks")}
    />
  </div>
    
    
};
