import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function Protected({ children, authentication =  true}) {

    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    const [loader,setLoader] = useState(true);
    useEffect(()=>{
        if(authentication && authStatus !== authentication){
            navigate('/login');
        } else if(!authentication && authStatus !== authentication) {
            navigate('/');
        }
        setLoader(false);
    }, [authStatus, navigate, authentication]);
    
    // TODO add a loader widget in place of null here
    return loader ? null : <>{children}</>
}

export default Protected