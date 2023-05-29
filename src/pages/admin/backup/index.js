import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button, Dialog } from "@mui/material";
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
import { allClients, allEmployees, allMaterials } from "../../../utilities/allGetFetch";

export const Backup = () => {

    const [modal, setModal] = useState(false);
    const [item, setItem] = useState({});
    const [confirmation, setConfirmation] = useState(false);

    const navigator = useNavigate();

    const classes = useStyles(); 

    const data = require ('../../../__mock__/backupList.json');

    const columns = [
        {field: 'id', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1.5},
        {field: 'date', headerName: 'Fecha', flex: 1},
    ]

    

    return (
        <Main>
            <Grid container direction='column' rowGap={3}>
                <Grid item style={{width:'50rem'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Copias De Respaldo</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} variant='contained'>Generar Nueva Copia</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField type='date' variant="filled" size='small'/>
                        </Box>
                    </Card>
                </Grid>
                <Grid container style={{width:'50rem'}}>
                    <Card raised style={{width:'50rem'}}>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <DataGrid
                                    onRowClick={(e)=>{setItem(e.row); setModal(true)}}
                                    rows={data}
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                <Dialog open={modal} onClose={()=>{setModal(false)}}>
                                    <Card>
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
                                                        <TextField disabled size='small' value='00:00:00'/>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container alignItems='center'>
                                                    <Grid item xs={3}>
                                                        <label>Tamaño de archivo:</label>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <TextField disabled size='small' value='14 Kb'/>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item justifyContent='center' display='grid'>
                                                <Button 
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
                                                    <Button>Confirmar Restauracion</Button>
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