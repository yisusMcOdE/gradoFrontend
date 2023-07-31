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
                                <h1 className={classes.titlePage}>{data.name}</h1>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Id:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={data._id} size='small'/>
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
                        <Card style={{padding:'0', position:'sticky', top:'10px'}}>
                            <h2 style={{textAlign:'center'}}>Estado actual</h2>
                                <Chart type='doughnut' data={formatCharPie(
                                    [
                                        {
                                            "En Uso":data.used,
                                            "Reservado":data.reserved,
                                            "Disponible":data.available,
                                        }
                                    ])}
                                />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Main>
    )
}