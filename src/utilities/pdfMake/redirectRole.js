import { decodeToken } from "react-jwt";
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

export const verifyTokenWithPath = (path,navigator) => {
    console.log('entra')
    const token = localStorage.token;
    if(token!==undefined){
        let decode;
        let result;
        decode = decodeToken(token);
        if(decode.data.role==='SuperUsuario' && path!=='Cliente'){
            result = path
        }else{
            result = decode.data.role
        }

        console.log('result', result);
        console.log('path', path);

        if(result!==path){
            redirectRole(result, navigator);
        }else{
            if(decode.data.role==='SuperUsuario')
                if(path==='Login')
                    redirectRole('SuperUsuario', navigator);
                else
                    return true
            else
                return false
        }
    }
}