import { IconButton, Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField, FilledInput, InputAdornment, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createJob, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { allMaterials } from "../../../utilities/allGetFetch"

export const CreateJob = () => {

    const initialInput = {error:false, value:''}
    const costInitial = {
        lot : {...initialInput},
        price : {...initialInput}
    }
    const materialInitial = {
        name : {...initialInput},
        required : {...initialInput},
        produced : {...initialInput}
    }


    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});


    const [nameForm,setNameForm] = useState({...initialInput});
    const [descriptionForm,setDescriptionForm] = useState({...initialInput});
    const [areaForm,setAreaForm] = useState({...initialInput});
    const [costDetails, setCostDetails] = useState([costInitial]);
    const [materialDetails, setMaterialDetails] = useState([materialInitial]);
    const [materials, setMaterials] = useState();

    const classes = useStyles();

    const addCost = () => {
        setCostDetails([...costDetails, costInitial]);
    }
    const addMaterial = () => {
        setMaterialDetails([...materialDetails, materialInitial]);
    }

    const removeCostByIndex = (index) => {
        const cost = [...costDetails];
        if(cost.length>1){
            cost.splice(index,1);
            setCostDetails([...cost]);
        }
    }

    const removeMaterialByIndex = (index) => {
        const material = [...materialDetails];
        if(material.length>1){
            material.splice(index, 1);
            setMaterialDetails([...material]);
        }
    }

    const removeMaterial = () => {
        const material = [...materialDetails];
        if(material.length>1){
            material.pop();
        }
        setMaterialDetails([...material]);
    }

    const clearInputs = () => {
        setNameForm(initialInput);
        setDescriptionForm(initialInput);
        setAreaForm(initialInput);
        setCostDetails([costInitial]);
        setMaterialDetails([materialInitial]);
    }

    const handleResponse = async(response) => {
        if(response.status === 201){
            setAlert({open:true, severity:'success', message:'201: Creado'});
            clearInputs();
        }
        if(response.status === 501){
            const data = await response.json();
            setAlert({open:true, severity:'warning', message: `501: ${(data.reason || data.message)}`})
        }
    }

    const handleCreateJob = async() => {
        
        ///Validation
            let error = false;

            if((nameForm.value==='')){
                setNameForm({error:true, value:''})
                error=true
            }
            if((areaForm.value==='')){
                setAreaForm({error:true, value:''})
                error=true
            }
            
            let costDetailsAux = [...costDetails];
            costDetailsAux = costDetailsAux.map(item=>{
                let itemAux = {...item}
                if(item.lot.value===''){
                    itemAux.lot.error=true
                    error=true
                }
                if(item.price.value===''){
                    itemAux.price.error=true
                    error=true
                }
                return {...itemAux}
            })
            setCostDetails([...costDetailsAux]);

            let materialDetailsAux = [...materialDetails];
            materialDetailsAux = materialDetailsAux.map(item=>{
                let itemAux = {...item}
                if(item.name.value===''){
                    itemAux.name.error=true
                    error=true
                }
                if(item.required.value===''){
                    itemAux.required.error=true
                    error=true
                }
                if(item.produced.value===''){
                    itemAux.produced.error=true
                    error=true
                }
                return {...itemAux}
            })
            setMaterialDetails([...materialDetailsAux]);

        if(!error){

            setLoading(true);

            const costFormated = costDetails.map(item=>{
                return{
                    lot:item.lot.value,
                    price:item.price.value,
                }
            })
            const materialFormated = materialDetails.map(item=>{
                return {
                    name : item.name.value,
                    required : item.required.value,
                    produced : item.produced.value
                }
            })

            const data = {
                name: nameForm.value,
                description: descriptionForm.value,
                area: areaForm.value,
                cost : costFormated,
                materials: materialFormated
            }

            const response = await createJob(data);
            setLoading(false);

            handleResponse(response);
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido * '});
        }
    }

    const handleChange = (e, typeDetail, field, index) => {

        if(typeDetail==='cost'){
            if(Number(e.target.value)>=1){
                const values = [...costDetails];
                values[index][field].value = e.target.value;
                setCostDetails([...values]);
            }
        }else{
            const values = [...materialDetails];
            if(typeDetail==='material' && field==='name'){
                const name = e.target.textContent;
                const names = materialDetails.map(item=>item.name.value);
                if(!names.includes(name))
                    values[index][field].value = name;
                else{
                    values[index][field].value = '';
                    setAlert({open:true, severity:'error', message:`${name} ya fue seleccionado`});
                }
            }else{
                if(Number(e.target.value)>=1)
                    values[index][field].value = e.target.value;
            }
            setMaterialDetails([...values]);
        }
    }

    const loadData  = async() => {
        const data = await allMaterials();
        const names = data.map(item=>item.name);
        setMaterials(names);
    }

    useEffect(()=>{loadData()},[]);

    return(
        materials&&
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
                autoHideDuration={3000}
            >
                <Alert variant='filled' severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Grid container direction={'column'} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Trabajo
                                </h1>
                            </Grid>

                            <Grid item container>
                                <Grid item xs>
                                    <Grid item container direction='column' rowSpacing={2}>
                                        <Grid item container alignItems='center'>
                                            <Grid item xs={5}>
                                                <label>Nombre del Trabajo:</label>
                                            </Grid>
                                            <Grid item xs>
                                                <TextField 
                                                    value={nameForm.value}
                                                    onChange={({target})=>{setNameForm({...nameForm, value:target.value})}}
                                                    required
                                                    error={nameForm.error}
                                                    label='Requerido'
                                                    size='small'
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item container alignItems='center'>
                                            <Grid item xs={5}>
                                                <label>Descripcion:</label>
                                            </Grid>
                                            <Grid item >
                                                <TextField
                                                    value={descriptionForm.value}
                                                    onChange={({target})=>{setDescriptionForm({...descriptionForm, value:target.value})}}
                                                    multiline
                                                    label="Opccional" 
                                                    size='small'
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item container alignItems='center'>
                                            <Grid item xs={5}>
                                                <label>Area Correspondiente:</label>
                                            </Grid>
                                            <Grid item >
                                                <Autocomplete
                                                    onChange={({target})=>{setAreaForm({...areaForm, value:target.textContent})}}
                                                    size='small'
                                                    fullWidth
                                                    options={['Impresion Digital','Empastado', 'Tipografia']}
                                                    sx={{ width: 200 }}
                                                    value={areaForm.value}
                                                    renderInput={(params) => <TextField 
                                                        label='Requerido'
                                                        required 
                                                        error={areaForm.error} 
                                                        {...params}
                                                    />}
                                                />
                                            </Grid>
                                        </Grid>
                                    
                                    </Grid>
                                </Grid>
                                <Grid item xs>
                                    <Grid container>
                                        <Grid item position='relative' display='flex' alignItems='center'>
                                            <IconButton 
                                                size="small" 
                                                onClick={addCost} 
                                                style={{background:'#006E0A', position:'absolute', left:'10px'}}
                                            >
                                                <AddIcon fontSize="inherit"/>
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs className={classes.tableHeader} style={{borderRadius:'5px 5px 0 0'}}>
                                            <h3 style={{textAlign:'center'}}>DETALLE DE COSTOS</h3>
                                        </Grid>
                                        <Grid item xs={12} className={classes.tableHeader} container>
                                            <Grid item xs={1.2}>
                                                <h3>N°</h3>
                                            </Grid>
                                            <Grid item xs>
                                                <h3>Cantidad:</h3>
                                            </Grid>
                                            <Grid item xs>
                                                <h3>Costo:</h3>
                                            </Grid>
                                        </Grid>

                                        {costDetails.map((item,index)=>{
                                            return (
                                            <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                                <Grid item xs={1} alignItems='center'>
                                                    {index+1}
                                                </Grid>
                                                <Grid item xs>
                                                    <TextField
                                                        type='number'
                                                        value={item.lot.value} 
                                                        onChange={(e)=>{handleChange(e,'cost','lot',index)}}
                                                        error={item.lot.error}
                                                        required
                                                        label='Requerido'
                                                        fullWidth
                                                        variant="standard"
                                                        size='small'
                                                    />
                                                </Grid>
                                                <Grid item xs style={{position:'relative'}}>
                                                    <TextField
                                                        type='number'
                                                        min='1'
                                                        value={item.price.value} 
                                                        onChange={(e)=>{handleChange(e,'cost','price',index)}}
                                                        error={item.price.error}
                                                        required
                                                        label='Requerido'
                                                        fullWidth
                                                        variant="standard"
                                                        size='small'
                                                    />
                                                </Grid>
                                                <div style={{position:'relative', display:'flex', alignItems:'center'}}  >
                                                    <IconButton style={{position:'absolute', right:'-15px', background:'#4B0000'}} size="small" onClick={()=>{removeCostByIndex(index)}}>
                                                        <RemoveIcon fontSize="inherit" color="neutro1"/>
                                                    </IconButton>
                                                </div>
                                            </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container>
                                    <Grid item position='relative' display='flex' alignItems='center'>
                                        <IconButton 
                                            size="small" 
                                            onClick={addMaterial} 
                                            style={{background:'#006E0A', position:'absolute', left:'10px'}}
                                        >
                                            <AddIcon fontSize="inherit"/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                        <h3 style={{textAlign:'center'}}>DETALLE DE USO DE MATERIALES</h3>
                                    </Grid>
                                    <Grid item xs={12} className={classes.tableHeader} container>
                                        <Grid item xs={1}>
                                            <h3>N°</h3>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <h3>Material:</h3>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h3>Cantidad requerida:</h3>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h3>Cantidad producida:</h3>
                                        </Grid>
                                    </Grid>

                                    {materialDetails.map((item,index)=>{
                                        return (
                                        <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1} alignItems='center'>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={3}> 
                                                <Autocomplete
                                                    onChange={(e)=>{handleChange(e,'material','name',index)}}
                                                    value={item.name.value}
                                                    size='small'
                                                    fullWidth
                                                    options={materials}
                                                    renderInput={(params) =><TextField
                                                        label='Requerido'
                                                        required
                                                        error={item.name.error}
                                                        variant="standard"
                                                        {...params}
                                                    />}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    variant="standard"
                                                    type='number'
                                                    min='1'
                                                    InputProps={{
                                                        endAdornment:
                                                            <InputAdornment position='start'>
                                                                {((materials.find(element=>element.name===item.name.value))?.unit?.concat('(s)'))||''}
                                                            </InputAdornment>
                                                      }}
                                                    value={item.required.value}
                                                    onChange={(e)=>{handleChange(e,'material','required',index)}}
                                                    required
                                                    error={item.required.error}
                                                    label='Requerido'
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    type='number'
                                                    min='1'
                                                    value={item.produced.value}
                                                    onChange={(e)=>{handleChange(e,'material','produced',index)}}
                                                    fullWidth
                                                    required
                                                    error={item.produced.error}
                                                    label='Requerido'
                                                    variant="standard"
                                                    size='small'
                                                />
                                            </Grid>
                                            <div style={{position:'relative', display:'flex', alignItems:'center'}}  >
                                                <IconButton style={{position:'absolute', right:'-15px', background:'#4B0000'}} size="small" onClick={()=>{removeMaterialByIndex(index)}}>
                                                    <RemoveIcon fontSize="inherit" color="neutro1"/>
                                                </IconButton>
                                            </div>
                                        </Grid>
                                        )
                                    })}
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{handleCreateJob()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
    </Main>
    )
}