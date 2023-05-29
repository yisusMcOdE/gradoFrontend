import { Button, Grid, TextField, Card, Box, Autocomplete } from "@mui/material";
import { InputAdornment} from "@mui/material";
import { useStyles } from "./pedidos.styles";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderExternalList, orderInternalList } from "../../../utilities/allGetFetch";
import { width } from "@mui/system";


export const Pedidos = () => {

    const navigator = useNavigate();

    const [dataInternal, setDataInternal] = useState([]);
    const [dataExternal, setDataExternal] = useState([]);
    const [dataView, setDataView] = useState();

    const [tipeView, setTipeView] = useState('Todos');

    const classes = useStyles();

    const columns= [
        
        { field: 'id', headerName: 'Id de Pedido', flex: 1 },
        { field: 'client', headerName: 'Cliente', flex: 1 },
        { field: 'createdAt', headerName: 'Fecha de registro', flex: 1.5 },
    ];
    if(tipeView.includes('finalizado')){
        columns.push({ field: 's', headerName: 'Fecha de entrega', flex: 1.5 })
    }

    const handleChangeTypeView = (type) => {
        setTipeView(type);
        switch (type) {
            case 'Todos':
                setDataView(dataExternal.concat(dataInternal));
                break;
            case 'Internos':
                setDataView(dataInternal);
                break;
            case 'Internos pendientes':
                setDataView(dataInternal.filter(item=>item.statusDelivered===false));
                break;
            case 'Internos finalizados':
                setDataView(dataInternal.filter(item=>item.statusDelivered===true));
                break
            case 'Externos':
                setDataView(dataExternal);
                break;
            case 'Externos pendientes':
                setDataView(dataExternal.filter(item=>item.statusDelivered===false));
                break;
            case 'Externos finalizados':
                setDataView(dataExternal.filter(item=>item.statusDelivered===true));
                break
            default:
                break;
        }

    }

    const loadData = async () => {
        setDataInternal(await orderInternalList());
        setDataExternal(await orderExternalList());
        setDataView((await orderInternalList()).concat(await orderExternalList()));
    }
    console.log(dataView);

    useEffect(()=>{
        loadData();
    },[])


    return(
        dataView&&<Grid container direction="column" justifyContent="center">
            <Grid item xs={12} className={classes.areaContainer}>
                <Grid container direction='column' rowGap={3} className={classes.indexContainer}>
                    <Grid item xs style={{width:'50rem'}}>
                        <Card raised>
                            <h1 className={classes.titlePage}>Pedidos</h1>
                            <Box>
                                <Button startIcon={<AddIcon/>} onClick={()=>{navigator('nuevo')}} variant='contained'>Nuevo Pedido</Button>
                            </Box>
                            <Box display='flex' justifyContent= 'flex-end' >
                                <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                                <TextField label="Buscar por cliente...." variant="filled" size='small'/>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs >
                        <Card raised >
                            <Grid container direction='column' rowSpacing={3}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={1}>
                                        <label>Filtrar: </label>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            size='small'
                                            fullWidth
                                            options={['Todos','Internos','Internos pendientes','Internos finalizados','Externos','Externos pendientes','Externos finalizados']}
                                            renderInput={(params) => <TextField variant="filled" {...params}/>}
                                            value={tipeView}
                                            onChange={(e)=>{handleChangeTypeView(e.target.textContent)}}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <DataGrid 
                                        style={{width:'95%'}}
                                        onRowClick={(e)=>{navigator(e.row._id)}}
                                        rows={dataView} 
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                </Grid>
                            </Grid>
                                
                                
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
                
        </Grid>
    )
}