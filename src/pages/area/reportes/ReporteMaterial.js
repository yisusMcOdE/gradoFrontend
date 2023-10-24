import { Autocomplete, Button, Card, Grid, TextField } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles";
import { esES } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { allMaterials, getMaterialStractByid, getReportArea } from "../../../utilities/allGetFetch";
import { generateReportMaterialUse } from "../../../utilities/pdfMake/reportMaterialUse";



export const ReporteMaterial = () => {

    const classes= useStyles();

    const [data, setData] = useState();
    const [materials, setMaterials] = useState();

    const loadMaterials = async() => {
        const response = await allMaterials()
        setMaterials( response);
    }

    const columns = [
        { field: 'date', headerName: 'Fecha', flex: 1},
        { field: 'client', headerName: 'Solicitante', flex: 1 },
        { field: 'detail', headerName: 'Motivo', flex: 1 },
        { field: 'detailQuantity', headerName: 'Cantidad Solicitada', flex: 1 },
        { field: 'quantity', headerName: 'Cantidad Utilizada', flex: 1 },
      ];

    const generate = async() => {
        const start = (document.getElementById('FormStart').value);
        const end = (document.getElementById('FormEnd').value);
        const material = document.getElementById('FormMaterial').value;
        const idMaterial = materials.find(item=>{ return item.name===material})._id;
        let response = await getMaterialStractByid(idMaterial, start, end);
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
        const area = document.getElementById('FormMaterial').value
        generateReportMaterialUse(datos, start, end, area);
    }

    useEffect(()=>{
        loadMaterials()
    },[])

    return (
        materials&&
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item xs style={{width:'90%'}}>
                    <Card raised>
                        <Grid container direction='column' rowSpacing={1}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Reporte de Uso de Material</h1>
                            </Grid>
                        </Grid>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item container alignItems='center' columnSpacing={1}>
                                <Grid item xs={1}>
                                    <label>Material:</label>
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        id='FormMaterial'
                                        size='small'
                                        options={materials.map(item=>item.name)}
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
                                    <DataGrid
                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                        apiRef={apiref}
                                        rows= {data}
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                }
            </Grid>
        </Main>
    )
}