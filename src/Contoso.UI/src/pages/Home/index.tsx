import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";


/***
 * Component to detail ID token claims with a description for each claim. For more details on ID token claims, please check the following links:
 * ID token Claims: https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token
 * Optional Claims:  https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set
 */
export const Home = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const [welcomeMsg, setWelcomeMsg] = useState<string>('Hey there! Welcome to the React AspNetCore Starter Template!');

    useEffect(() => {
        if (activeAccount) {
            if (activeAccount.idTokenClaims) {
                let username = "";
                if (activeAccount.idTokenClaims["name"]) {
                    username = activeAccount.idTokenClaims["name"];
                } else if (activeAccount.idTokenClaims["preferred_username"]) {
                    username = activeAccount.idTokenClaims["preferred_username"];
                }else if (activeAccount.idTokenClaims["email"]) {
                    username = activeAccount.idTokenClaims["email"];
                }
                setWelcomeMsg(`Welcome ${username}!`);
            }
        }

    }, [activeAccount]);

    return (
        <>
            <AuthenticatedTemplate>
                {
                    activeAccount ?
                        <Typography >
                            {welcomeMsg}
                        </Typography>
                        :
                        null
                }
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Welcome to the React AspNetCore Starter Template!
                </Typography>
            </UnauthenticatedTemplate>
        </>
    )
}