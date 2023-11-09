import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button, Dialog, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharBar } from "../../../utilities/formatCharBar";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../admin.styles";
import { allClients, allEmployees, allMaterials, getBackupFiles } from "../../../utilities/allGetFetch";
import { addBackUp, restoreBackup } from "../../../utilities/allPostFetch";
import { useSnackbar } from "notistack";

export const Backup = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [item, setItem] = useState({});
    const [confirmation, setConfirmation] = useState(false);
    const [data, setData] = useState();

    const classes = useStyles(); 

    const columns = [
        {field: 'id', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1.5},
        {field: 'date', headerName: 'Fecha', flex: 1},
        {field: 'time', headerName: 'Hora', flex: 1},
        {field: 'size', headerName: 'Tamaño', flex: 1},
    ]

    const loadData = async() => {
        let response = await getBackupFiles();
        setData(response);
    }

    const handleResponse = async(response) => {
        if(response.status === 201){
            enqueueSnackbar('Backup creado',{variant:'success'});            

        }
        if(response.status === 202){
            setModal(false);
            enqueueSnackbar('Restauracion Completa',{variant:'success'});            
        }
        if(response.status === 501){
            const data = await response.json();
            enqueueSnackbar(`${(data.reason || data.message)}`,{variant:'warning'});            
        }
    }

    useEffect(()=>{
        loadData();
    },[])

    const restoreDataBase = async(archive) => {
        const body = {
            "archive" : archive,
            "code": '123'
        };
        const response = await restoreBackup(body);
        handleResponse(response)
    }

    const generateBackup = async () =>{
        const response = await addBackUp();
        handleResponse(response)
    }

    console.log(search);

    return (
        data&&
        <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <Grid container direction='column' rowGap={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Copias De Respaldo</h1>
                        <Box>
                            <Button onClick={generateBackup} variant='contained'>Generar Nueva Copia</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField 
                                type='date'
                                value={search}
                                onChange={(e)=>{setSearch(e.target.value)}}
                                variant="filled" 
                                size='small'/>
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised >
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                {(data!==204)?
                                    <DataGrid
                                        style={{width:'95%'}}
                                        onRowClick={(e)=>{setItem(e.row); setModal(true)}}
                                        rows={data.filter(item=>{
                                            return item.date.includes(search)
                                        })}
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                    :
                                    <h3 style={{textAlign:'center'}}>No existen backups generados</h3>
                                }
                                <Dialog open={modal} onClose={()=>{setModal(false)}} >
                                    <Card style={{overflow:'auto'}}>
                                        <Grid container direction='column' rowSpacing={3}>
                                            <Grid item>
                                                <h1 className={classes.titlePage}>Archivo de Respaldo</h1>
                                            </Grid>
                                            <Grid item container direction='column' rowSpacing={1}>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Nombre:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField disabled size='small' value={item.name}/>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Fecha de creacion:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField disabled size='small' value={item.date}/>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Hora de creacion:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField disabled size='small' value={item.time}/>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Tamaño de archivo:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField disabled size='small' value={item.size}/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item justifyContent='center' display='grid'>
                                                <Button
                                                    variant="contained"
                                                    onClick={()=>{setConfirmation(prev=>!prev)}}
                                                >
                                                    {
                                                        !confirmation?'Iniciar Restauracion':'Cancelar Restauracion'
                                                    }
                                                </Button>
                                            </Grid>
                                            {
                                                confirmation&&<>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Codigo de restauracion:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField size='small'/>
                                                    </Grid>
                                                </Grid>
                                                <Grid item justifyContent='center' display='grid'>
                                                    <Button variant="contained" onClick={()=>{restoreDataBase(item.name)}}>Confirmar Restauracion</Button>
                                                </Grid>
                                                </>
                                            }
                                        </Grid>
                                    </Card>
                                </Dialog>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}