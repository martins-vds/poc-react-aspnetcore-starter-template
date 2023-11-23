export const PageLayout = ({ children }: React.PropsWithChildren) => {
    return (
        <>
            <div className="page">
                <div className="page-content">
                    {children}
                </div>
            </div>
        </>
    )
}