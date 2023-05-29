import { Grid } from "@mui/material";
import { useStyles } from "./main.styles";

export const Main = ({children}) => {

    const classes = useStyles();

    return (
        <Grid container direction='column' justifyContent='center'>
            <Grid item xs={12} className={classes.mainContainer}>
                {children}
            </Grid>
        </Grid>
    )
}