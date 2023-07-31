import { Autocomplete, Box, Button, Card, Grid, TextField, Dialog, Collapse } from "@mui/material";
import { Main } from "../../../components/main";
import { useNavigate } from "react-router-dom";
import {useStyles} from '../area.styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid";
import { generateReport } from "../../../utilities/pdfMake/reports";
import { useEffect, useState } from "react";
import { getOrderDetailsConfirmed, getStepById } from "../../../utilities/allGetFetch";
import { StatusTree } from '../../../components/statusTree';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { addDelayById } from "../../../utilities/allPostFetch";


export const Trabajos = () => {

    const navigator = useNavigate();

    const [data, setData] = useState();
    const [areaType, setAreaType] = useState('Todos');
    const [stateType, setStateType] = useState('Todos');
    const [searchBar, setSearchBar] = useState('');
    const [modal, setModal] = useState(false);
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

    const apiref = useGridApiRef();

    const getData = () => {
        let datos = apiref.current.getDataAsCsv();
        datos = datos.split('\r\n');
        datos = datos.map(item=>item.split(','));
        generateReport(datos);
    }

    const loadData = async() => {
        let response = await getOrderDetailsConfirmed();
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
    }

    console.log(data);

    const openModal = (e) => {
        setJobModal({
            id:e.row._id,
            trabajo: e.row.job,
            detalle: e.row.detail,
            cantidad: e.row.requiredQuantity,
            ultimo: e.row.steps.slice(-1)[0].type,
            steps:e.row.steps
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
        loadData()
    },[])

    return (
        data&&
        <Main>
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
                                    <TextField label="Buscar ...." variant="filled" size='small' value={searchBar} onChange={(e)=>{setSearchBar(e.target.value)}}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs style={{width:'80%'}}>
                    <Card raised>
                        <h2 style={{textAlign:'center'}}>Data Table</h2>
                        <div >
                            <Button variant="contained" onClick={()=>{getData()}}>Imprimir</Button>
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
                        </div>
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
                                            navigator(`finalizar/${jobModal.id}`)
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
                                    onClick={()=>{
                                        getStepById(jobModal.id);
                                        setDelayMenu(prev => !prev);
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
                                    onClick={()=>{
                                        getStepById(jobModal.id);
                                        setDelayMenu(prev => !prev);
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
        </Main>
    )
}