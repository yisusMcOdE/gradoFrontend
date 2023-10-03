import { Button, Card, Grid, TextField, Autocomplete, Dialog, Collapse, Snackbar, Alert } from "@mui/material"
import { DataGrid, GridRemoveIcon } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { allClientsExternal, allClientsInternal, getOrderNoConfirmed } from "../../../utilities/allGetFetch";
import { cancelOrderById, confirmOrder } from "../../../utilities/allPutFetch";
import { useStyles } from "./pedidos.styles";


export const Confirmar = () => {

    const classes = useStyles();
    const columns= [
        
        { field: 'index', headerName: 'N°', flex: 0.3 },
        { field: 'client', headerName: 'Cliente', flex: 1 },
        { field: 'stringDetails', headerName: 'Detalle', flex:1.5},
        { field: 'date', headerName: 'Fecha de registro', flex: 1.5 },
    ];

    const [modal, setModal] = useState(false);
    const [data, setData] = useState();
    const [clients, setClients] = useState();
    const [order, setOrder] = useState();
    const [confirm, setConfirm] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [numberCheck, setNumberCheck] = useState('');

    console.log(data);

    const loadData = async() => {
        setData(await getOrderNoConfirmed());

        const external = await allClientsExternal();
        const internal = await allClientsInternal();
        const names = [];
        internal.map(item=>{
            names.push(item.institution);
        })
        external.map(item=>{
            names.push(item.name)
        })
        setClients(names);
    }

    const findOrder = () => {
        let orderFinded = data.find(item => item._id === document.getElementById('id_form').value);
        setOrder(orderFinded);
    }

    const confirmOrderHandler = () => {
        confirmOrder(order._id, {details:order.details, numberCheck:numberCheck});
        loadData();
        setModal(false);
        setOpenSnack(true);
    }

    const handleDays = (e, index) => {

        let det = [...order.details];
        det[index].days = e.target.value;
        setOrder({...order, details: [...det]});
    }

    console.log(order);

    useEffect(()=>{
        loadData()
    },[])

    return (
        data&&
        <>
            <Snackbar
                    
                    open={openSnack}
                    onClose={()=>{setOpenSnack(false)}}
                    autoHideDuration={3000}
                >
                    <Alert variant="filled" severity="success">
                        Orden confirmada correctamente
                    </Alert>
            </Snackbar>
            <Main>
            <Grid container justifyContent='center'>
                <Grid item style={{width:'70%'}}>
                    <Card raised className={classes.confirmarPedidoContainer}>
                        <Grid container direction='column' rowSpacing={3}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Confirmar o Cancelar Pedido</h1>
                            </Grid>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item xs='auto' container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Id de Pedido:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                           
                                            size='small'
                                            id='id_form'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs='auto' container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Cliente:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Autocomplete
                                        size='small'
                                        disablePortal
                                        options={clients}
                                        id="client_form"
                                        sx={{ width: '50%' }}
                                        renderInput={(params) => <TextField {...params}/>}/>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <DataGrid 
                                        style={{width:'95%'}}
                                        onRowClick={(e)=>{
                                            document.getElementById('id_form').value=e.row._id
                                            document.getElementById('client_form').value=e.row.client

                                        }}
                                        rows={data} 
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Grid item display='flex' justifyContent='center'>
                                <Button 
                                    variant="contained"
                                    onClick={()=>{
                                        setModal(prev => !prev);
                                        findOrder();
                                    }}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                order&&
                    <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
                        <Card>
                            <Grid container direction='column' rowSpacing={2}>
                                <Grid item>
                                    <h1 style={{margin:'0', textAlign:'center'}}>Agendar trabajos</h1>
                                </Grid>
                                <Grid item container direction='column' rowSpacing={1}>
                                    <Grid item container columnSpacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Id de pedido</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' disabled value={order?._id}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container columnSpacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Cliente</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' disabled value={order?.client}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container columnSpacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Costo</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' disabled value={`Bs. ${order?.cost}`}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container justifyContent='space-evenly'>
                                    <Button variant="contained" onClick={()=>{setConfirm(prev=>!prev); setCancel(false)}}> Confirmar </Button>
                                    <Button variant="contained" onClick={()=>{setCancel(prev=>!prev); setConfirm(false)}}> Cancelar </Button>
                                </Grid>
                                
                                <Collapse in={confirm}>
                                    <Grid item container direction='column' rowSpacing={1}>

                                        {order.fundsOrigin===undefined&&<Grid item container alignItems='center'>
                                            <Grid item xs={4}>
                                                <label>N° de Boleta</label>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField size="small" value={numberCheck} onChange={(e)=>{setNumberCheck(e.target.value)}}/>
                                            </Grid>
                                        </Grid>}

                                        <Grid item container>
                                            <Grid item xs={6}>
                                                <label>Trabajo</label>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <label>Cantidad</label>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <label>Dias</label>
                                            </Grid>
                                        </Grid>
                                        {
                                            order?.details.map((item, index)=>{
                                                return <Grid item container alignItems='center'>
                                                    <Grid item xs={6}>
                                                        <label>{item.job}</label>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <label>{item.requiredQuantity}</label>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <TextField 
                                                            size="small" 
                                                            value={item.days}
                                                            onChange={e=>handleDays(e, index)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            })
                                        }
                                    </Grid>
                                    <Grid item container justifyContent='space-evenly'>
                                        <Grid item>
                                            <Button
                                                className="activo"
                                                onClick={()=>{confirmOrderHandler()}}
                                            >
                                                Sí
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                onClick={()=>{setConfirm(false)}}
                                                className="inactivo"
                                            >
                                                No
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Collapse>

                                <Collapse in={cancel}>
                                    <p style={{textAlign:'center'}}> No existe un metodo para revertir esta accion <br/> ¿Esta seguro que desea cancelar el pedido?</p>
                                    <Grid item container justifyContent='space-evenly'>
                                        <Grid item>
                                            <Button
                                                className="activo"
                                                onClick={()=>{cancelOrderById(order._id)}}
                                            >
                                                Sí
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                onClick={()=>{setCancel(false)}}
                                                className="inactivo"
                                            >
                                                No
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Card>
                    </Dialog>
            }
        </Main>
        </>
        
    )
}