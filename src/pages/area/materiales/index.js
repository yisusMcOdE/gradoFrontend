import { Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
import { Card, Grid, TextField, Autocomplete } from "@mui/material";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import { Chart } from 'react-chartjs-2'
import 'chart.js/auto';
import { formatCharBar } from "../../../utilities/formatCharBar";
import { useNavigate } from "react-router-dom";



export const MaterialArea = () => {

    const navigator = useNavigate();


    const [dataType, setDataType] = useState(false);
    const data = require('../../../__mock__/material.json');

    const columns = [
        {field: 'id', headerName: 'N°', flex: 0.5},
        {field: 'nombre', headerName: 'Material', flex: 1.5},
        {field: 'unidad', headerName: 'Unidad', flex: 0.5},
        {field: 'marca', headerName: 'Marca', flex: 1},
        {field: 'sobrante', headerName: 'Sobrante', flex: 0.5},
    ]

    const classes = useStyles();
    return (
        <Main>
            <Grid container direction='column' rowGap={3}>
                <Grid item style={{width:'50rem'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Materiales</h1>
                        <Box>
                            <Button startIcon={<AddIcon/>} variant='contained'>Solicitar Material</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField label="Buscar ...." variant="filled" size='small'/>
                        </Box>
                    </Card>
                </Grid>
                <Grid container style={{width:'50rem'}}>
                    <Card raised style={{width:'50rem'}}>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <Box display='flex' justifyContent= 'center' >
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={dataType}
                                        onChange={()=>{setDataType(prev => !prev)}}
                                        row
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Grafico" />
                                        <FormControlLabel value={false} control={<Radio />} label="Tabla" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={1}>
                                    <label> Ver: </label>
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        size='small'
                                        disablePortal
                                        id="combo-box-demo"
                                        options={['Todos', 'Asignados', 'Sobrantes']}
                                        renderInput={(params) => <TextField {...params}/>}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item>
                                {
                                dataType?
                                    <Chart type="bar" data={formatCharBar(data)} options={{indexAxis: "y",}}/> :
                                    <DataGrid
                                    onRowClick={(e)=>{navigator(`${e.row.id}`)}}
                                    rows={data} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                    />
                                }
                            </Grid>
                            
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}