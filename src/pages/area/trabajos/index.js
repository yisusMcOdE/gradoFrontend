import { Autocomplete, Box, Button, Card, Grid, TextField } from "@mui/material";
import { Main } from "../../../components/main";
import { useNavigate } from "react-router-dom";
import {useStyles} from '../area.styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";


export const Trabajos = () => {

    const navigator = useNavigate();

    const data = require('../../../__mock__/pedidos_table.json');

    const classes = useStyles();

    const columns= [
        { field: 'id', headerName: 'N°', flex: 0.5  },
        { field: 'id_pedido', headerName: 'ID PEDIDO', flex: 1 },
        { field: 'institucion', headerName: 'INSTITUCION', flex: 1 },
        { field: 'fecha_inicio', headerName: 'FECHA REGISTRO', flex: 1.5 },
        { field: 'fecha_entrega', headerName: 'FECHA ENTREGA', flex: 1.5 },
      ];

    return (
        <Grid container direction="column" justifyContent="center">
            <Grid item xs={12} className={classes.areaContainer}>
                <Grid container direction='column' rowGap={3} className={classes.indexContainer}>
                    <Grid item xs style={{width:'50rem'}}>
                        <Card raised>
                            <Grid container direction='column' rowSpacing={1}>
                                <Grid item>
                                    <h1 className={classes.titlePage}>Trabajos de Area</h1>
                                </Grid>
                                <Grid item container alignItems='center' columnSpacing={1}>
                                    <Grid item xs='auto'>
                                        <label>Area:</label>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Autocomplete
                                        size='small'
                                        disablePortal
                                        id="combo-box-demo"
                                        options={['Imprenta', 'Offset', 'Empastado']}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params}/>}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Box display='flex' justifyContent= 'flex-end' >
                                        <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                                        <TextField label="Buscar ...." variant="filled" size='small'/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item xs >
                        <Card raised>
                            <h2 style={{textAlign:'center'}}>Data Table</h2>
                            <div >
                                <DataGrid 
                                    onRowClick={(e)=>{navigator(e.row.id_pedido)}}
                                    slots={{ toolbar: GridToolbar }}
                                    rows={data} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                />
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}