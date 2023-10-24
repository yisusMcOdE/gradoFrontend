import { Button, Card, FormLabel, Grid, TextField } from "@mui/material";
import { useStyles } from "./index.styles";
import logoUatf from '../../assets/images/uatf.png';
import { useNavigate } from "react-router-dom";
import { redirectRole } from "../../utilities/pdfMake/redirectRole";
import { decodeToken } from "react-jwt";

export const Login = () => {

    const navigator = useNavigate();

    const login = async() => {
        const user = document.getElementById('user').value;
        const password = document.getElementById('password').value;
        const url = 'http://localhost:5000/api/login/employee';
        const response = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                user,
                password
            })
        })
        const token = await response.json();
        localStorage.setItem('token',token.token);
        const decode = decodeToken(token.token);
        redirectRole(decode.data.role, navigator);
    }

    const classes = useStyles();
    return (
        <>
            <Grid container>
                <Grid item xs={6} className={classes.logoArea}>
                    <img src={logoUatf}/>
                    <h1>Universidad Autonoma Tomas Frias</h1>
                </Grid>
                <Grid item xs={6} className={classes.formArea}>
                    <Card className={classes.cardLogin}>
                        <Grid container direction="column" alignItems="center" justifyContent="space-around" style={{height:'100%'}}>
                            <Grid item>
                                <h1>Inicio de Sesion</h1>
                            </Grid>
                            <Grid item container direction="column" alignItems="center" spacing={2}>
                                <Grid item>
                                    <TextField className={classes.textField} id="user" label="Usuario / Email" variant="outlined" />
                                </Grid>
                                <Grid item>
                                    <TextField className={classes.textField} id="password" label="Contraseña" variant="outlined" />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={login}>Iniciar Sesion</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}