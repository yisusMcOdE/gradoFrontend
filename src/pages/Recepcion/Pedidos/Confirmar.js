import { Button, Card, Grid, TextField, Autocomplete, Dialog, IconButton, Collapse, Snackbar, Backdrop, CircularProgress, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { DataGrid, GridRemoveIcon } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { allClientsExternal, allClientsInternal, getOrderNoConfirmed } from "../../../utilities/allGetFetch";
import { cancelOrderById, confirmOrder } from "../../../utilities/allPutFetch";
import { useStyles } from "./pedidos.styles";
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from "notistack";



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        background:'black',
        padding: theme.spacing(1),
    },
  }));


export const Confirmar = () => {

    const { enqueueSnackbar } = useSnackbar();


    const initialInput = {error:false, value:''}

    const classes = useStyles();
    const columns= [
        { field: 'index', headerName: 'N°', flex: 0.3 },
        { field: 'client', headerName: 'Cliente', flex: 1 },
        { field: 'stringDetails', headerName: 'Detalle', flex:1.5},
        { field: 'date', headerName: 'Fecha de registro', flex: 1.5 },
    ];

    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState({open:false, message:''});

    const [modal, setModal] = useState(false);
    const [data, setData] = useState();
    const [clients, setClients] = useState();
    const [order, setOrder] = useState();
    const [confirm, setConfirm] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);
    const [numberCheck, setNumberCheck] = useState(initialInput);

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

    const findOrder = (id) => {
        let orderFinded = data.find(item => item._id === id);
        let details = orderFinded.details.map(item=>{
            item.seconds = {error:false, value:1};
            return item
        })
        orderFinded = {... orderFinded, details:details}
        if(orderFinded.fundsOrigin===undefined){
            orderFinded = {...orderFinded, numberCheck:{error:false, value:orderFinded.numberCheck}}
        }
        setOrder(orderFinded);
    }

    const cancelOrderHandler = async (id) => {
        setLoading(true);
        const response = await cancelOrderById(id);
        setLoading(false);
        if(response.status===202)
            enqueueSnackbar('Trabajo cancelado correctamente',{variant:'success'});            
        if(response.status===404)
            enqueueSnackbar('Trabajo no encontrado',{variant:'error'});            
        if(response.status===304)
            enqueueSnackbar('Error - Conflicto',{variant:'error'});            
    }

    const confirmOrderHandler = async() => {

        ///Validation
        let error = false;
        if(order.fundsOrigin===undefined){
            if(order.numberCheck.value===0){
                setOrder({...order, numberCheck:{error:true, value:0}})
                enqueueSnackbar('Ingresar el codigo de boleta de pago',{variant:'error'});            
                error=true
            }
        }
        const detailsAux = [...order.details];
        let errorDetails = false;
        for (let index = 0; index < detailsAux.length; index++) {
            const element = detailsAux[index];
            if(element.seconds.value<=0){
                detailsAux[index].seconds.error=true;
                errorDetails=true
            }
        }
        setOrder({...order, details:detailsAux});
        if(errorDetails){
            error = true;
            enqueueSnackbar('Revisar los valores de los detalles',{variant:'error'});            
        }

        if(!error){
            let details = order.details.map(item=>{
                return {
                    _id:item._id,
                    seconds:item.seconds.value
                }
            })
            let body={
                details:details
            }
            if(order.fundsOrigin===undefined)
                body.numberCheck= order.numberCheck.value

            setLoading(true);
            const response = await confirmOrder(order._id, body);
            handleResponse(response);
            setLoading(false);
        }
    }

    const handleResponse = async(response) => {
        const data = await response.json();
        if(response.status === 202){
            if(Object.keys(data.alert).length!==0){
                const mess = <>
                    <Typography gutterBottom>
                        LOS SIGUIENTES TRABAJOS NO FUERON CONFIRMADOS POR FALTA DE MATERIAL NECESARIO.
                    </Typography>
                    {
                        Object.keys(data.alert).map((key)=>{
                            return <Typography gutterBottom>
                                        <label>{`Trabajo: ${key}`}</label>
                                        <br/>
                                        <label>{`Falta: ${data.alert[key]}`}</label>
                                    </Typography>
                        })
                    }
                </>
                setDialog({open:true, message:mess});
            }else
                enqueueSnackbar('Trabajos confirmados correctamente',{variant:'success'});            
            loadData();
            setModal(false);
        }
        if(response.status === 304){
            enqueueSnackbar(`${(data.reason || data.message)}`,{variant:'error'});            
        }
    }

    const handleDays = (e, index) => {
        let det = [...order.details];
        det[index].seconds.value = e.target.value;
        setOrder({...order, details: [...det]});
    }

    useEffect(()=>{
        loadData()
    },[])

    return (
        data&&
            <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <BootstrapDialog
                onClose={()=>{
                    setDialog({...dialog, open:false});
                    enqueueSnackbar('Trabajos confirmados correctamente',{variant:'success'});
                }}
                open={dialog.open}
                
            >
                <DialogTitle sx={{ m: 0, p: 2, background:'black', color:'white', alignItems:'center', display:'flex' }} id="customized-dialog-title">
                    <WarningIcon sx={{ color: 'yellow', marginRight:2}} fontSize="large" />
                    <b>{`ADVERTENCIA`}</b>
                </DialogTitle>
                <IconButton
                    onClick={()=>{
                        setDialog({...dialog, open:false});
                        enqueueSnackbar('Trabajos confirmados correctamente',{variant:'success'});
                    }}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                >
                <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    {dialog.message}
                </DialogContent>
                <DialogActions>
                <Button variant="contained" autoFocus onClick={()=>{
                    setDialog({...dialog, open:false});
                    enqueueSnackbar('Trabajos confirmados correctamente',{variant:'success'});
                }}>
                    Entendido
                </Button>
                </DialogActions>
            </BootstrapDialog>

            <Grid container justifyContent='center'>
                <Grid item style={{width:'70%'}}>
                    <Card raised className={classes.confirmarPedidoContainer}>
                        <Grid container direction='column' rowSpacing={3}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Confirmar / Cancelar Pedido</h1>
                            </Grid>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item>
                                    {(data!==204)?
                                        <DataGrid 
                                            style={{width:'95%'}}
                                            onRowClick={(e)=>{
                                                setModal(prev => !prev);
                                                findOrder(e.row._id);
                                            }}
                                            rows={data} 
                                            columns={columns}
                                            getRowClassName={(params) =>
                                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                            }
                                        />
                                    :
                                        <h3 style={{textAlign:'center'}}>No existen pedidos para confirmar</h3>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            {
                order&&
                    <Dialog  onClose={()=>{setModal(prev => !prev)}} open={modal}>
                        <Card style={{overflow:'auto'}}>
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
                                    {
                                        order.numberTicketPay&&
                                        <Grid item container columnSpacing={2} alignItems='center'>
                                            <Grid item xs={4}>
                                                <label>Numero de Ticket:</label>
                                            </Grid>
                                            <Grid item xs>
                                                <TextField size='small' disabled value={order?.numberTicketPay}/>
                                            </Grid>
                                        </Grid>
                                    }
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
                                                <TextField
                                                    value={order.numberCheck.value} 
                                                    onChange={(e)=>{
                                                        setOrder({...order, numberCheck:{error:false, value:e.target.value}})
                                                    }}
                                                    error={order.numberCheck.error}
                                                    required
                                                    label='Requerido'
                                                    size="small" 
                                                />
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
                                                            type='number'
                                                            value={item.seconds.value}
                                                            onChange={e=>handleDays(e, index)}
                                                            size="small"
                                                            error={item.seconds.error}
                                                            required
                                                            label='Requerido'
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
                                                onClick={()=>{cancelOrderHandler(order._id)}}
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
        
    )
}