import { Autocomplete, Button, Card, Grid, TextField } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles";
import { esES } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid";
import { getAllEquipment, getReportArea } from "../../../utilities/allGetFetch";
import { generateReportTrabajoArea } from "../../../utilities/pdfMake/reportTrabajoArea";



export const ReporteArea = () => {

    const classes= useStyles();

    const [data, setData] = useState();
    const [dataEquipment, setDataEquipment] = useState(['']);
    const [area, setArea] = useState('Todos');
    const [initial, setInitial] = useState('');
    const [end, setEnd] = useState('');
    const [equipment, setEquipment] = useState('Todos');

    const columns = [
        
        { field: 'index', headerName: 'N°', flex: 1},
        { field: 'fecha', headerName: 'Fecha', flex: 2},
        { field: 'trabajo', headerName: 'Trabajo', flex: 2 },
        { field: 'cliente', headerName: 'Cliente', flex: 3 },
        { field: 'detalle', headerName: 'Detalle', flex: 3 },
        { field: 'recurso', headerName: 'Recurso Utilizado', flex: 2 },
        { field: 'cantidad', headerName: 'Cantidad', flex: 1.5 },
        { field: 'precio', headerName: 'Costo', flex: 1 },

      ];

    const generate = async() => {

        let response = await getReportArea(area, initial, end, equipment.slice(0,(equipment.indexOf('"')-1)));
        console.log(response);
        if(response!==204)
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
        datos = datos.map(item=>{
            item.shift()
            return item;
        });
        console.log(datos);
        generateReportTrabajoArea(datos, initial, end, area, equipment);
    }

    const loadData = async() => {
        const response = await getAllEquipment();
        if(response !== 204)
            setDataEquipment(response.map(item=>{return `${item.name} "${item.brand}"`}))
    }

    useEffect(()=>{
        loadData();
    },[])

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
                                <Grid item container xs={6} alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Area:</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            onChange={(e)=>{
                                                setData(null)
                                                if(e.target.textContent!=='')
                                                    setArea(e.target.textContent)
                                            }}
                                            value = {area}
                                            size='small'
                                            options={['Todos', 'Impresion Digital', 'Offset', 'Empastado']}
                                            fullWidth
                                            renderInput={(params) => <TextField {...params}/>}
                                        />
                                    </Grid>
                                </Grid>
                                {
                                area === 'Impresion Digital'&&
                                    <Grid item container xs={6} alignItems='center'>
                                        <Grid item xs={2}>
                                            <label>Equipo:</label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Autocomplete
                                                onChange={(e)=>{
                                                    setData(null)
                                                    if(e.target.textContent!=='')
                                                        setEquipment(e.target.textContent)
                                                }}
                                                value={equipment}
                                                size='small'
                                                options={['Todos'].concat(dataEquipment)}
                                                fullWidth
                                                renderInput={(params) => <TextField {...params}/>}
                                            />
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                            <Grid item container alignItems='center' columnSpacing={1}>
                                <Grid item container xs={6} alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Desde:</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id='FormStart' type='date'  size='small' fullWidth onChange={()=>{setData(null)}}/>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={6} alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Hasta:</label>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField id='FormEnd' type='date'  size='small' fullWidth onChange={()=>{setData(null)}}/>
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

                            {(data!==204)?<>
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
                                            style={{width:'100%'}}
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            apiRef={apiref}
                                            rows= {data}
                                            columns={
                                                area==='Impresion Digital'?
                                                    columns.slice(0,5).concat(
                                                        [{ field: 'equipment', headerName: 'Equipo Utilizado', flex: 2 }
                                                        ].concat(
                                                            columns.slice(5,8)
                                                        ))
                                                :
                                                    columns
                                            }
                                            getRowClassName={(params) =>
                                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                            }
                                        />
                                </Grid>
                                </>
                                :
                                        <h3 style={{textAlign:'center'}}>No existen registros obtenidos</h3>
                            }
                            </Grid>
                        </Card>
                    </Grid>
                }
            </Grid>
        </Main>
    )
}