import { Card, Grid, Autocomplete, TextField, Box, RadioGroup, FormControlLabel, Radio, IconButton, Button, Snackbar, Alert, Backdrop, CircularProgress, DialogTitle, DialogContent, Typography, DialogActions, Dialog } from "@mui/material";
import { useStyles } from "./pedidos.styles";
import { useDebugValue, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WarningIcon from '@mui/icons-material/Warning';
import { allClientsExternal, allClientsExternalActive, allClientsInternal, allClientsInternalActive, allJobs, allJobsActive } from "../../../utilities/allGetFetch";
import { createOrderExternal, createOrderInternal } from "../../../utilities/allPostFetch";
import { useNavigate } from "react-router-dom";
import { Main } from "../../../components/main";
import { generateTicketPay } from "../../../utilities/pdfMake/checkPay";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        background:'black',
        padding: theme.spacing(1),
    },
  }));

export const Crear = () => {

    const initialInput = {error:false, value:''}

    const detalleInicial = {
        job: {...initialInput},
        detail: {...initialInput},
        requiredQuantity: {error:false, value:0},
        cost: {error:false, value:0}
    }

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});
    const [dialog, setDialog] = useState({open:false, message:''});


    const [institution, setInstitution] = useState(true);
    const [details, setDetails] = useState([detalleInicial]);
    const [client, setClient] = useState(initialInput);
    const [ci, setCi] = useState(initialInput);
    const [funds, setFunds] = useState(initialInput);


    const [externals, setExternals] = useState();
    const [institutions, setInstitutions] = useState();
    const [jobs, setJobs] = useState();

    const classes = useStyles();

    const addDetail = () => {
        setDetails([...details, detalleInicial]);
    }

    const removeDetailByIndex = (index) => {
        const auxDetails = [...details];
        if(auxDetails.length>1){
            auxDetails.splice(index,1);
            setDetails([...auxDetails]);
        }
    }

    const loadData = async() => {
        let data = await allClientsInternalActive();
        setInstitutions(data.map(item=>item.institution));
        data = await allClientsExternalActive();
        setExternals(data.map(item=>{return{name: item.name, ci: item.ci}}));
        data = await allJobsActive();
        setJobs(data);
    }

    const handleChange = (e, field, index) => {

        const values = [...details];
        if(field==='job'){
            values[index][field].value = e?.target?.textContent;
            
        }else{
            values[index][field].value = e?.target?.value;
        }

        if(field==='job' || field==='requiredQuantity'){
            const costo = calcCost(values[index].job.value, values[index].requiredQuantity.value);
            values[index]['cost'].value = costo;
        }
        setDetails([...values]);
    }

    const calcCost = (nameJob, require=0) => {
        const job = jobs.find(item=>item.name===nameJob);
        if(job){
            const costos = job.cost;
            let costoTotal = 0;
            for (let index = costos.length-1; index >= 0; index--) {
                while(require >= costos[index].lot){
                    costoTotal += costos[index].price;
                    require -= costos[index].lot;
                }
            }
            return Number(Number(costoTotal).toFixed(2));
        }else{
            return 0;
        }
        
    }

    const createOrder = async() => {

        ///Validation
        let error = false;

        if(client.value===''){
            setClient({error:true, value:''})
            error = true
        }
        if(ci.value==='' && !institution){
            setCi({error:true, value:''})
            error = true
        }
        if(funds.value==='' && institution){
            setFunds({error:true, value:''})
            error = true
        }
        let detailsAux = [...details];
        detailsAux = detailsAux.map(item=>{

            if(item.job.value===''){
                item.job.error = true
                error = true
            }
            if(item.requiredQuantity.value==='' || item.requiredQuantity.value===0){
                item.requiredQuantity.error = true
                error = true
            }
            if(item.cost.value==='' || item.cost.value===0){
                item.cost.error = true
                error = true
            }
            return item
        })

        if(!error){
            const detailsFormated = details.map(item=>{
                return {
                    job: item.job.value,
                    detail: item.detail.value,
                    requiredQuantity: item.requiredQuantity.value,
                    cost: item.cost.value
                }
            });
            let body={
                client:client.value,
                details:detailsFormated,
                cost: details.reduce((accumulator, item)=>{return (accumulator+item.cost.value)},0),

            }
            if(institution){
                body.fundsOrigin=funds.value;
                setLoading(true);
                const response = await createOrderInternal(body);
                setLoading(false);
                handleResponse(response);

            }else{
                body.ci=ci.value;
                setLoading(true);
                const response = await createOrderExternal(body);
                handleResponse(response);
                setLoading(false);
                generateTicketPay(response, detailsFormated);
            }
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido * '});
        }
    }
    
    const handleResponse = async(response) => {
        const data = await response.json();
        if(response.status === 201){
            if(Object.keys(data.alert).length!==0){
                const mess = <>
                    <Typography gutterBottom>
                        LOS SIGUIENTES TRABAJOS NO PODRAN PASAR A SER CONFIRMADOS POR FALTA DE MATERIAL NECESARIO.
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
                setAlert({open:true, severity:'success', message:'201: Pedido creado existosamente'});

            clearInputs();
        }
        if(response.status === 501){
            setAlert({open:true, severity:'warning', message: `501: ${(data.reason || data.message)}`})
        }
    }

    const clearInputs = () => {
        setDetails([detalleInicial]);
        setClient(initialInput);
        setCi(initialInput);
        setFunds(initialInput);
    }

    useEffect(()=>{
        loadData();
    },[])

    useEffect(()=>{
        setCi(initialInput);
        setClient(initialInput);
        setFunds(initialInput);
    },[institution])

    return (
        (institutions&&externals&&jobs)&&
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

            <BootstrapDialog
                onClose={()=>{
                    setDialog({...dialog, open:false});
                    setAlert({open:true, severity:'success', message:'201: Pedido creado existosamente'});
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
                        setAlert({open:true, severity:'success', message:'201: Pedido creado existosamente'});
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
                    setAlert({open:true, severity:'success', message:'201: Pedido creado existosamente'});
                }}>
                    Entendido
                </Button>
                </DialogActions>
            </BootstrapDialog>

            <Grid container justifyContent='center'>
                <Grid item style={{width:'80%'}}>
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
                                        value={institution}
                                        onChange={()=>{setInstitution(prev => !prev)}}
                                        row
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Institucion Universitaria" />
                                        <FormControlLabel value={false} control={<Radio />} label="Cliente Externo" />
                                    </RadioGroup>
                                </Box>
                            </Grid>
                            {institution?<>
                                <Grid item display='flex' alignItems='center' columnGap={1}>
                                    <label>Institucion:</label>
                                    <Autocomplete
                                        size='small'
                                        options={institutions.concat([''])}
                                        value={client.value}
                                        onChange={(e)=>{
                                            setClient({error:false, value:e.target.textContent})
                                        }}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField
                                            error={client.error}
                                            required
                                            label='Requerido'
                                            {...params}
                                        />}
                                    />
                                </Grid>
                                <Grid item display='flex' alignItems='center' columnGap={1}>
                                    <label>Origen de Fondos:</label>
                                    <Autocomplete
                                        value={funds.value}
                                        onChange={(e)=>{
                                            setFunds({error:false, value:e.target.textContent})
                                        }}
                                        size='small'
                                        options={['Institucionales', 'Propios']}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField 
                                            error={funds.error}
                                            required
                                            label='Requerido'
                                            {...params}
                                        />}
                                    />
                                </Grid>
                            </>:<>
                                <Grid item display='flex' alignItems='center' columnGap={1}>
                                    <label>CI:</label>
                                    <Autocomplete
                                        size='small'
                                        options={externals.map(item=>item.ci)}
                                        value={ci.value}
                                        onChange={(e)=>{
                                            const value = externals.find(item=>item.ci===e.target.textContent)
                                            setCi({error:false, value:value.ci})
                                            setClient({error:false, value:value.name})
                                        }}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField
                                            error={client.error}
                                            required
                                            label='Requerido'
                                            {...params}
                                        />}
                                    />
                                </Grid>
                                <Grid item display='flex' alignItems='center' columnGap={1}>
                                    <label>Nombre:</label>
                                    <TextField
                                        disabled
                                        sx={{ width: 300 }}
                                        value={client.value}
                                        error={client.error}
                                        required
                                        label='Requerido'
                                    />
                                </Grid>
                            </>
                            }
                            <Grid item>
                                <Grid container>
                                    <Grid item position='relative' display='flex' alignItems='center'>
                                        <IconButton 
                                            size="small" 
                                            onClick={addDetail} 
                                            style={{background:'#006E0A', position:'absolute', left:'10px'}}
                                        >
                                            <AddIcon fontSize="inherit"/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                                        <h3 style={{textAlign:'center'}}>DETALLE DE PEDIDO</h3>
                                    </Grid>
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
                                        <Grid key={index} container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                                            <Grid item xs={1}>
                                                {index+1}
                                            </Grid>
                                            <Grid item xs={3}> 
                                                <Autocomplete
                                                    size='small'
                                                    fullWidth
                                                    options={jobs.map(element=>element.name).concat([""])}
                                                    renderInput={(params) => <TextField
                                                        error={item.job.error}
                                                        required
                                                        label='Requerido'
                                                        variant="standard"
                                                        {...params}
                                                    />}
                                                    onChange={(e)=>{handleChange(e,'job',index)}}
                                                    value={item.job.value || ''}
                                                />
                                            </Grid>
                                            <Grid item xs={5}>
                                                <TextField
                                                    label='Opccional'
                                                    fullWidth 
                                                    multiline 
                                                    variant="standard"
                                                    size='small'
                                                    value={item.detail.value}
                                                    onChange={(e)=>{handleChange(e,'detail',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <TextField
                                                    error={item.requiredQuantity.error}
                                                    required
                                                    label='Requerido'
                                                    type='number'
                                                    fullWidth 
                                                    variant="standard"
                                                    size='small' 
                                                    value={item.requiredQuantity.value}
                                                    onChange={(e)=>{handleChange(e,'requiredQuantity',index)}}
                                                />
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <TextField 
                                                    error={item.cost.error}
                                                    required
                                                    label='Requerido'
                                                    type='number'
                                                    fullWidth 
                                                    variant="standard"
                                                    size='id' 
                                                    value={item.cost.value}
                                                    onChange={(e)=>{handleChange(e,'cost',index)}}
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
                            
                            <Grid item display='flex' justifyContent='center'>
                                <Button variant="contained" onClick={()=>{createOrder()}}>Generar Pedido</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}