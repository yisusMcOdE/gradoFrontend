import { Alert, Autocomplete, Backdrop, Box, Button, Card, CircularProgress, FormControlLabel, Grid, Radio, RadioGroup, Snackbar, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"

export const CreateMaterial = () => {

    const navigator = useNavigate();
    const initialInput = {error:false, value:''}

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});

    const [nameForm, setNameForm] = useState(initialInput);
    const [unitForm, setUnitForm] = useState(initialInput);

    const classes = useStyles();

    const createUser = async() => {

        ///Validacion
        let error = false;

        if((nameForm.value==='')){
            setNameForm({error:true, value:''})
            error=true
        }
        if((unitForm.value==='')){
            setUnitForm({error:true, value:''})
            error=true
        }

        if(!error){
            setLoading(true);
            const response = await createMaterial({
                name:nameForm.value,
                unit:unitForm.value
            });
            setLoading(false);
            handleResponse(response);
        }
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

    const clearInputs = () => {
        setNameForm(initialInput);
        setUnitForm(initialInput);
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
            <Grid container direction={'column'} rowGap={2} alignItems={'center'}>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Material
                                </h1>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField 
                                            value={nameForm.value}
                                            onChange={({target})=>setNameForm({...nameForm, value:target.value})}
                                            required
                                            label='Requerido'
                                            error={nameForm.error}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Unidad de medida:</label>
                                    </Grid>
                                    <Grid item >
                                    <TextField 
                                            value={unitForm.value}
                                            onChange={({target})=>setUnitForm({...unitForm, value:target.value})}
                                            required
                                            label='Requerido'
                                            error={unitForm.error}
                                            size='small'
                                        />
                                    </Grid>
                                </Grid>
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