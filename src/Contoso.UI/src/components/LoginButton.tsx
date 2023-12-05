import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material"
import { loginRequest } from "../authConfig";

export const LoginButton = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup({
            ...loginRequest,
            redirectUri: '/signin-oidc',            
        }).catch((error) => console.log(error));
    };

    return (
        <Button color="inherit" onClick={handleLogin} >Login</Button>
    )
}