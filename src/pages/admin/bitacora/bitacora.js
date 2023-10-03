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
import { getAllBinnacle, getAllUsers } from "../../../utilities/allGetFetch";

export const Binnacle = () => {

    const navigator = useNavigate();

    const classes = useStyles();  

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.2},
        {field: 'user', headerName: 'Usuario', flex: 0.5},
        {field: 'method', headerName: 'Metodo', flex: 0.5},
        {field: 'route', headerName: 'EndPoint', flex: 1},
        {field: 'date', headerName: 'Fecha', flex: 0.5},
        {field: 'time', headerName: 'Hora', flex: 0.5},
        {field: 'successful', headerName: 'Resultado', flex: 0.5},
    ]
    const [data, setData] = useState();
    const [users, setUsers] = useState();
    const [usersSelected, setUserSelected] = useState('Todos');

    console.log(users);

    const loadData = async() => {
        let response = await getAllBinnacle(usersSelected);
        setData(response);
    }
    const loadUsers = async() => {
        let response = await getAllUsers();
        setUsers(response);
    }

    useEffect(()=>{
        loadData();
        loadUsers();
    },[])

    useEffect(()=>{
        loadData();
    },[usersSelected])

    return (
        data&&<Main>
            <Grid container direction='column' rowGap={3} alignItems='center'>
                <Card raised style={{width:'80%'}}>
                    <Grid container direction='column' rowSpacing={2}>
                        <Grid container direction='column'>
                            <Grid item>
                                <h1 className={classes.titlePage}>Bitacora</h1>
                            </Grid>
                            <Grid item container alignItems={'center'}>
                                <Grid item xs = {1}>
                                    Usuario:
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        size='small'
                                        value={usersSelected}
                                        onChange={(e)=>{setUserSelected(e.target.textContent)}}
                                        options={['Todos'].concat(users?.map(item=>{return item.user}))}
                                        renderInput={(params) =><TextField 
                                                                    variant="filled"
                                                                    {...params}
                                                                />}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <DataGrid
                            style={{width:'95%'}}
                            onRowClick={(e)=>{navigator(`detail/${e.row._id}`)}}
                            rows={data} 
                            columns={columns}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                            }
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Main>
    )
}