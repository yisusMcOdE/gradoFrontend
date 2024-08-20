import { Card, Grid, TextField } from "@mui/material";
import { Main } from "../../../components/main";
import { useEffect, useState } from "react";
import 'chart.js/auto';
import { useStyles } from "../admin.styles";
import { getBinnacleById } from "../../../utilities/allGetFetch";
import { useParams } from "react-router-dom";

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
    })


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