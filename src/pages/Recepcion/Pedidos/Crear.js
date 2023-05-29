import { Card, Grid, Autocomplete, TextField, Box, RadioGroup, FormControlLabel, Radio, IconButton, Button } from "@mui/material";
import { useStyles } from "./pedidos.styles";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { allClientsExternal, allClientsInternal, allJobs } from "../../../utilities/allGetFetch";
import { createOrderExternal, createOrderInternal } from "../../../utilities/allPostFetch";
import { useNavigate } from "react-router-dom";

export const Crear = () => {

    const navigator = useNavigate();

    const detalleInicial = {
        job: '',
        detail: '',
        requiredQuantity: 0,
        cost: 0
    }

    const [tipo, setTipo] = useState(true);
    const [details, setDetails] = useState([detalleInicial]);


    const [externos, setExternos] = useState();
    const [internos, setInternos] = useState();
    const [trabajos, setTrabajos] = useState();

    const classes = useStyles();

    const addDetail = () => {
        setDetails([...details, detalleInicial]);
    }

    const removeDetail = () => {
        const auxDetails = [...details];
        if(auxDetails.length>1){
            auxDetails.pop();
        }
        setDetails([...auxDetails]);
    }

    const loadData = async() => {
        let data = await allClientsInternal();
        setInternos(data.map(item=>item.institution));
        data = await allClientsExternal();
        setExternos(data.map(item=>item.name));
        data = await allJobs();
        setTrabajos(data);
    }

    const handleChange = (e, field, index) => {

        const values = [...details];
        if(field==='job'){
            values[index][field] = e?.target?.textContent;
            ///const idMaterial = materials.find(item=>item.name===e?.target?.textContent)?._id;
            ///values[index].idMaterial = idMaterial;
        }else{
            values[index][field] = e?.target?.value;
        }

        if(field==='job' || field==='requiredQuantity'){
            const costo = calcCost(values[index].job, values[index].requiredQuantity);
            console.log(costo);
            values[index]['cost'] = costo;
            console.log(values);
        }
        setDetails([...values]);

    }

    const calcCost = (nameJob, require=0) => {
        const job = trabajos.find(item=>item.name===nameJob);
        if(job){
            const costos = job.cost;
            let costoTotal = 0;
            for (let index = costos.length-1; index >= 0; index--) {
                while(require >= costos[index].lot){
                    costoTotal += costos[index].price;
                    require -= costos[index].lot;
                }
            }
            return costoTotal;
        }else{
            return 0;
        }
        
    }

    const createOrder = () => {
        let body={}
        if(tipo){
            body ={
                "institution":document.getElementById('institutionForm').value,
                "date":"01-01-2023",
                "cost": details.reduce((accumulator, item)=>{return (accumulator+item.cost)},0),
                "details":details
            }
            console.log(body);
            createOrderInternal(body);
        }else{
            body = {
                "name":document.getElementById('nameForm').value,
                "date":'01-01-2023',
                "cost": details.reduce((accumulator, item)=>{return (accumulator+item.cost)},0),
                "details":details
            }
           
            createOrderExternal(body);
        }
        navigator('/recepcion/pedidos');
    }


    useEffect(()=>{
        loadData();
    },[])

    return (
        <Grid container direction="column" justifyContent="center">
            <Grid item xs={12} className={classes.areaContainer}>
                <Card raised className={classes.nuevoPedidoContainer}>
                    <Grid container direction='column' spacing={3}>
                        <Grid item>
                            <h1 className={classes.titlePage}>Nuevo Pedido</h1>
                        </Grid>
                        <Grid item>
                            <Box display='flex' justifyContent= 'center' >
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={tipo}
                                    onChange={()=>{setTipo(prev => !prev)}}
                                    row
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Pedido Interno" />
                                    <FormControlLabel value={false} control={<Radio />} label="Pedido Externo" />
                                </RadioGroup>
                            </Box>
                        </Grid>
                        {tipo&&<Grid item display='flex' alignItems='center' columnGap={1}>
                            <label>Institucion:</label>
                            <Autocomplete
                            size='small'
                            id="institutionForm"
                            options={internos}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params}/>}
                            />
                        </Grid>}
                        {!tipo&&<Grid item display='flex' alignItems='center' columnGap={1}>
                            <label>Nombre:</label>
                            <Autocomplete
                            size='small'
                            id="nameForm"
                            options={externos}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params}/>}
                            />
                        </Grid>}
                        <Grid item>
                            {
                                trabajos&&<Grid container>

                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                        <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                                    </Grid>
                    
                                    <Box display='flex' className={classes.addRemoveBox} columnGap={2}>
                                        <IconButton size="small" onClick={addDetail}>
                                            <AddIcon fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton size="small" onClick={removeDetail}>
                                            <RemoveIcon fontSize="inherit"/>
                                        </IconButton>
                                    </Box>
                    
                                    <Grid item xs={12} className={classes.tableHeader} container>
                                        <Grid item xs={1}>
                                            <h3>N°</h3>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <h3>Trabajo</h3>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <h3>Detalle</h3>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <h3>Cantidad</h3>
                                        </Grid>
                                        <Grid item xs={1.5}>
                                            <h3>Costo</h3>
                                        </Grid>
                                    </Grid>
                    
                                    {details.map((item,index)=>{
                                        return (
                                        <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1}>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={3}> 
                                                <Autocomplete
                                                size='small'
                                                fullWidth
                                                options={trabajos.map(element=>element.name).concat([""])}
                                                renderInput={(params) => <TextField variant="filled" {...params}/>}
                                                onChange={(e)=>{handleChange(e,'job',index)}}
                                                value={item.job || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField 
                                                    
                                                    fullWidth 
                                                    multiline 
                                                    variant="filled" 
                                                    size='small'
                                                    value={item.detail}
                                                    onChange={(e)=>{handleChange(e,'detail',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <TextField 
                                                    type='number'
                                                    defaultValue={0}
                                                    id={`detailQuantity${index}`} 
                                                    fullWidth variant="filled" 
                                                    size='small' 
                                                    value={item.quantity}
                                                    onChange={(e)=>{handleChange(e,'requiredQuantity',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <TextField 
                                                    type='number'
                                                    fullWidth 
                                                    id={`detailCost${index}`}
                                                    variant="filled" 
                                                    size='small' 
                                                    value={item.cost}
                                                    onChange={(e)=>{handleChange(e,'cost',index)}}
                                                />
                                            </Grid>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            }
                        </Grid>
                        <Grid item display='flex' alignItems='center' columnGap={1}>
                            <label>Fecha de Entrega:</label>
                            <TextField size='small' value='01/01/2023' disabled/>
                        </Grid>
                        <Grid item display='flex' justifyContent='center'>
                            <Button onClick={()=>{createOrder()}}>Generar Pedido</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}