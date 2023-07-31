import { Grid } from "@mui/material";
import { useStyles } from "./main.styles";

export const Main = ({children}) => {

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs className={classes.mainContainer}>
                {children}
            </Grid>
        </Grid>
    )
}