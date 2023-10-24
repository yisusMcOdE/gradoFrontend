import { Alert, Autocomplete, Backdrop, Box, Button, Card, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Snackbar, TextField } from "@mui/material"
import { useState } from "react"
import { Main } from "../../../components/main"
import { createClient, createEmployee } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"

export const CreateUser = () => {

    const initialInput = {error:false, value:''}

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});

    const [client, setClient] = useState(true);
    const [userForm, setUserForm] = useState(initialInput);
    const [passwordForm, setPasswordForm] = useState(initialInput);
    const [institutionForm, setInstitutionForm] = useState(initialInput);
    const [courierForm, setCourierForm] = useState(initialInput);
    const [emailForm, setEmailForm] = useState(initialInput);
    const [roleForm, setRoleForm] = useState(initialInput);
    const [phoneForm, setPhoneForm] = useState(initialInput);
    const [addressForm, setAddressForm] = useState(initialInput);

    const classes = useStyles();

    const createUser = async() => {

        ///Validacion
        let error = false;

        if(client){
            if((courierForm.value==='')){
                setCourierForm({error:true, value:''})
                error=true
            }
            if((!(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(emailForm.value)))){
                setEmailForm({error:true, value:emailForm.value})
                error=true
            }
        }else{
            if((roleForm.value==='')){
                setRoleForm({error:true, value:''})
                error=true
            }
        }

        if(userForm.value===''){
            setUserForm({error:true, value:''})
            error=true
        }
        if(passwordForm.value.length<6){
            setPasswordForm({error:true, value:passwordForm.value})
            error=true
        }
        if((institutionForm.value==='')){
            setInstitutionForm({error:true, value:''})
            error=true
        }
        
        
        if(!error){
            if(client){
                const dataClient = {
                    user: userForm.value,
                    password: passwordForm.value,
                    institution: institutionForm.value,
                    email: emailForm.value,
                    courier: courierForm.value,
                    address: document.getElementById('addressForm').value,
                    phone:  phoneForm.value,
                }
                setLoading(true);
                const response = await createClient(dataClient);
                setLoading(false);
                handleResponse(response);
            }else{
                const dataEmployee = {
                    user: userForm.value,
                    password: passwordForm.value,
                    name: institutionForm.value,
                    phone: phoneForm.value,
                    role: roleForm.value,
                }
                setLoading(true);
                const response = await createEmployee(dataEmployee);
                setLoading(false);
                handleResponse(response);
            }
        }
    }

    const clearInputs = () => {
        setUserForm(initialInput)
        setPasswordForm(initialInput)
        setInstitutionForm(initialInput)
        setCourierForm(initialInput)
        setEmailForm(initialInput)
        setRoleForm(initialInput)
        setPhoneForm(initialInput)
        setAddressForm(initialInput)
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


    return(
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


        <Grid container direction={'column'} alignItems={'center'}>
            <Grid item>
                <Card>
                    <Grid container direction='column' rowSpacing={3}>
                        {
                            ///------TITLE------///
                        }
                        <Grid item>
                            <h1 className={classes.titlePage}>
                                Crear Usuario
                            </h1>
                        </Grid>

                        <Grid item>
                            <Box display='flex' justifyContent= 'center' >
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={client}
                                    onChange={()=>{setClient(prev => !prev)}}
                                    row
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Institucion" />
                                    <FormControlLabel value={false} control={<Radio />} label="Empleado" />
                                </RadioGroup>
                            </Box>
                        </Grid>

                        <Grid item container direction='column' rowSpacing={1}>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Usuario:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        value={userForm.value}
                                        onChange={({target})=>{setUserForm({...userForm, value:target.value})}}
                                        required
                                        error={userForm.error}
                                        label="Requerido" 
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Password:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField 
                                        value={passwordForm.value}
                                        onChange={({target})=>{setPasswordForm({...passwordForm, value:target.value})}}
                                        error={passwordForm.error}
                                        required
                                        type='password'
                                        label="Al menos 6 caracteres" 
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>{client?'Institucion:':'Nombre:'}</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        value={institutionForm.value}
                                        onChange={({target})=>{setInstitutionForm({...institutionForm, value:target.value})}}
                                        required
                                        error={institutionForm.error}
                                        label="Requerido" 
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                            {client&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Mensajero:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        value={courierForm.value}
                                        onChange={({target})=>{setCourierForm({...courierForm, value:target.value})}}
                                        required
                                        error={courierForm.error}
                                        label="Requerido" 
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                            }
                            {client&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Correo Electronico:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        value={emailForm.value}
                                        onChange={({target})=>{setEmailForm({...emailForm, value:target.value})}}
                                        type={'email'}
                                        error={emailForm.error}
                                        label={emailForm.error?'Correo no valido':'Opccional'}
                                        size='small'
                                    />
                                </Grid>
                            </Grid>
                            }
                            {client&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Direccion:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        value={addressForm.value}
                                        onChange={({target})=>{setAddressForm({...addressForm, value:target.value})}}
                                        id='addressForm'  
                                        size='small'
                                        label='Opccional'
                                    />
                                </Grid>
                            </Grid>}
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Telefono:</label>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        onChange={({target})=>{setPhoneForm({...phoneForm, value:target.value})}}
                                        value={phoneForm.value}
                                        id='phoneForm'  
                                        size='small'
                                        label='Opccional'
                                    />
                                </Grid>
                            </Grid>
                            {!client&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Role:</label>
                                </Grid>
                                <Grid item xs>
                                    <Autocomplete
                                        onChange={({target})=>{setRoleForm({...roleForm, value:target.textContent})}}
                                        value={roleForm.value}
                                        size='small'
                                        id="roleForm"
                                        options={['Area','Recepcion','Direccion','Administracion','SuperUsuario']}
                                        sx={{ width: 150 }}
                                        renderInput={(params) => <TextField 
                                            label='Requerido'
                                            required 
                                            error={roleForm.error} 
                                            {...params}
                                        />}
                                    />
                                </Grid>
                            </Grid>}
                        </Grid>

                        <Grid item container justifyContent='center'>
                            <Button variant="contained" onClick={()=>{createUser()}}>Crear</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
        
    </Main>
    )
}