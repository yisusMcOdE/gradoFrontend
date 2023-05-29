import { Card, Grid, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Main } from '../../../components/main';
import { useStyles } from './materials.style';
import { DataGrid } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharPie } from '../../../utilities/formatCharPie';
import { padding } from '@mui/system';


export const DetailsMaterialArea = () => {

    const data = require('../../../__mock__/material.json');
    const {id} = useParams();
    const element = data[Number(id)-1];

    const datapie=[
        {
            "En Uso":175,
            "Solicitado":70,
            "Disponible":30,
        }
    ]

    const columns = [
        {field: 'trabajo', headerName: 'Trabajo', flex: 1.5},
        {field: 'cliente', headerName: 'Cliente', flex: 1.5},
        {field: 'uso', headerName: 'Cantidad utilizada', flex: 1.5},
    ]

    const classes = useStyles();

    return (
        <Main>
            <Grid container direction='column' rowSpacing={3} style={{width:'100%'}}>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={1}>
                            <Grid item>
                                <h1 className={classes.titlePage}>{element.nombre}</h1>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Id:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={element.id} size='small'/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Marca:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={element.marca} size='small'/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Unidad de medida:</label>
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField value={element.unidad} size='small'/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item container columnSpacing={3}>
                    <Grid item xs={9}>
                        <Card>
                            <DataGrid
                                rows={data} 
                                columns={columns}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                }
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card style={{padding:'0'}}>
                            <div >
                                <Chart type='doughnut' data={formatCharPie(datapie)}/>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Main>
    )
}