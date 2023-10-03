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
import { useNavigate, useParams } from "react-router-dom";
import { useStyles } from "../admin.styles";
import { getAllBinnacle, getBinnacleById } from "../../../utilities/allGetFetch";
import { ReactJsonBeautify } from "react-json-beautify";

export const BinnacleDetail = () => {

    const {id} = useParams();
    const classes = useStyles();
    const [data, setData] = useState();

    const loadData = async() => {
        const response = await getBinnacleById(id);
        setData(response)
    }

    console.log(data);

    useEffect(()=>{
        loadData()
    },[])


    return (
        data&&<Main>
            <Grid container direction='column' rowGap={3} alignItems='center'>
                <Card raised style={{width:'60%'}}>
                    <Grid container direction='column' rowSpacing={1}>
                        <Grid container direction='column'>
                            <Grid item>
                                <h1 className={classes.titlePage}>Detalle de registro de bitacora</h1>
                            </Grid>
                            <Grid item container direction='column' rowGap={1}>
                                {<Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        Fecha:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.date}/>
                                    </Grid>
                                </Grid>}
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        Hora:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.time}/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        Usuario:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.user}/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        Metodo:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.method}/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        EndPoint:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.route}/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3} >
                                        Resultado:
                                    </Grid>
                                    <Grid item>
                                        <TextField size="small" value={data.successful}/>
                                    </Grid>
                                </Grid>
                                <Grid item container >
                                    <Grid item xs={3} >
                                        Parametros de ruta:
                                    </Grid>
                                    <Grid item>
                                        <pre style={{backgroundColor:'#282A36', padding:15, borderRadius:15, color:'white'}}>{JSON.stringify(JSON.parse(data.params), null, 3)}</pre>

                                    </Grid>
                                </Grid>
                                <Grid item container >
                                    <Grid item xs={3} >
                                        Consultas de ruta:
                                    </Grid>
                                    <Grid item>
                                        <pre style={{backgroundColor:'#282A36', padding:15, borderRadius:15, color:'white'}}>{JSON.stringify(JSON.parse(data.queries), null, 3)}</pre>
                                    </Grid>
                                </Grid>
                                {data.inputValues&&
                                    <Grid item container >
                                        <Grid item xs={3} >
                                            Valores enviados:
                                        </Grid>
                                        <Grid item>
                                            <pre style={{backgroundColor:'#282A36', padding:15, borderRadius:15, color:'white'}}>{JSON.stringify(JSON.parse(data.inputValues), null, 3)}</pre>
                                        </Grid>
                                    </Grid>
                                }
                                {data.oldValues&&
                                    <Grid item container>
                                        <Grid item xs={3} >
                                            Valores Anteriores:
                                        </Grid>
                                        <Grid item>
                                            <pre style={{backgroundColor:'#282A36', padding:15, borderRadius:15, color:'white'}}>{JSON.stringify(JSON.parse(data.oldValues), null, 3)}</pre>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Main>
    )
}