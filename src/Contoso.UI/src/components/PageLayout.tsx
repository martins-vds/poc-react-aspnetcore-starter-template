import { Container } from "@mui/material"
import NavigationBar from "./NavigationBar"

export const PageLayout = ({ children }: React.PropsWithChildren) => {
    return (
        <>
            <NavigationBar />
            <Container maxWidth={"lg"}>
                {children}
            </Container>
        </>
    )
}