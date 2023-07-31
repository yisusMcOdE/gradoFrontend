import { Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createClientExternal, createEmployee } from "../../../utilities/allPostFetch"
import { useStyles } from "../recepcion.styles"

export const CreateClientRecepcion = () => {

    const navigator = useNavigate();

    const [client, setClient] = useState(true);

    const classes = useStyles();

    const createUser = () => {
        if(!client){
            const data = {
                name: document.getElementById('nameForm').value,
                ci: document.getElementById('ciForm').value,
                email: document.getElementById('emailForm').value,
                phone:  document.getElementById('phoneForm').value,
                status: true,
            }
            createClientExternal(data);
            navigator('/recepcion/clientes');
        }else{
            const data = {
                user: document.getElementById('userForm').value,
                password: document.getElementById('passwordForm').value,
                institution: document.getElementById('nameForm').value,
                email: document.getElementById('emailForm').value,
                phone: document.getElementById('phoneForm').value,
                address: document.getElementById('addressForm').value,
                role: 'client',
                status: true,
            }
            createClient(data);
            navigator('/recepcion/clientes');
        }
    }

    return(
        <Main>
            <Grid container justifyContent='center'>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Cliente
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
                                        <FormControlLabel value={true} control={<Radio />} label="Interno" />
                                        <FormControlLabel value={false} control={<Radio />} label="Externo" />
                                    </RadioGroup>
                                </Box>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                {client&&<Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Usuario:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="userForm" size='small' />
                                    </Grid>
                                </Grid>
                                }
                                {client&&<Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Password:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="passwordForm" size='small' />
                                    </Grid>
                                </Grid>}
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>{client?'Institucion':'Nombre Completo:'}</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="nameForm" size='small' />
                                    </Grid>
                                </Grid>
                                {!client&&<Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>CI:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="ciForm" size='small' />
                                    </Grid>
                                </Grid>}
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Correo Electronico:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="emailForm" size='small' />
                                    </Grid>
                                </Grid>
                                {client&&<Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Direccion:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id='addressForm'  size='small' />
                                    </Grid>
                                </Grid>}
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Telefono:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id='phoneForm' size='small'/>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant='contained' onClick={()=>{createUser()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
    </Main>
    )
}