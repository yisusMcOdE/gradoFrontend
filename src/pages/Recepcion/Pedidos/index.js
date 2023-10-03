import { Button, Grid, TextField, Card, Box, Autocomplete } from "@mui/material";
import { InputAdornment} from "@mui/material";
import { useStyles } from "./pedidos.styles";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllOrdersList, orderExternalList, orderInternalList } from "../../../utilities/allGetFetch";
import { width } from "@mui/system";
import { Main } from "../../../components/main";


export const Pedidos = () => {

    const navigator = useNavigate();

    const [dataInternal, setDataInternal] = useState([]);
    const [dataExternal, setDataExternal] = useState([]);
    const [dataView, setDataView] = useState();
    const [search, setSearch] = useState('');

    const [tipeView, setTipeView] = useState('Todos');

    const classes = useStyles();

    const columns= [
        { field: 'number', headerName: 'N°', flex: 0.3 },
        { field: 'client', headerName: 'Cliente', flex: 1.5 },
        { field: 'createdAt', headerName: 'Fecha de registro', flex: 1.3},
    ];
    if(tipeView.includes('finalizado')){
        columns.push({ field: 'dateDelivered', headerName: 'Fecha de entrega', flex: 1.3 })
    }

    const dateFormat = (date) => {
        return (date.slice(0,10)+'  '+date.slice(11,19))
    }

    const orderByDate = (data) =>{
        data.sort((a,b)=> (new Date(a.createdAt)) - (new Date(b.createdAt)))
        return data
    }

    const handleChangeTypeView = (type) => {


        setTipeView(type);
        let newData
        switch (type) {
            case 'Todos':
                newData = orderByDate(dataInternal.concat(
                            dataExternal)).map(
                                (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}})
                setDataView(newData);
                break;
            case 'Internos':
                newData = orderByDate(dataInternal).map(
                            (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}})
                setDataView(newData);
                break;
            case 'Internos pendientes':
                newData = orderByDate(dataInternal.filter(
                            item=>item.statusDelivered===false)).map(
                                (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}})
                setDataView(newData);
                break;
            case 'Internos finalizados':
                newData = orderByDate(dataInternal.filter(
                    item=>item.statusDelivered===true)).map(
                        (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt), dateDelivered: dateFormat(item.dateDelivered)}})
                setDataView(newData);
                break
            case 'Externos':
                newData = orderByDate(dataExternal).map(
                            (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}})
                setDataView(newData);
                break;
            case 'Externos pendientes':
                newData = orderByDate(dataExternal.filter(
                            item=>item.statusDelivered===false)).map(
                                (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}})
                setDataView(newData);
                break;
            case 'Externos finalizados':
                newData = orderByDate(dataExternal.filter(
                    item=>item.statusDelivered===true)).map(
                        (item, index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt), dateDelivered: dateFormat(item.dateDelivered)}})
                setDataView(newData);
                break
            default:
                break;
        }

    }

    const loadData = async () => {
        const response = await getAllOrdersList();
        if(response!==204){
            setDataInternal(response.internal);
            setDataExternal(response.external);
            setDataView(orderByDate(response.internal.concat(
                            response.external)).map(
                                (item,index) => {return {...item, number:index+1, createdAt: dateFormat(item.createdAt)}}));
        }else{
            setDataInternal([]);
            setDataExternal([]);
            setDataView(204)
        }
    }

    useEffect(()=>{
        loadData();
    },[])

    return(
        dataView&&
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item xs style={{width:'80%'}}>
                    <Card raised>
                        <h1 className={classes.titlePage}>Pedidos</h1>
                        <Box>
                            <Button startIcon={<AddIcon/>} onClick={()=>{navigator('nuevo')}} variant='contained'>Nuevo Pedido</Button>
                        </Box>
                        <Box display='flex' justifyContent= 'flex-end' >
                            <SearchIcon sx={{ color: 'white', mr: 1, my: 0.5 }} />
                            <TextField
                                value={search}
                                onChange={(e)=>{setSearch(e.target.value)}}
                                label="Buscar por cliente...." 
                                variant="filled" 
                                size='small'
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs style={{width:'80%'}}>
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
                                {(dataView.length!==0)? 
                                    <DataGrid 
                                        style={{width:'95%'}}
                                        onRowClick={(e)=>{navigator(e.row._id)}}
                                        rows={dataView.filter(item=>{return item.client.toLowerCase().includes(search.toLowerCase())})} 
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                :
                                    <h3 style={{textAlign:'center'}}>No existen registros para mostrar</h3>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}