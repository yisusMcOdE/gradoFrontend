import { Box, Card, Grid, TextField, Button, RadioGroup, Radio,FormControlLabel, Backdrop, CircularProgress, Snackbar, Alert, Dialog, Collapse } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Main } from "../../../components/main";
import { allOrderMaterial, getOrderMaterialById } from "../../../utilities/allGetFetch";
import { cancelOrderMaterialById, confirmOrderMaterial } from "../../../utilities/allPutFetch";
import { useStyles } from "./materials.style";


export const Recepcionar = () => {

    const navigator = useNavigate('');

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});
    const [dialog, setDialog] = useState({open:false, message:''});

    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [cancel, setCancel] = useState(false);
   
    const [data, setData] = useState();
    const [order, setOrder] = useState();


    const [complete, setComplete] = useState(true);

    const classes = useStyles();

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'details', headerName: 'Detalle', flex: 2.5},
        {field: 'createdAt', headerName: 'Fecha de pedido', flex: 1},
    ]

    const handleResponse = async(response) => {
        if(response.status === 202){
            setAlert({open:true, severity:'success', message:'202: Operacion exitosa'});
            setModal(false);
            loadData();
        }
        if(response.status === 404){
            setAlert({open:true, severity:'error', message:'404: No encontrado'});
        }
        if(response.status === 409){
            setAlert({open:true, severity:'warning', message:'409: Conflicto'});
        }
        if(response.status === 304){
            setAlert({open:true, severity:'warning', message:'304: No Modificado'})
        }
    }

    const loadData = async() => {
        const response = await allOrderMaterial();
        setData(response);
        
    }

    const loadOrder = async(id) => {
        let response = await getOrderMaterialById(id);
        response.details = response.details.map(item=>{
            item.deliveredQuantity = {error:false, value:item.deliveredQuantity};
            return item
        })
        setOrder(response);
        setModal(true);
    }

    const confirmOrder = async() => {
        ///Validation
        let error = false;
        const details = order.details.map(item=>{
            console.log('validation');
            console.log(item);
            if(!complete){
                if(item.deliveredQuantity.value<=0 || item.deliveredQuantity.value > item.requiredQuantity){
                    item.deliveredQuantity.error = true;
                    error = true;
                }
            }
            return item
        })
        setOrder({...order, details:details});
        if(!error){
            const body = {
                complete: complete
            };
            body.details = order.details.map(item=>{
                return{
                    _id:item._id,
                    deliveredQuantity:item.deliveredQuantity.value
                }
            })
            setLoading(true);
            const response = await confirmOrderMaterial(order._id,body);
            setLoading(false);
            handleResponse(response);
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido * '});
        }

        
    }

    const cancelOrder = async() => {
        setLoading(true);
        const response = await cancelOrderMaterialById(order._id);
        setLoading(false);
        handleResponse(response);
    }

    console.log(order);

    useEffect(()=>{
        loadData();
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={alert.open}
                onClose={()=>{setAlert({...alert, open:false})}}
                autoHideDuration={alert.time || 3000}
            >
                <Alert variant='filled' severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Grid container direction='column' rowSpacing={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            <h1 style={{textAlign:'center'}}>Recepcionar / Cancelar</h1>
                            
                            <Grid item>
                                <DataGrid
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{loadOrder(e.row._id)}}
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
            </Grid>

            {
                order&&
                <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
                    <Card style={{overflow:'auto'}}>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <h1 style={{margin:'0', textAlign:'center'}}>Detalle de orden</h1>
                            </Grid>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container columnSpacing={2} alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Fecha de pedido</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField size='small' disabled value={order?.createdAt.slice(0,10)}/>
                                    </Grid>
                                </Grid>
                                <Grid item container columnSpacing={2} alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Fecha de recepcion</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField size='small' disabled value={new Date().toISOString().slice(0,10)}/>
                                    </Grid>
                                </Grid>
                                <Grid item container columnSpacing={2} alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Detalle de pedido</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField multiline size='small' disabled value={order.detailsResumen}/>
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                            <Grid item container justifyContent='space-evenly'>
                                <Button variant="contained" onClick={()=>{setConfirm(prev=>!prev); setCancel(false)}}> Confirmar </Button>
                                <Button variant="contained" onClick={()=>{setCancel(prev=>!prev); setConfirm(false)}}> Cancelar </Button>
                            </Grid>
                            
                            <Collapse in={confirm}>
                                <Grid item container direction='column' rowSpacing={1}>

                                    <Grid item>
                                        <Box display='flex' justifyContent= 'center' >
                                            <RadioGroup
                                                value={complete}
                                                onChange={()=>{setComplete(prev => !prev)}}
                                                row
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="Completo" />
                                                <FormControlLabel value={false} control={<Radio />} label="Parcial" />
                                            </RadioGroup>
                                        </Box>
                                    </Grid>

                                    <Grid item container>
                                        <Grid item xs={6}>
                                            <label>Material</label>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <label>Cantidad Solicitada</label>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <label>Cantidad Recibida</label>
                                        </Grid>
                                    </Grid>
                                    {
                                        order?.details.map((item, index)=>{
                                            return <Grid item container alignItems='center'>
                                                <Grid item xs={6}>
                                                    <label>{item.materialName}</label>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <label>{item.requiredQuantity}</label>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <TextField
                                                        type='number'
                                                        disabled={complete}
                                                        value={complete? item.requiredQuantity : item.deliveredQuantity.value}
                                                        onChange={(e)=>{
                                                            const details = [...order.details];
                                                            details[index].deliveredQuantity.error = false;
                                                            details[index].deliveredQuantity.value = e.target.value;
                                                            setOrder({...order, details:details}); 
                                                        }}
                                                        size="small"
                                                        error={complete ? false : item.deliveredQuantity.error}
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
                                            onClick={()=>{confirmOrder()}}
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
                                            onClick={()=>{cancelOrder()}}
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