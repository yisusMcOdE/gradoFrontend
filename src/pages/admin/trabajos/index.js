import { Box, Button } from "@mui/material";
import { Card, Grid, TextField } from "@mui/material";
import { Main } from "../../../components/main";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import 'chart.js/auto';
import { useNavigate } from "react-router-dom";
import { useStyles } from "../admin.styles";
import { allJobs} from "../../../utilities/allGetFetch";

export const TrabajosAdmin = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [trabajos, setTrabajos] = useState();
    const [search, setSearch] = useState('');

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'name', headerName: 'Nombre', flex: 1},
        {field: 'description', headerName: 'Descripcion', flex: 2},
        {field: 'status', headerName: 'Estado', flex: 0.5},
    ]

    const loadData = async() => {
        let response = await allJobs();
        if(response!==204){
            response = response.map(item=> {return{...item, status:item.status?'ACTIVO':'SUSPENDIDO'}})
            setTrabajos(response);
        }else{
            setTrabajos(204)
        }
    }

    useEffect(()=>{
        loadData();
    },[])

    return (
        trabajos&&<Main>
            <Grid container direction='column' rowGap={3} alignItems={'center'}>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Trabajos</h1>
                        <Box>
                            <Button onClick={()=>{navigator('crear')}} startIcon={<AddIcon/>} variant='contained'>Crear Trabajo</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField 
                                label= "Buscar ...." 
                                variant= "filled" 
                                size= 'small'
                                value= {search}
                                onChange = {e=>{setSearch(e.target.value)}}
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                {(trabajos!==204)?
                                    <DataGrid
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                                    rows={trabajos.filter(item=>{
                                        return item.name.toLowerCase().includes(search.toLowerCase());
                                    })} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                :
                                    <h3 style={{textAlign:'center'}}>No existen trabajos registrados</h3>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}