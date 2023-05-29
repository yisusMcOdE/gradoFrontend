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
import { useStyles } from "../recepcion.styles";
import { allClientsExternal, allClientsInternal} from "../../../utilities/allGetFetch";

export const ClientesRecepcion = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [dataClientInternal, setDataClientInternal] = useState();
    const [dataClientExternal, setDataClientExternal] = useState();
    const [dataType, setDataType] = useState(false);

    

    const columnsA = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'institution', headerName: 'Institucion', flex: 1.5},
        {field: 'phone', headerName: 'Telefono', flex: 1},
        {field: 'address', headerName: 'Direccion', flex: 1},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ];
    const columnsB = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1.5},
        {field: 'phone', headerName: 'Telefono', flex: 1},
        {field: 'address', headerName: 'Direccion', flex: 1.5},
    ];

    const getData = async() => {
        setDataClientInternal(await allClientsInternal());
        setDataClientExternal( await allClientsExternal());
    }

    useEffect(()=>{
        getData();
    },[])

    return (
        dataClientExternal&&<Main>
            <Grid container direction='column' rowGap={3}>
                <Grid item style={{width:'50rem'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Clientes</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Cliente</Button>
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
                                <Box display='flex' justifyContent= 'center' >
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={dataType}
                                        onChange={()=>{setDataType(prev => !prev)}}
                                        row
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Internos" />
                                        <FormControlLabel value={false} control={<Radio />} label="Externos" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                            <Grid item>
                                {
                                dataType?
                                    <DataGrid
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={dataClientInternal} 
                                    columns={columnsA}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    /> :
                                    <DataGrid
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={dataClientExternal} 
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