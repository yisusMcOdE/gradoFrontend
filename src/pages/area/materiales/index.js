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
import { useNavigate } from "react-router-dom";
import { allMaterials } from "../../../utilities/allGetFetch";



export const MaterialArea = () => {

    const navigator = useNavigate();

    const [searchBar, setSearchBar] = useState('');
    const [data, setData] = useState(false);

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Material', flex: 1.5},
        {field: 'unit', headerName: 'Unidad', flex: 1},
        {field: 'reserved', headerName: 'Reservado', flex: 1},
        {field: 'used', headerName: 'En uso', flex: 1},
        {field: 'available', headerName: 'Disponible', flex: 1},
        {field: 'over', headerName: 'Sobrantes', flex: 1},
        {field: 'total', headerName: 'Total', flex: 1},
    ]

    const loadData = async() => {
        const response = await allMaterials()
        setData( response);
    }


    useEffect(()=>{
        loadData();
    },[])

    const classes = useStyles();
    return (
        data&&<Main>
            <Grid container direction='column' rowGap={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Materiales</h1>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField label="Buscar ...." variant="filled" size='small' value={searchBar} onChange={(e)=>{setSearchBar(e.target.value)}}/>
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column' rowSpacing={2}>
                            
                            <Grid item>
                                {data!==204?
                                    <DataGrid
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={data.filter(item=>{
                                        return item.name.toLowerCase().includes(searchBar.toLowerCase());
                                    })} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                :
                                    <h3 style={{textAlign:'center'}}>No existen Materiales Registrados</h3>
                                }
                            </Grid>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}