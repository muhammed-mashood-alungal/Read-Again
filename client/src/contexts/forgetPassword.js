import { createContext, useState } from "react";

export const ForgetPasswordContext = createContext()

export const ForgetPassProvider = ({children}) =>{
    const [forgetPassEmail, setForgetPassEmail] = useState("")

    return (
     <ForgetPasswordContext.Provider value={{forgetPassEmail,setForgetPassEmail}}>
     {children}
     </ForgetPasswordContext.Provider>
    )
}
