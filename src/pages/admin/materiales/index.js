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
import { allClients, allEmployees, allMaterials } from "../../../utilities/allGetFetch";

export const MaterialesAdmin = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [materials, setMaterials] = useState();
    const [search, setSearch] = useState('');

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1},
        {field: 'status', headerName: 'Estado', flex: 1},
    ]

    const loadData = async() => {
        let response = await allMaterials();
        if(response!==204){
            response = response.map(item=> {return{...item, status:item.status?'ACTIVO':'SUSPENDIDO'}})
            setMaterials(response);
        }else
            setMaterials(204);
    }

    useEffect(()=>{
        loadData();
    },[])

    return (
        materials&&<Main>
            <Grid container direction='column' rowGap={2} alignItems={'center'}>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Materiales</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Material</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField 
                                label= "Buscar ...."
                                variant= "filled"
                                size= 'small'
                                value= {search}
                                onChange= {e=>{setSearch(e.target.value)}} 
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised >
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                {(materials!==204)?
                                    <DataGrid
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={materials.filter(item=>{
                                        return item.name.toLowerCase().includes(search.toLowerCase());
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