import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, esES } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharBar } from "../../../utilities/formatCharBar";
import { useNavigate } from "react-router-dom";
import { useStyles } from "../admin.styles";
import { allClientsInternal, allEmployees } from "../../../utilities/allGetFetch";

export const Usuarios = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [dataClient, setDataClient] = useState();
    const [dataEmployee, setDataEmployee] = useState();
    const [dataType, setDataType] = useState(false);
    const [search,setSearch] = useState('');

    const columnsA = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'institution', headerName: 'Nombre / Institucion', flex: 1.5},
        {field: 'phone', headerName: 'Telefono', flex: 1},
        {field: 'address', headerName: 'Direccion', flex: 1},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ];


    const columnsB = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1.5},
        {field: 'phone', headerName: 'Telefono', flex: 1},
        {field: 'role', headerName: 'Rol', flex: 0.5},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ];

    const getData = async() => {
        if (dataClient===undefined||dataEmployee===undefined){
            const dataClient = await allClientsInternal()
            const dataEmployee = await allEmployees()

            Promise.all([dataClient, dataEmployee]).then(()=>{
                setDataClient(dataClient);
                setDataEmployee(dataEmployee);
        })}
    }

    useEffect(()=>{
        getData();
    },[])

    return (
        (dataEmployee&&dataClient)&&
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Usuarios</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Usuario</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' alignItems={'center'}>
                            <SearchIcon sx={{ mr: 1, my: 0.5 }} />
                            <TextField 
                                label= "Buscar ...."
                                variant= "filled"
                                size= 'small'
                                value= {search}
                                onChange={e=>{setSearch(e.target.value)}}
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised >
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <Box display='flex' justifyContent= 'center' >
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={dataType}
                                        onChange={()=>{setDataType(prev => !prev)}}
                                        row
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Clientes" />
                                        <FormControlLabel value={false} control={<Radio />} label="Empleados" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                            <Grid item>
                                {
                                dataType?
                                    <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={dataClient.filter(item=>{
                                        return item.institution.toLowerCase().includes(search.toLowerCase());
                                    })} 
                                    columns={columnsA}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    /> :
                                    <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={dataEmployee.filter(item=>{
                                        return item.name.toLowerCase().includes(search.toLowerCase());
                                    })} 
                                    columns={columnsB}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                }
                            </Grid>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}