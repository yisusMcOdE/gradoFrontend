import { Button, Card, Grid, TextField, Box, RadioGroup, FormControlLabel, Radio, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { getAllOrdersFinished } from "../../../utilities/allGetFetch";
import { finishTotalOrderById } from "../../../utilities/allPutFetch";
import { generateDeliveryCertificate } from "../../../utilities/pdfMake/deliveryCertificate";
import { useStyles } from "./pedidos.styles";

export const Entregar = () => {

    const classes = useStyles();

    const [completo, setCompleto] = useState(true);
    const [data, setData] = useState();
    const [order, setOrder] = useState();
    const [modal, setModal] = useState(false);

    console.log(order);

    const finishOrder = async () => {
        await finishTotalOrderById(order._id);
        await loadData();
        generateDeliveryCertificate(order);
    }

    const columns= [
        
        { field: 'id', headerName: 'Id de Pedido', flex: 1 },
        { field: 'client', headerName: 'Cliente', flex: 1 },
        { field: 'date', headerName: 'Fecha de registro', flex: 1.5 },
    ];

    const findOrder = () => {
        let orderFinded = data.find(item => item._id === document.getElementById('id_form').value);
        setOrder(orderFinded);
    }

    const loadData = async () => {
        const response = await getAllOrdersFinished();
        setData(response);
    }

    useEffect(()=>{
        loadData()
    },[])

    return (
        <Main>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column' rowGap={2}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Entregar Pedido</h1>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Id de Pedido</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField id='id_form' size='small'/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={3}>
                                    <label>Cliente</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField id='client_form' size='small'/>
                                </Grid>
                            </Grid>
                            {data&&<Grid item>
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
                            </Grid>}
                            <Grid item display='flex' justifyContent='center'>
                                <Button 
                                    variant="contained"
                                    onClick={()=>{
                                        setModal(prev => !prev);
                                        findOrder();
                                    }}
                                >
                                    Seleccionar pedido
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {
                    order&&
                    <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
                        <Card raiseds style={{overflow : 'auto'}}>
                            <Grid container direction='column'>
                                <Grid item container direction='column' rowGap={1}>
                                    <Grid item container columnGap={3}>
                                        <Grid item xs={3}>
                                            <label>Cliente:</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' disabled value={order.client}/>
                                        </Grid>
                                    </Grid>

                                    <Grid item container columnGap={3}>
                                        <Grid item xs={3}>
                                            <label>Fecha de entrega:</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' disabled value={new Date().toISOString().slice(0,10)}/>
                                        </Grid>
                                    </Grid>

                                    <Grid item container columnGap={3}>
                                        <Grid item xs={3}>
                                            <label>Entregado a:</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField size='small' value={order.courier || order.client}/>
                                        </Grid>
                                    </Grid>

                                    <Grid item container columnGap={3}>
                                        <Grid item xs={3}>
                                            <label>Estado de entrega</label>
                                        </Grid>
                                        <Grid item xs>
                                            <Box >
                                                <RadioGroup
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="controlled-radio-buttons-group"
                                                    value={completo}
                                                    onChange={()=>{setCompleto(prev => !prev)}}
                                                    row
                                                >
                                                    <FormControlLabel value={true} control={<Radio />} label="Completo" />
                                                    <FormControlLabel value={false} control={<Radio />} label="Parcial" />
                                                </RadioGroup>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <Grid container>
                                            <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                                <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                                            </Grid>
                                            <Grid item xs={12} className={classes.tableHeader} container>
                                                <Grid item xs={1}>
                                                    <h3>N°</h3>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <h3>Trabajo</h3>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <h3>Cant. Solicitada</h3>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <h3>Cant. Entregada</h3>
                                                </Grid>
                                            </Grid>
                                            {order.details.map((item,index)=>{
                                                return (
                                                <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                                    <Grid item xs={1}>
                                                        {index+1}
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <TextField disabled fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.job}/>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField disabled fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.requiredQuantity}/>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField disabled={completo} fullWidth multiline id="filled-basic" variant="filled" size='small' value={item.deliveredQuantity}/>
                                                    </Grid>
                                                </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Grid>

                                    <Grid item display='flex' justifyContent='center'>
                                        <Button 
                                            variant="contained"
                                            onClick={finishOrder}
                                        >
                                            Entregar / Generar Acta
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </Dialog>
                }
            </Grid>
        </Main>
        
    )
}