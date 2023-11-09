import logoUatf from '../../assets/images/uatf.png'
import { useStyles } from './index.styles'
export const BackgroundPage = () => {

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <img src={logoUatf} />
        </div>
    )
}