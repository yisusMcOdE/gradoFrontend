import { Card, Grid, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Main } from '../../../components/main';
import { useStyles } from './materials.style';
import { DataGrid } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharPie } from '../../../utilities/formatCharPie';
import { padding } from '@mui/system';
import { getMaterialStractByid, materialsById } from '../../../utilities/allGetFetch';
import { useEffect, useState } from 'react';


export const DetailsMaterialArea = () => {

    const {id} = useParams();

    const [data, setData] = useState();
    const [dataStract, setDataStract] = useState();

    console.log(dataStract);

    const loadData = async() => {
        let response = await materialsById(id);
        setData(response);
        response = await getMaterialStractByid(id);
        setDataStract(response);
    }

    useEffect(()=>{
        loadData();
    },[])

    const columns = [
        {field: 'detail', headerName: 'Detalle', flex: 0.5},
        {field: 'detailQuantity', headerName: 'Cantidad ', flex: 0.5},
        {field: 'client', headerName: 'Solicitante', flex: 1},
        {field: 'quantity', headerName: 'Uso', flex: 0.5},
        {field: 'date', headerName: 'Fecha', flex: 1},
    ]

    const classes = useStyles();

    return (
        (data&&dataStract)&&
        <Main>
            <Grid container direction='column' rowSpacing={3} alignItems='center'>
                <Grid item style={{width:'90%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={1}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Estado de material</h1>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Nombre:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={data.name} size='small'/>
                                </Grid>
                            </Grid>
                            
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Unidad de medida:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={data.unit} size='small'/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item container columnSpacing={3} style={{width:'90%'}}>
                    <Grid item xs={9}>
                        <Card>
                            <h2 style={{textAlign:'center'}}>Historial de uso</h2>
                            {<DataGrid
                                rows={dataStract} 
                                columns={columns}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                }
                            />}
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card style={{padding:0}}>
                            <Grid container direction='column'>
                                <Grid item xs>
                                    <h2 style={{textAlign:'center'}}>Estado actual</h2>
                                </Grid>
                                    <Chart style={{width:'100%'}} type='doughnut' data={formatCharPie(
                                        [
                                            {
                                                "En Uso":data.used,
                                                "Reservado":data.reserved,
                                                "Disponible":data.available,
                                            }
                                        ])}
                                    />
                                <Grid style={{margin:15}} item container direction='column' xs>
                                    <Grid item container>
                                        <Grid xs={2} item style={{background:'#9A3A4D', margin:3, border:'2px solid white'}}>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <label>En Uso:</label>
                                        </Grid>
                                        <Grid item>
                                            <label>{data.used}</label>
                                        </Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid xs={2} item style={{background:'#856F39', margin:3, border:'2px solid white'}}>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <label>Reservado:</label>
                                        </Grid>
                                        <Grid item>
                                            <label>{data.reserved}</label>
                                        </Grid>
                                    </Grid>
                                    <Grid item container>
                                        <Grid xs={2} item style={{background:'#2A6790', margin:3, border:'2px solid white'}}>

                                        </Grid>
                                        <Grid item xs={4}>
                                            <label>Disponible:</label>
                                        </Grid>
                                        <Grid item>
                                            <label>{data.available}</label>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Main>
    )
}