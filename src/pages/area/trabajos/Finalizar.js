import { Button, Card, Grid, TextField, Box, IconButton, Autocomplete, RadioGroup, FormControlLabel, Radio } from "@mui/material"
import { useEffect, useState } from "react"
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getAllEquipment, getOrderFinishedById, addStepById } from "../../../utilities/allGetFetch";
import { useParams } from "react-router-dom";
import { finishOrderById, updateOver } from "../../../utilities/allPutFetch";
import { useSnackbar } from "notistack";


export const Finalizar = ({id, close, load}) => {

    const materialInicial = {
        material: {error:false, value:''},
        cantidad: {error:false, value:0}
    }

    
    const { enqueueSnackbar } = useSnackbar();


    const [complete, setComplete] = useState(true);
    const [sobrantes, setSobrantes] = useState(false);
    const [data, setData] = useState();
    const [dataMaterial, setDataMaterial] = useState();
    const [deliveredForm, setDeliveredForm] = useState({error:false, value:''});
    const [equipmentForm, setEquipmentForm] = useState({error:false, value:''});
    const [dataSobrante, setDataSobrante] = useState([materialInicial]);
    const [equipment, setEquipment] = useState();

    const loadData = async() => {
        let response = await getOrderFinishedById(id);
        setDeliveredForm({error:false, value:response[0].requiredQuantity});
        setData(response[0]);
        setDataMaterial([...response[0].jobDetails.materials]);

        response = await getAllEquipment();
        setEquipment(response);
    }

    console.log(data);

    useEffect(()=>{
        loadData();
    },[])

    const addDetail = () => {
        setDataSobrante([...dataSobrante, materialInicial])
    }

    const removeDetailByIndex = (index) => {
        const details = [...dataSobrante];
        if(details.length>1){
            details.splice(index,1);
            setDataSobrante([...details]);
        }
    }

    const handleChange = (e, field, index) => {
        const details = [...dataSobrante];
        if(field==='material'){
            const name = e.target.textContent;
            if(!details.map(item=>item.material.value).includes(name)){
                const idMaterial = dataMaterial.find(item=>item.name===name).idMaterial;
                details[index][field].value = name;
                details[index]['id'] = idMaterial;
            }else{
                enqueueSnackbar('Material ya seleccionado',{variant:'warning'});            
            }
        }else{
            details[index][field].value = e?.target?.value;
        }

        setDataSobrante(details)
    }


    const finishOrder = async () => {
        ///Validation
        let error = false
        if(!complete){
            if(deliveredForm.value<=0 || deliveredForm.value>data.requiredQuantity){
                enqueueSnackbar('Valor de cantidad entregada invalido',{variant:'error'});
                setDeliveredForm({error:true, value:deliveredForm.value});          
                error=true;
            }
        }
        if(data.jobDetails.area==='Impresion Digital'){
            if(equipmentForm.value === ''){
                enqueueSnackbar('Equipo utilizado invalido',{variant:'error'});
                setEquipmentForm({error:true, value:''});          
                error=true;
            }
        }
        if(sobrantes){
            let details = [...dataSobrante];
            let errordetails = false
            details = details.map(item => {
                if(item.material.value===''){
                    item.material.error=true;
                    errordetails=true;
                }
                if(item.cantidad.value<=0){
                    item.cantidad.error=true;
                    errordetails=true;
                }
                return item
            })
            setDataSobrante([...details]);
            if(errordetails){
                enqueueSnackbar('Error en materiales sobrantes',{variant:'error'});
                error=true
            }
        }
        


        if(!error){
            let response
            if(data.jobDetails.area==='Impresion Digital'){

                response = await finishOrderById(
                    data._id,
                    {
                        deliveredQuantity:deliveredForm.value, 
                        equipment:equipmentForm.value
                    });
                handleResponse(response);
            }
            else{
                response = await finishOrderById(
                    data._id,
                    {deliveredQuantity:deliveredForm.value});
                handleResponse(response);
            }
            
            const resultado = (dataSobrante.map(item=>{
                item.material = item.material.value;
                item.cantidad = item.cantidad.value;
                return item
            }))
            updateOver(resultado);
        }
    }

    const handleResponse = (response) => {
        if(response.status===202){
            enqueueSnackbar('Trabajo finalizado con exito',{variant:'success'});
            close();
            load();
            
        }else{
            enqueueSnackbar('Error: No finalizado',{variant:'error'});
            
        }
    }

    const classes = useStyles();
    return (
        data&&
        <Card style={{overflow:'auto'}}>
            <Grid container direction='column' rowSpacing={3}>
                <Grid item>
                    <h1 className={classes.titlePage}>Finalizar Trabajo</h1>
                </Grid>
                <Grid container item direction='column' rowSpacing={1}>
                    <Grid item container  alignItems='center'>
                        <Grid item xs={4}>
                            <label>Trabajo:</label>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled value={data.job} size='small'/>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Detalle:</label>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled value={data.detail} size='small'/>
                        </Grid>
                    </Grid>
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Cantidad Solicitada:</label>
                        </Grid>
                        <Grid item xs>
                            <TextField disabled value={data.requiredQuantity} size='small'/>
                        </Grid>
                    </Grid>
                    <Grid item container >
                        <Grid item xs={4}>
                            <label>Cantidad Entregada:</label>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                type='number'
                                error={deliveredForm.error}
                                required
                                label='Requerido'
                                disabled={complete}
                                id='quantityForm' 
                                value={complete ? data.requiredQuantity : deliveredForm.value}
                                onChange={(e)=>{setDeliveredForm({error:false, value:e.target.value})}}
                                size='small'
                            />
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={complete}
                                onChange={()=>{setComplete(prev => !prev)}}
                                row
                            >
                                <FormControlLabel value={true} control={<Radio/>} label="Completo" />
                                <FormControlLabel value={false} control={<Radio/>} label="Parcial" />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                    
                    {
                        data.jobDetails.area === 'Impresion Digital'&&
                        <Grid item container alignItems='center'>
                            <Grid item xs={4}>
                                <label>Equipo Utilizado:</label>
                            </Grid>
                            <Grid item xs>
                                {equipment&&
                                <Autocomplete
                                    defaultValue={equipmentForm.value}
                                    onChange={(e)=>{
                                        setEquipmentForm({error:false, value:e.target.textContent})
                                    }}
                                    options={equipment.map(item=>item.name)}
                                    size='small'
                                    renderInput={(params) => <TextField
                                        error={equipmentForm.error}
                                        required
                                        label='Requerido'
                                        {...params}
                                    />}
                                />}
                            </Grid>
                        </Grid>
                    }
                    <Grid item container alignItems='center'>
                        <Grid item xs={4}>
                            <label>Materiales Sobrante:</label>
                        </Grid>
                        <Grid item xs>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={sobrantes}
                                onChange={()=>{setSobrantes(prev => !prev)}}
                                row
                            >
                                <FormControlLabel value={true} control={<Radio/>} label="Si" />
                                <FormControlLabel value={false} control={<Radio/>} label="No" />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container direction='column' rowSpacing={2}>
                    
                    {sobrantes&&
                    <Grid item>
                        <Grid container direction='column'>
                            <Grid item position='relative' display='flex' alignItems='center'>
                                <IconButton 
                                    size="small" 
                                    onClick={addDetail} 
                                    style={{background:'#006E0A', position:'absolute', left:'10px'}}
                                >
                                    <AddIcon fontSize="inherit"/>
                                </IconButton>
                            </Grid>

                            <Grid item  className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
                                <h3 style={{textAlign:'center'}}>REGISTRO DE MATERIAL SOBRANTE</h3>
                            </Grid>

                            <Grid item  className={classes.tableHeader} container>
                                <Grid item xs={2}>
                                    <h3 style={{textAlign:'center'}}>N°</h3>
                                </Grid>
                                <Grid item xs={7}>
                                    <h3 style={{textAlign:'center'}}>Material</h3>
                                </Grid>
                                <Grid item xs={3}>
                                    <h3 style={{textAlign:'center'}}>Cantidad</h3>
                                </Grid>
                            </Grid>

                            {dataSobrante.map((item,index)=>{
                                return (
                                <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                    <Grid item xs={2}>
                                        {index+1}
                                    </Grid>
                                    <Grid item xs={7}> 
                                        <Autocomplete
                                        value={dataSobrante[index].material.value}
                                        onChange={(e)=>{
                                            handleChange(e,'material',index)
                                        }}
                                        options={dataMaterial.map(item=>{return item.name})}
                                        size='small'
                                        fullWidth
                                        renderInput={(params) => <TextField
                                            error={dataSobrante[index].material.error}
                                            required
                                            label='Requerido' 
                                            {...params}
                                        />}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            type='number'
                                            error={dataSobrante[index].cantidad.error}
                                            required
                                            label='Requerido'
                                            fullWidth 
                                            variant="filled" 
                                            size='small' 
                                            onChange={(e)=>{handleChange(e,'cantidad',index)}}
                                            value={dataSobrante[index].cantidad.value}
                                        />
                                    </Grid>
                                    <div style={{position:'relative', display:'flex', alignItems:'center'}}  >
                                        <IconButton style={{position:'absolute', right:'-15px', background:'#4B0000'}} size="small" onClick={()=>{removeDetailByIndex(index)}}>
                                            <RemoveIcon fontSize="inherit" color="neutro1"/>
                                        </IconButton>
                                    </div>
                                </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                    }
                    <Grid item justifyContent='center' display='flex'>
                        <Button
                            variant="contained"
                            onClick={finishOrder}
                        >
                            Finalizar
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}