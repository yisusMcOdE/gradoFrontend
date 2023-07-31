import React, { useEffect, useRef, useState } from "react";
import { FrappeGantt } from "frappe-gantt-react";
import { useStyles } from "./gantt.styles";
import { Button, Dialog, Card, TextField, Collapse, Grid } from "@mui/material";
import { getSchedule, getStepById } from "../../utilities/allGetFetch";
import { updateSchedule } from "../../utilities/allPutFetch";
import { StatusTree } from "../statusTree";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { addDelayById } from "../../utilities/allPostFetch";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";

export const MyGantt =  ({type}) => {

    const navigator = useNavigate();
    const datos = [];
    const [tasks, setTask] = useState(null);
    const [modal, setModal] = useState(false);
    const [jobModal, setJobModal] = useState({trabajo:'',cantidad_solicitada:'',detalle:''});
    const [delayMenu, setDelayMenu] = useState(false);

    const ganttRef = useRef(null);

    const loadData = async() => {
        const response = await getSchedule();

        const formatItem = (item) => {
            return{
                ...item, 
                start: (item.start.slice(0,10)), 
                end: (item.end.slice(0,10)), 
                id:item._id
            } 
        }

        let todos = response.Todos;
        todos = todos.map(item=>{
            return formatItem(item)
        });

        let impresion = response.Imprenta;
        impresion = impresion.map(item=>{
            return formatItem(item)
        });

        let offset = response.Offset;
        offset = offset.map(item=>{
            return formatItem(item)
        });

        let empastado = response.Empastado;
        empastado = empastado.map(item=>{
            return formatItem(item)
        });


        setTask({
        'Todos': todos,
        'Impresion': impresion,
        'Offset': offset,
        'Empastado': empastado
        });
    }

  const changeDate = async(id, start, end) => {

    const index = datos.findIndex(item => {
      return item.id===id
    })
    const diferenciaMs = end.getTime() - start.getTime();
    const dias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

    ///Guardar en array changes para enviar al server

    if(index !== -1){
      datos[index]={...datos[index], start:start, end:end, dias:dias};
    }else{
      datos.push({id:id, dias:dias, start:start, end:end});
    }
  }

  const updateTasks = async() => {
    updateSchedule(datos);
  }

  const openModal = (task) => {
    setJobModal({
        id:task._id,
        trabajo: task.job,
        detalle: task.detail,
        cantidad: task.requiredQuantity,
        ultimo: task.steps.slice(-1)[0].type,
        steps:task.steps
    });
    setModal(prev=>!prev)
  }

  const createdelay = async() => {
    const days = document.getElementById('daysDelayForm').value;
    const justify = document.getElementById('descriptionDelayForm').value;
    const data = {
        'id': jobModal.id,
        'description': justify,
        'days' : days
    }
    await addDelayById(data);

    await loadData();

    setModal(false);

    }

    useEffect(()=>{
        loadData();
    },[])

    useEffect(()=>{
        if(ganttRef.current){
            ganttRef.current._svg.current.height.baseVal.value = 60 + (38*tasks[type].length)
        }
    },[type])


    var classes = useStyles();

  ////---------STYLES---------


  return tasks && 
    <div 
        className={`cont ${classes.container}`}
    >
        {
            tasks[type]?.length > 0 ?
                <FrappeGantt
                
                ref={ganttRef}
                tasks={tasks[type]}
                onClick={task => {
                    openModal(task);
                }
                }
                onDateChange={(task, start, end) =>{
                    changeDate(task.id, start, end);
                }
                }
                />
            :
            <div>
                <label>No existen trabajos para el area seleccionada</label>
            </div>
        }
            <Button
                variant="contained"
                onClick={()=>{updateTasks()}}
            >
                Guardar
            </Button>

        <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
            <Card style={{overflow:'auto'}}>
                <Grid container direction='column' rowSpacing={2}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Detalle del Trabajo</h1>
                    </Grid>
                    <Grid container columnSpacing={3}>
                        <Grid item xs={7} container direction='column' rowSpacing={1}>
                            <Grid item container  alignItems='center' columnSpacing={3}>
                                <Grid item xs={3}><label>Trabajo:</label></Grid>
                                <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.trabajo}/></Grid>
                            </Grid>
                            <Grid item container alignItems='center' columnSpacing={3}>
                                <Grid item xs={3}><label>Cantidad:</label></Grid>
                                <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.cantidad}/></Grid>
                            </Grid>
                            <Grid item container alignItems='flex-start' columnSpacing={3}>
                                <Grid item xs={3}><label>Detalle:</label></Grid>
                                <Grid item xs> <TextField disabled fullWidth multiline  size='small' defaultValue={jobModal.detalle}/></Grid>
                            </Grid>
                            <Grid item container alignItems='flex-start' columnSpacing={3}>
                                <Grid item xs={3}><label>Ultimo estado:</label></Grid>
                                <Grid item xs> <TextField disabled fullWidth multiline  size='small' defaultValue={jobModal.ultimo}/></Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <StatusTree steps={jobModal.steps}/>
                        </Grid>
                    </Grid>
                    {(jobModal.ultimo==='develop' || jobModal.ultimo==='resumed') &&<Grid item container direction='column' rowSpacing={3}>
                        <Grid item container display='flex' justifyContent='center'>
                            <Grid item xs = {6} >
                                <Button 
                                    style={{background:'red'}} 
                                    startIcon={<MoreTimeIcon/>}
                                    onClick={()=>{setDelayMenu(prev => !prev)}}
                                >
                                        Crear Retraso
                                </Button>
                            </Grid>
                            <Grid item xs = {6}>
                                <Button 
                                    style={{background:'green'}}
                                    onClick={()=>{
                                        navigator(`../trabajos/finalizar/${jobModal.id}`)
                                        ///getStepById(jobModal.id);
                                    }}
                                >
                                        Finalizar Trabajo
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item display='flex' justifyContent='center' >
                            <Collapse in={delayMenu} style={{border:'1px solid white', padding:'1rem', borderRadius:'5px'}}>
                                <Grid container direction='column' rowSpacing={2}>
                                    <Grid item container columnGap={3}>
                                        <Grid item xs={5}>
                                            <label>Dias de retraso:</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id='daysDelayForm' type='number' size='small' style={{width:'100px'}}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container columnGap={3}>
                                        <Grid item xs={5}>
                                            <label>Justificacion de retraso:</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField id='descriptionDelayForm' multiline size='small'/>
                                        </Grid>
                                    </Grid>
                                    <Grid item display='flex' justifyContent='flex-end'>
                                        <Button 
                                            style={{background:'red'}}
                                            onClick={()=>{createdelay()}}
                                        >
                                            Crear
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </Grid>
                    </Grid>}
                    {jobModal.ultimo==='scheduled' && <Grid item container direction='column' rowSpacing={3}>
                        <Grid item display='flex' justifyContent='center'>
                            <Button 
                                style={{background:'green'}}
                                onClick={async()=>{
                                    await getStepById(jobModal.id);
                                    await loadData();
                                    setModal(false);
                                }}
                            >
                                    Iniciar Trabajo
                            </Button>
                        </Grid>
                        </Grid>
                    }
                    {jobModal.ultimo==='delayed' && <Grid item container direction='column' rowSpacing={3}>
                        <Grid item display='flex' justifyContent='center'>
                            <Button 
                                style={{background:'green'}}
                                onClick={async()=>{
                                    await getStepById(jobModal.id);
                                    await loadData();
                                    setModal(false);

                                }}
                            >
                                    Reanudar Trabajo
                            </Button>
                        </Grid>
                        </Grid>
                    }
                </Grid>
            </Card>
        </Dialog>
    </div>
    
    
};
