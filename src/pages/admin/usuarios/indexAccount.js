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
import { allClientsInternal, allEmployees, getAllUsersComplete } from "../../../utilities/allGetFetch";

export const Cuentas = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [dataClient, setDataClient] = useState();
    const [dataEmployee, setDataEmployee] = useState();
    const [dataType, setDataType] = useState(false);
    const [search,setSearch] = useState('');

    const columnsA = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'institution', headerName: 'Institucion', flex: 1.2},
        {field: 'user', headerName: 'Usuario', flex: 1},
        {field: 'role', headerName: 'Rol', flex: 0.5},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ];


    const columnsB = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1},
        {field: 'user', headerName: 'Usuario', flex: 0.5},
        {field: 'role', headerName: 'Rol', flex: 0.5},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ];

    const loadData = async() => {
        let data = await getAllUsersComplete();
        if(data!==204){
            data={
                institution : data.institution.map(item=>{return{...item, status:item.status?'ACTIVO':'SUSPENDIDO'}}),
                employee : data.employee.map(item=>{return{...item, status:item.status?'ACTIVO':'SUSPENDIDO'}})
            }
            if(data.institution.length!==0)
                setDataClient(data.institution);
            else
                setDataClient(204);
            if(data.employee.length!==0)
                setDataEmployee(data.employee)
            else
                setDataEmployee(204);
        }else{
            setDataClient(204);
            setDataEmployee(204);
        }
    }

    useEffect(()=>{
        loadData();
    },[])

    return (
        (dataEmployee&&dataClient)&&
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Cuentas de Usuarios del Sistema</h1>
                        <Box>
                            <Button onClick={()=>{navigator('/admin/usuarios/crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Usuario</Button>
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
                                        <FormControlLabel value={true} control={<Radio />} label="Instituciones" />
                                        <FormControlLabel value={false} control={<Radio />} label="Empleados" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                            <Grid item>
                                {
                                dataType?
                                    
                                        (dataClient!==204)?
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
                                            />
                                        :
                                            <h3 style={{textAlign:'center'}}>No existen cuentas de instituciones registradas</h3>
                                     
                                    :
                                        (dataEmployee!==204)?
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
                                        :
                                        <h3 style={{textAlign:'center'}}>No existen cuentas de empleados registradas</h3>
                                }
                            </Grid>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}