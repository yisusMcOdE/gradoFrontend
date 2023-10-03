import { Button, Card, Grid, TextField, Box, IconButton, Autocomplete } from "@mui/material"
import { useEffect, useState } from "react"
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { getAllEquipment, getOrderById, getStepById } from "../../../utilities/allGetFetch";
import { useParams } from "react-router-dom";
import { finishOrderById, updateOver } from "../../../utilities/allPutFetch";


export const Finalizar = () => {

    const materialInicial = {
        material: '',
        cantidad: ''
    }

    const {id} = useParams();

    const [data, setData] = useState();
    const [dataMaterial, setDataMaterial] = useState();
    const [sobrantes, setSobrantes] = useState([materialInicial]);
    const [equipment, setEquipment] = useState();

    const loadData = async() => {
        let response = await getOrderById(id);
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
        setSobrantes([...sobrantes, materialInicial])
    };

    const removeDetail = () => {
        const details = [...sobrantes];
        if(details.length>1){
            details.pop();
        }
        setSobrantes([...details]);
    }

    const handleChange = (e, field, index) => {
        const details = [...sobrantes];
        if(field==='material'){
            const idMaterial = dataMaterial.find(item=>item.name===e?.target?.textContent).idMaterial;
            details[index][field] = e?.target?.textContent;
            details[index]['id'] = idMaterial;

        }else{
            details[index][field] = e?.target?.value;
        }

        setSobrantes(details)
    }
    const finishOrder = async () => {

        
        ///await getStepById(data._id);

        const deliveredQuantity = document.getElementById('quantityForm').value;
        const equipment = document.getElementById('equipmentForm')?.value;


        if(data.jobDetails.area==='Impresion'){
            ///finishOrderById(data._id,{deliveredQuantity, equipment});
        }
        else{
            ///finishOrderById(data._id,{deliveredQuantity});
        }
        
        const resultado = (sobrantes.filter(item=>{
            if(item.material==='' || item.cantidad==='')
                return false
            else
                return true
        }))
        console.log(resultado);
        updateOver(resultado);
    }

    const classes = useStyles();
    return (
        data&&
        <Main>
            <Grid container justifyContent='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Finalizar Trabajo</h1>
                            </Grid>
                            <Grid container item direction='column' rowSpacing={1}>
                                <Grid item container  alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Trabajo:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField disabled value={data.job} size='small'/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Detalle:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField disabled value={data.detail} size='small'/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={2}>
                                        <label>Cantidad Entregada:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <TextField id='quantityForm' defaultValue={data.requiredQuantity} size='small'/>
                                    </Grid>
                                </Grid>
                                {
                                    data.jobDetails.area === 'Impresion'&&
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={2}>
                                            <label>Equipo Utilizado:</label>
                                        </Grid>
                                        <Grid item xs>
                                            <Autocomplete
                                                id="equipmentForm"
                                                options={equipment?.map(item=>item.name)}
                                                size='small'
                                                disablePortal
                                                renderInput={(params) => <TextField {...params}/>}
                                            />
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                            <Grid item container direction='column' rowSpacing={2}>
                                <Grid item>
                                    <h2 className={classes.titlePage}>Registro de material sobrante</h2>
                                </Grid>
                                <Grid item>
                                    <Grid container>
                                        <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                            <h3 style={{textAlign:'center'}}>REGISTRO DE MATERIAL SOBRANTE</h3>
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
                                            <Grid item xs={7}>
                                                <h3>Material</h3>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <h3>Cantidad</h3>
                                            </Grid>
                                        </Grid>

                                        {sobrantes.map((item,index)=>{
                                            return (
                                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                                <Grid item xs={1}>
                                                    {index+1}
                                                </Grid>
                                                <Grid item xs={7}> 
                                                    <Autocomplete
                                                    value={sobrantes[index].material}
                                                    onChange={(e)=>{
                                                        handleChange(e,'material',index)
                                                    }}
                                                    options={dataMaterial.map(item=>{return item.name})}
                                                    size='small'
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    fullWidth
                                                    renderInput={(params) => <TextField {...params}/>}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField 
                                                        fullWidth 
                                                        variant="filled" 
                                                        size='small' 
                                                        onChange={(e)=>{handleChange(e,'cantidad',index)}}
                                                        value={sobrantes[index].cantidad}
                                                    />
                                                </Grid>
                                            </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
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
                </Grid>
            </Grid>
            
        </Main>
    )
}