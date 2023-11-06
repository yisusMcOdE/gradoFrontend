import { Autocomplete, Box, Button, Card, Grid, TextField, Dialog, Collapse, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Main } from "../../../components/main";
import { useNavigate } from "react-router-dom";
import {useStyles} from '../area.styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getOrderDetailsConfirmed } from "../../../utilities/allGetFetch";
import { addStepById } from "../../../utilities/allPutFetch";
import { StatusTree } from '../../../components/statusTree';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { addDelayById } from "../../../utilities/allPostFetch";
import { useSnackbar } from 'notistack';
import { Finalizar } from "./Finalizar";



export const Trabajos = () => {

    const { enqueueSnackbar } = useSnackbar();

    const navigator = useNavigate();

    const [loading, setLoading] = useState(false);

    const [daysDelayForm, setDaysDelayForm] = useState({error:false, value:1});
    const [justifyForm, setJustifyForm] = useState({error:false, value:''});


    const [data, setData] = useState();
    const [areaType, setAreaType] = useState('Todos');
    const [stateType, setStateType] = useState('Todos');
    const [searchBar, setSearchBar] = useState('');
    const [modal, setModal] = useState(false);
    const [modalFinish, setModalFinish] = useState({open:false});
    const [delayMenu, setDelayMenu] = useState(false);
    const [jobModal, setJobModal] = useState({trabajo:'',cantidad_solicitada:'',detalle:''});


    const classes = useStyles();

    const columns= [
        { field: 'index', headerName: 'N°', flex: 0.5  },
        { field: 'client', headerName: 'Cliente', flex: 1 },
        { field: 'job', headerName: 'Trabajo', flex: 1 },
        { field: 'requiredQuantity', headerName: 'Cantidad', flex: 1 },
        { field: 'area', headerName: 'Area', flex: 1.5 },
        { field: 'state', headerName: 'Estado', flex: 1.5 },
    ];
    const typesSpanish = {
        'registered': 'Registrado',
        'confirmation': 'Confirmado',
        'scheduled': 'Agendado',
        'delayed': 'Retrasado',
        'develop': 'Desarrollando',
        'resumed': 'Reanudado',
        'finished': 'Finalizado'
    }
        
    


    const apiref = useGridApiRef();


    const loadData = async() => {
        let response = await getOrderDetailsConfirmed();
        if(response !== 204){
            response = response.map(item => {
                if(item.steps.length === 3){
                    return {...item, state:'En Cola'}
                }
                if(-1 === item.steps.findIndex(item => item.type === 'finished')){
                    return {...item, state:'En Proceso'}
                }
                if(-1 !== item.steps.findIndex(item => item.type === 'finished')){
                    return {...item, state:'Finalizado'}
                }
            })
            setData(response);
        }else{
            setData(204)
        }
        
    }


    const openModal = (e) => {
        setJobModal({
            id:e.row._id,
            trabajo: e.row.job,
            detalle: e.row.detail,
            cantidad: e.row.requiredQuantity,
            ultimo: typesSpanish[e.row.steps.slice(-1)[0].type],
            steps:e.row.steps
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

    console.log(modalFinish);

    useEffect(()=>{
        loadData()
    },[])

    return (
        data&&
            <Main>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Grid container direction='column' rowGap={2} alignItems='center'>
                    <Grid item xs style={{width:'80%'}}>
                        <Card raised>
                            <Grid container direction='column' rowSpacing={1}>
                                <Grid item>
                                    <h1 className={classes.titlePage}>Trabajos de Area</h1>
                                </Grid>
                                <Grid item container alignItems='center' columnSpacing={1}>
                                    <Grid item xs={1}>
                                        <label>Area:</label>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Autocomplete
                                        size='small'
                                        disablePortal
                                        defaultValue='Todos'
                                        value={areaType}
                                        onChange={(e)=>{
                                            setAreaType(e.target.innerText)
                                        }}
                                        options={['Todos', 'Impresion', 'Offset', 'Empastado']}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params}/>}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center' columnSpacing={1}>
                                    <Grid item xs={1}>
                                        <label>Estado:</label>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Autocomplete
                                        size='small'
                                        disablePortal
                                        defaultValue='Todos'
                                        value={stateType}
                                        onChange={(e)=>{
                                            setStateType(e.target.innerText)
                                        }}
                                        options={['Todos', 'En Desarrollo', 'En Espera', 'Finalizados']}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params}/>}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Box display='flex' justifyContent= 'flex-end' >
                                        <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                                        <TextField label="Buscar por Cliente...." variant="filled" size='small' value={searchBar} onChange={(e)=>{setSearchBar(e.target.value)}}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item xs style={{width:'80%'}}>
                        <Card raised>
                                {data!==204?
                                    <DataGrid
                                        localeText={esES}
                                        apiRef={apiref}
                                        onRowClick={(e)=>{openModal(e)}}                                    
                                        rows={
                                            data.filter(item => {
                                                ///Filtrado por Area
                                                let filter = '';
                                                if(areaType!=='Todos'){
                                                    filter = areaType
                                                }
                                                return item.area.includes(filter)
                                            }).filter(item => {
                                                ///Filtrado por estado
                                                switch (stateType) {
                                                    case 'Todos':
                                                        return true
                                                        break;
                                                    
                                                    case 'En Espera':
                                                        return item.steps.length === 3
                                                        break;

                                                    case 'En Desarrollo':
                                                        return ((-1 === item.steps.findIndex(item => item.type === 'finished'))&&(item.steps.length !== 3))
                                                        break;

                                                    case 'Finalizados':
                                                        return -1 !== item.steps.findIndex(item => item.type === 'finished')
                                                        break;
                                            
                                                    default:
                                                        break;
                                                }
                                            }).filter(item => {
                                                ///Filtrado por nombre ciente
                                                return item.client.toLowerCase().includes(searchBar.toLowerCase());
                                            })
                                        } 
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                :
                                    <h3 style={{textAlign:'center'}}>No Existe Ningun Registro de Trabajos</h3>
                                }
                        </Card>
                    </Grid>
                </Grid>
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
            </Main>
    )
}