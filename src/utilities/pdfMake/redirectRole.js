import { useNavigate } from "react-router-dom";


export const redirectRole = (role, navigator) => {
    switch (role) {
        case 'Cliente':
            navigator('/cliente');
        break;
        case 'Administracion':
        navigator('/admin');
        break;
        case 'Area':
        navigator('/area');
        break;
        case 'Recepcion':
        navigator('/recepcion');
        break;
        case 'Direccion':
        navigator('/direccion');
        break;
        case 'SuperUsuario':
        navigator('/admin');
        break;
        default:
        navigator('/login');
        break;
    }
}