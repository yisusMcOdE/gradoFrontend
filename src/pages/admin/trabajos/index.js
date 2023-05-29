import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
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
import { allClients, allEmployees, allJobs, allMaterials } from "../../../utilities/allGetFetch";

export const TrabajosAdmin = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [trabajos, setTrabajos] = useState();    

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1},
        {field: 'description', headerName: 'Descripcion', flex: 2},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ]

    const getData = async() => {
        setTrabajos(await allJobs());
    }

    useEffect(()=>{
        getData();
    },[])

    return (
        trabajos&&<Main>
            <Grid container direction='column' rowGap={3}>
                <Grid item style={{width:'50rem'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Trabajos</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Trabajo</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField label="Buscar ...." variant="filled" size='small'/>
                        </Box>
                    </Card>
                </Grid>
                <Grid container style={{width:'50rem'}}>
                    <Card raised style={{width:'50rem'}}>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <DataGrid
                                onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                rows={trabajos} 
                                columns={columns}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                }
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}