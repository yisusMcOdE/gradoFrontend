import { Autocomplete, Button, Card, Grid, TextField } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles";
import { esES } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { getReportArea } from "../../../utilities/allGetFetch";
import { generateReportTrabajoArea } from "../../../utilities/pdfMake/reportTrabajoArea";



export const ReporteArea = () => {

    const classes= useStyles();

    const [data, setData] = useState();

    const columns = [
        
        { field: 'fecha', headerName: 'Fecha', flex: 1},
        { field: 'trabajo', headerName: 'Trabajo', flex: 1 },
        { field: 'cliente', headerName: 'Cliente', flex: 1 },
        { field: 'detalle', headerName: 'Detalle', flex: 1 },
        { field: 'recurso', headerName: 'Recurso Utilizado', flex: 1 },
        { field: 'cantidad', headerName: 'Cantidad', flex: 1 },
        { field: 'precio', headerName: 'Costo', flex: 1 },

      ];

    const generate = async() => {
        const start = (document.getElementById('FormStart').value)
        const end = (document.getElementById('FormEnd').value)
        const area = document.getElementById('FormArea').value
        let response = await getReportArea(area, start, end);
        response = response.map(item=>{
            return {...item, fecha:(item.fecha)}
        })
        setData(response);
    }

    const apiref = useGridApiRef();
    const getData = () => {
        let datos = apiref.current.getDataAsCsv();
        datos = datos.split('\r\n');
        datos = datos.map(item=>item.split(','));
        console.log(datos);
        const start = (document.getElementById('FormStart').value)
        const end = (document.getElementById('FormEnd').value)
        const area = document.getElementById('FormArea').value
        generateReportTrabajoArea(datos, start, end, area);
    }

    return (
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item xs style={{width:'90%'}}>
                    <Card raised>
                        <Grid container direction='column' rowSpacing={1}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Reporte de Trabajos por Area</h1>
                            </Grid>
                        </Grid>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item container alignItems='center' columnSpacing={1}>
                                <Grid item xs={1}>
                                    <label>Area:</label>
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        id='FormArea'
                                        size='small'
                                        defaultValue='Todos'
                                        options={['Todos', 'Impresion', 'Offset', 'Empastado']}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params}/>}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center' columnSpacing={1}>
                                <Grid item container xs={6} alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Desde:</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id='FormStart' type='date'  size='small' fullWidth/>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={6} alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Hasta:</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id='FormEnd' type='date'  size='small' fullWidth/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item alignSelf='center'>
                                <Button variant="contained" onClick={generate}>
                                    Generar Reporte
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {data&&
                    <Grid item xs style={{width:'90%'}}>
                        <Card raised>
                            <Grid container direction='column' rowGap={2}>
                                <Grid item container columnGap={2}>
                                    <Grid item>
                                        <Button variant="contained" onClick={()=>{getData()}}>Imprimir</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant='contained'>
                                            Exportar CVS
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    {(data!==204)?
                                        <DataGrid
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            apiRef={apiref}
                                            rows= {data}
                                            columns={columns}
                                            getRowClassName={(params) =>
                                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                            }
                                        />
                                        :
                                        <h3 style={{textAlign:'center'}}>No existen registros obtenidos</h3>
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                }
            </Grid>
        </Main>
    )
}