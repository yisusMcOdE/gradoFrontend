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
import { useNavigate } from "react-router-dom";
import { useStyles } from "../admin.styles";
import { allClients, allEmployees, allMaterials } from "../../../utilities/allGetFetch";

export const Bitacora = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const [materials, setMaterials] = useState();    

    const columns = [
        {field: 'id', headerName: 'N°', flex: 0.5},
        {field: 'action', headerName: 'Nombre', flex: 1},
        {field: 'result', headerName: 'Resultado', flex: 1},
        {field: 'document', headerName: 'Documento', flex: 1},
        {field: 'newValue', headerName: 'Nuevo Valor', flex: 1},
        {field: 'oldValue', headerName: 'Antiguo Valor', flex: 1},
        {field: 'date', headerName: 'Fecha', flex: 0.5},
        {field: 'time', headerName: 'Hora', flex: 0.5},
    ]

    const data = [
        {
            id:1,
            action:'crear',
            result:'correcto',
            document:'User',
            newValue:'jesus',
            oldValue:'morales',
            date:'01-01-2023',
            time:'00:00:00'
        }
    ]


    return (
        <Main>
            <Grid container direction='column' rowGap={3}>
                <Card raised style={{width:'50rem'}}>
                    <Grid container direction='column' rowSpacing={2}>
                        <Grid container direction='column'>
                            <Grid item>
                                <h1 className={classes.titlePage}>Bitacora</h1>
                            </Grid>
                            <Grid item container>
                                <Grid item xs={3}>
                                    <Autocomplete
                                        size='small'
                                        options={['']}
                                        renderInput={(params) =><TextField 
                                                                    variant="filled"
                                                                    {...params}
                                                                />}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Box display='flex' justifyContent= 'center' >
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            defaultValue={true}
                                            row
                                        >
                                            <FormControlLabel value={true} control={<Radio />} label="Clientes" />
                                            <FormControlLabel value={false} control={<Radio />} label="Empleados" />
                                        </RadioGroup>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <DataGrid
                            onRowClick={(e)=>{navigator(`${e.row._id}`)}}
                            rows={data} 
                            columns={columns}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                            }
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Main>
    )
}