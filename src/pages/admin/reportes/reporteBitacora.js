import { Autocomplete, Button, Card, Grid, TextField } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main"
import { useStyles } from "../admin.styles";
import { esES } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { allMaterials, getAllBinnacle, getMaterialStractByid, getOrdersFinishedReport, getReportArea } from "../../../utilities/allGetFetch";
import { generateReportMaterialUse } from "../../../utilities/pdfMake/reportMaterialUse";
import { generateReportOrdersTotalFinished } from "../../../utilities/pdfMake/reportOrdersTotalFinished";
import { generateReportTotalTotal } from "../../../utilities/pdfMake/reportOrdersTotalFinishedDetail";
import { generateReportBinnacle } from "../../../utilities/pdfMake/reportBinnacle";
import { generateReportBinnacleDetail } from "../../../utilities/pdfMake/reportBinnacleDetail";



export const ReporteBitacora = () => {

    const classes= useStyles();

    const [data, setData] = useState();

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.2},
        {field: 'user', headerName: 'Usuario', flex: 0.5},
        {field: 'method', headerName: 'Metodo', flex: 0.5},
        {field: 'route', headerName: 'EndPoint', flex: 1},
        {field: 'date', headerName: 'Fecha', flex: 0.5},
        {field: 'time', headerName: 'Hora', flex: 0.5},
        {field: 'successful', headerName: 'Resultado', flex: 0.5},
    ]

    const generate = async() => {
        const start = (document.getElementById('FormStart').value);
        const end = (document.getElementById('FormEnd').value);
        let response = await getAllBinnacle('Todos',start, end);
        setData(response);
    }

    const apiref = useGridApiRef();

    const getData = () => {
        let datos = apiref.current.getDataAsCsv();
        datos = datos.split('\r\n');
        datos = datos.map(item=>item.split(','));
        datos = datos.map(item => {
            item.shift();
            return item
        })
        console.log(datos);
        const start = (document.getElementById('FormStart').value)
        const end = (document.getElementById('FormEnd').value)
        generateReportBinnacle(datos, start, end);
    }

    const getDataDetails = () => {

        ///Obteniendo datos de la tabla
        let datos = apiref.current.getDataAsCsv();
        datos = datos.split('\r\n');
        datos = datos.map(item=>item.split(','));

        ///Obteniendo indices seleccionados
        datos.shift();
        const indexes = [] ;
        datos.map((item) => {
            item.map((value,index) => {
                if(index===0)
                    indexes.push(value)
            })
        })
        
        ///Filtrando los datos con los indices seleccionados
        const dataSelected = data.filter(item => {
            return (indexes.includes(item.index.toString()))
        })

        console.log(dataSelected);
        const start = (document.getElementById('FormStart').value);
        const end = (document.getElementById('FormEnd').value);
        generateReportBinnacleDetail(dataSelected,start,end,'todos' )
    }

    useEffect(()=>{
        
    },[])

    return (
        
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item xs style={{width:'90%'}}>
                    <Card raised>
                        <Grid container direction='column' rowSpacing={1}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Reporte de Bitacora</h1>
                            </Grid>
                        </Grid>
                        <Grid container direction='column' rowSpacing={2}>
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
                                        <Button variant="contained" onClick={()=>{getData()}}>Imprimir Reporte</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={()=>{getDataDetails()}}>Imprimir Reporte Detallado</Button>
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