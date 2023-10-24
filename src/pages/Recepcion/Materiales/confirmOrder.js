import { Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { useStyles } from "./materials.style";
import moment from "moment";
import { getOrderMaterialById } from "../../../utilities/allGetFetch";



export const ConfirmOrder = () => {

    const {id} = useParams();

    const [data, setData] = useState();
    const [complete, setComplete] = useState(true);
    const [detailsEdit, setDetailsEdit] = useState();

    const loadData = async () => {
        const response = await getOrderMaterialById(id);
        setData(response);
        setDetailsEdit(response.details)
    }

    const confirmOrder = async() => {

    }

    useEffect(()=>{
        loadData()
    },[])

    const classes = useStyles();
    return (data&&
        <Main>
            <Grid container direction='column' rowSpacing={3} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column'>
                            <h1 style={{textAlign:'center'}}>Confirmar Pedido</h1>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container>
                                    <Grid item xs={4}>
                                        <label>Fecha de solicitud:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField value={data.createdAt.slice(0,10)} size='small'/>
                                    </Grid>
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={4}>
                                        <label>Fecha de entrega:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            value={`${moment().format('YYYY-MM-DD')}`}
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
                                                <FormControlLabel value={true} control={<Radio />} label="Completo" />
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
                                                    <h3>Cant. Recibida</h3>
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
                </Grid>
            </Grid>
        </Main>
    )
}