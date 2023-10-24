import React, { useEffect, useRef, useState } from "react";
import { FrappeGantt } from "frappe-gantt-react";
import { useStyles } from "./gantt.styles";
import { Button, Dialog, Card, TextField, Collapse, Grid } from "@mui/material";
import { getSchedule } from "../../utilities/allGetFetch";
import { addStepById } from "../../utilities/allPutFetch";
import { updateSchedule } from "../../utilities/allPutFetch";
import { StatusTree } from "../statusTree";
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { addDelayById } from "../../utilities/allPostFetch";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from 'notistack';


import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Finalizar } from "../../pages/area/trabajos/Finalizar";

export const MyGantt =  ({type, direction}) => {

    const { enqueueSnackbar } = useSnackbar();

    const navigator = useNavigate();
    const ganttRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [daysDelayForm, setDaysDelayForm] = useState({error:false, value:1});
    const [justifyForm, setJustifyForm] = useState({error:false, value:''});
    const [tasks, setTask] = useState(null);
    const [modal, setModal] = useState(false);
    const [modalFinish, setModalFinish] = useState({open:false});
    const [jobModal, setJobModal] = useState({trabajo:'',cantidad_solicitada:'',detalle:''});
    const [delayMenu, setDelayMenu] = useState(false);
    const [changes, setChanges] = useState(false);

    const datosRef = useRef([]);
    const typesSpanish = {
        'registered': 'Registrado',
        'confirmation': 'Confirmado',
        'scheduled': 'Agendado',
        'delayed': 'Retrasado',
        'develop': 'Desarrollando',
        'resumed': 'Reanudado',
        'finished': 'Finalizado'
    }


    const loadData = async() => {
        setChanges(false);
        const response = await getSchedule();
        const formatItem = (item) => {
            let color = ''
            let progressSelectedColor = ''
            let disabled = false
            ///----COLOR
            if(item.steps[item.steps.length - 1].type==='delayed'){
                color = 'red'
                progressSelectedColor = '#D22B2B'
            }else{
                color = '#008000'
                progressSelectedColor = '#3B9C3B'
            }
            ///---DISABLES
            if((item.steps[item.steps.length - 1].type==='delayed') || (item.progress===0)){
                disabled = true
            }
            return{
                ...item, 
                start: new Date(item.start), 
                end: new Date(item.end),
                id:item._id,
                isDisabled: direction? true : disabled,
                styles:{
                    progressColor : color,
                    progressSelectedColor : progressSelectedColor
                }
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

    console.log(tasks);

    const changeDate = async(id, start, end, steps) => {

        setChanges(true)

        const index = datosRef.current.findIndex(item => {
        return item.id===id
        })
        const diferenciaMs = end.getTime() - start.getTime();
        let segundos = (diferenciaMs / (1000));

        let segundosRetraso = 0;
        steps.map(item => {
            if(item.type === 'delayed'){
                segundosRetraso += (item.dayDelay * 86400)
            }
        })

        segundos -= segundosRetraso;

        ///Guardar en array changes para enviar al server

        if(index !== -1){
            const arrayReference = [...datosRef.current];
            arrayReference[index]={...arrayReference[index], start:start, end:end, seconds:segundos};
            datosRef.current = [...arrayReference];
        }else{
            const arrayReference = [...datosRef.current];
            arrayReference.push({id:id, seconds:segundos, start:start, end:end});
            datosRef.current = [...arrayReference];
        }
        console.log(datosRef.current);
    }

    const updateTasks = async() => {

        
        const response = await updateSchedule(datosRef.current);

        if(response.status===200){
            enqueueSnackbar('Cronograma actualizado',{variant:'success'});            
            await loadData()
        }else{
            enqueueSnackbar('Error: No se actualizo correctamente',{variant:'error'});            
        }
    }

    const openModal = (task) => {
        setJobModal({
            id:task._id,
            trabajo: task.job,
            detalle: task.detail,
            cantidad: task.requiredQuantity,
            ultimo: typesSpanish[task.steps.slice(-1)[0].type],
            steps:task.steps
        });
        setModal(prev=>!prev)
    }

    const createdelay = async() => {
        ///Validation
        let error = false
        if(daysDelayForm.value <= 0 ){
            enqueueSnackbar('Valor de dias invalido',{variant:'error'});            
            setDaysDelayForm({error: true, value: daysDelayForm.value});
            error = true;
        }
        if(justifyForm.value === ''){
            enqueueSnackbar('Debe definir una justificacion',{variant:'error'});            
            setJustifyForm({error: true, value:justifyForm.value});
            error = true;
        }

        if(!error){
            const data = {
                'id': jobModal.id,
                'description': justifyForm.value,
                'days' : daysDelayForm.value
            }
            setLoading(true);
                const response = await addDelayById(data);
                setLoading(false);

                if(response.status === 201){
                    enqueueSnackbar('Retraso creado',{variant:'success'});            
                    await loadData();
                    setModal(false);
                }else{
                    enqueueSnackbar('Error: Retraso no creado',{variant:'error'});            
                }
        }
        
    }

    const startJob = async(id) => {
        setLoading(true);
        const response = await addStepById(id);
        setLoading(false);

        if(response.status===200){
            enqueueSnackbar('Trabajo iniciado',{variant:'success'});
            await loadData();
            setModal(false);
        }else{
            enqueueSnackbar('Error: No iniciado',{variant:'error'});
        }
    }

    const resumedJob = async(id) => {
        setLoading(true);
        const response = await addStepById(id);
        setLoading(false);

        if(response.status===200){
            enqueueSnackbar('Trabajo reanudado',{variant:'success'});
            await loadData();
            setModal(false);
        }else{
            enqueueSnackbar('Error: No reanudado',{variant:'error'});
        }
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
            
        }


        {tasks.Todos?.length > 0 ?
            tasks[type]?.length > 0 ?
                    <Gantt 
                        locale="spa" 
                        tasks={tasks[type]} 
                        onDoubleClick={task => {
                            openModal(task);
                        }}
                        onDateChange={(task)=>{
                            changeDate(task.id, task.start, task.end, task.steps);
                        }}
                        listCellWidth={null}
                        todayColor={'gray'}
                        TooltipContent={()=>{}}
                    />
                :
                    <h3 style={{textAlign:'center'}}>No existen trabajos para el area seleccionada</h3>
            
            :
            <h3 style={{textAlign:'center'}}>No existen trabajos pendientes</h3>
        }
        {!direction&&
            <Button
                disabled={!changes}
                variant="contained"
                onClick={()=>{updateTasks()}}
            >
                Actualizar
            </Button>
        }
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
                    {
                    !direction&&<>
                    {
                    (jobModal.ultimo==='Desarrollando' || jobModal.ultimo==='Reanudado') &&
                        <Grid item container direction='column' rowSpacing={3}>
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
                                            ///navigator(`finalizar/${jobModal.id}`)
                                            setModalFinish({open:true, id:jobModal.id});
                                            setModal(false);
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
                                                <TextField
                                                    value={daysDelayForm.value}
                                                    onChange={(e)=>{setDaysDelayForm({error:false, value:e.target.value})}}
                                                    error={daysDelayForm.error}
                                                    required
                                                    label='Requerido'
                                                    type='number' 
                                                    size='small' 
                                                    />
                                            </Grid>
                                        </Grid>
                                        <Grid item container columnGap={3}>
                                            <Grid item xs={5}>
                                                <label>Justificacion de retraso:</label>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    value={justifyForm.value}
                                                    onChange={(e)=>{setJustifyForm({error:false, value:e.target.value})}}
                                                    error={justifyForm.error}
                                                    required
                                                    label='Requerido'
                                                    multiline
                                                    size='small'
                                                />
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
                        </Grid>
                    }
                    {
                    jobModal.ultimo==='Agendado' && 
                        <Grid item container direction='column' rowSpacing={3}>
                            <Grid item display='flex' justifyContent='center'>
                                <Button 
                                    style={{background:'green'}}
                                    onClick={()=>{
                                        startJob(jobModal.id);
                                    }}
                                >
                                        Iniciar Trabajo
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {
                    jobModal.ultimo==='Retrasado' && 
                        <Grid item container direction='column' rowSpacing={3}>
                            <Grid item display='flex' justifyContent='center'>
                                <Button 
                                    style={{background:'green'}}
                                    onClick={()=>{
                                        resumedJob(jobModal.id);
                                    }}
                                >
                                        Reanudar Trabajo
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    </>
                    }
                </Grid>
            </Card>
        </Dialog>
        <Dialog  onClose={()=>{setModalFinish({open:!modalFinish.open})}} open={modalFinish.open}>
            <Finalizar 
                id={modalFinish.id} 
                close = {()=>{setModalFinish({open:!modalFinish.open})}}
                load = {loadData}
            />
        </Dialog>
    </div>
    
    
};
