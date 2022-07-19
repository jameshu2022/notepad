import { React, useEffect, useState, createContext, useContext } from "react";

const authContext = createContext();

function useProvideAuth() {
    const [authed, setAuthed] = useState(localStorage.getItem("userid") != null);

    return {
        authed,
        login() {
            return new Promise((res) => {
                setAuthed(true);
                res();
            })
        }, 
        logout() {
            return new Promise((res) => {
                // console.log("false");
                setAuthed(false);
                res();
            })
        }
    }
}

export function AuthProvider( {children} ){
    const auth = useProvideAuth();

    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth(){
    return useContext(authContext);
}