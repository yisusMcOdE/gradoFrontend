import { Box, Card, Grid, TextField, Button, RadioGroup, Radio,FormControlLabel } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { allOrderMaterial } from "../../../utilities/allGetFetch";
import { confirmOrderMaterial } from "../../../utilities/allPutFetch";
import { useStyles } from "./materials.style";


export const Recepcionar = () => {

    const pedido = require('../../../__mock__/pedido_listo.json');
    
    const [allOrders, setAllOrders] = useState();
    const [listOrders, setlistOrders] = useState();
    const [order, setOrder] = useState();
    const [detailsEdit, setDetailsEdit] = useState();


    const [complete, setComplete] = useState(true);

    const classes = useStyles();

    const columns = [
        {field: 'index', headerName: 'N°', flex: 0.5},
        {field: 'id', headerName: 'Id de Pedido', flex: 1},
        {field: 'details', headerName: 'Detalle', flex: 2.5},
        {field: 'orderDate', headerName: 'Fecha de pedido', flex: 1},
    ]

    const loadData = async() => {
        const response = await allOrderMaterial();
        setAllOrders(response);
        let final = response.map(item=>{
            console.log(item);
            const objeto = {};
            objeto.statusDelivered = item.statusDelivered;
            objeto.index = item.index;
            objeto.id = item.id;
            let detalle = '';
            item.details.map(item=>{
                detalle += ` ${item.material.name} ${item.requiredQuantity} ${item.material.unit},`
            });
            detalle = detalle.slice(0, -1);
            objeto.details = detalle;
            objeto.orderDate = item.createdAt.slice(0,10);
            objeto._id = item._id;
            return objeto
        });

        console.log(final)

        final = final.filter(item=>{return (item.statusDelivered===false)})

        setlistOrders(final);
    }

    const loadOrder = async(id) => {
        let order;
        if(id){
            document.getElementById('idForm').value=id.slice(17)
            order = allOrders.find(item=>item._id===id)
        }else{
            const idShort = document.getElementById('idForm').value;
            order = allOrders.find(item=>item.id===idShort);
        }
        if (order) {
            console.log(order);
            setOrder(order);
            setDetailsEdit([...order.details]);
        }

    }

    const confirmOrder = () => {
        const body = {};

        if(complete){
            body.complete = true
        }else{
            body.complete = false;
            body.details = detailsEdit.map(item=>{
                return{
                    _id:item._id,
                    deliveredQuantity:item.deliveredQuantity
                }
            })
        }
        confirmOrderMaterial(order._id,body);
        console.log(order._id);
        console.log(body);
    }

    useEffect(()=>{
        loadData();
    },[])

    return (
        listOrders&&
        <Main>
            <Grid container direction='column' rowSpacing={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            <h1 style={{textAlign:'center'}}>Recepcionar Material</h1>
                            <Grid item container columnGap={3} alignItems='center'>
                                <label>Id de pedido:</label>
                                <TextField id="idForm" size='small'/>
                            </Grid>
                            <Grid item>
                                <DataGrid
                                    style={{width:'99%'}}
                                    onRowClick={(e)=>{loadOrder(e.row._id)}}
                                    rows={listOrders} 
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                />
                            </Grid>
                            <Grid item display='flex' justifyContent='center'>
                                <Button variant="contained" onClick={()=>{loadOrder()}}>Buscar</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                {order&&
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column'>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container>
                                    <Grid item xs={4}>
                                        <label>Fecha de solicitud:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField value={order.createdAt.slice(0,10)} size='small'/>
                                    </Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={4}>
                                        <label>Fecha de entrega:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            value={`${moment().format('YYYY/MM/DD')}`}
                                            disabled
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container rowSpacing={3}>
                                    <Grid item xs={4}>
                                        <label>Estado de entrega</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Box >
                                            <RadioGroup
                                                aria-labelledby="demo-controlled-radio-buttons-group"
                                                name="controlled-radio-buttons-group"
                                                value={complete}
                                                onChange={()=>{setComplete(prev => !prev)}}
                                                row
                                            >
                                                <FormControlLabel value={true} control={<Radio />} label="Complete" />
                                                <FormControlLabel value={false} control={<Radio />} label="Parcial" />
                                            </RadioGroup>
                                        </Box>
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
                                                    <h3>Material</h3>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <h3>Cant. Solicitada</h3>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <h3>Cant. Entregada</h3>
                                                </Grid>
                                            </Grid>
                                            {detailsEdit.map((item,index)=>{
                                                return (
                                                <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                                    <Grid item xs={1}>
                                                        {index+1}
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <TextField 
                                                            disabled 
                                                            fullWidth 
                                                            multiline 
                                                            variant="filled" 
                                                            size='small' 
                                                            value={item.material.name}/>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField 
                                                            disabled 
                                                            fullWidth 
                                                            multiline 
                                                            variant="filled" 
                                                            size='small' 
                                                            value={item.requiredQuantity}/>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <TextField 
                                                            disabled={complete} 
                                                            fullWidth 
                                                            multiline 
                                                            variant="filled" 
                                                            size='small' 
                                                            value={
                                                                complete? item.requiredQuantity : item.deliveredQuantity
                                                            }
                                                            onChange={(e)=>{
                                                                const details = [...detailsEdit];
                                                                details[index].deliveredQuantity = e.target.value;
                                                                setDetailsEdit(details); 
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                            <Button variant="contained" onClick={()=>{confirmOrder()}}>Confirmar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>}
            </Grid>
        </Main>
    )
}