import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharBar } from "../../../utilities/formatCharBar";
import { allMaterials } from "../../../utilities/allGetFetch";
import { useNavigate } from "react-router-dom";





export const Materiales = () => {

    const navigator = useNavigate();
    const [dataType, setDataType] = useState(false);
    const [data, setData] = useState();
    const [searchBar, setSearchBar] = useState('');

    console.log(data);

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Material', flex: 1},
        {field: 'unit', headerName: 'Unidad', flex: 0.5},
        {field: 'reserved', headerName: 'Reservado', flex: 0.5},
        {field: 'used', headerName: 'En uso', flex: 0.5},
        {field: 'available', headerName: 'Disponible', flex: 0.5},
        {field: 'total', headerName: 'Total', flex: 0.5},
    ]

    const loadData = async() => {
        setData( await allMaterials());
    }

    useEffect(()=>{
        loadData();
    },[])

    const classes = useStyles();
    return (
        data&&
        <Main>
            <Grid container direction='column' rowGap={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Materiales</h1>
                        <Box>
                            <Button 
                                startIcon={<AddIcon/>} 
                                variant='contained'
                                onClick={()=>{navigator('solicitar')}}
                            >
                                Solicitar Material
                            </Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField label="Buscar ...." variant="filled" size='small' value={searchBar} onChange={(e)=>{setSearchBar(e.target.value)}}/>
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised >
                        <Grid container direction='column'>
                            
                            <Grid item>
                                {
                                data!==204 ?
                                    <DataGrid
                                    
                                    rows={data.filter(item=>{return item.name.toLowerCase().includes(searchBar.toLowerCase())})} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                :
                                    <h3 style={{textAlign:'center'}}>No existen materiales registrados</h3>
                                }
                                
                            </Grid>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}