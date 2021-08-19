import { useEffect} from "react";
import useRequestHook from "../../hooks/use-request";
import Router from "next/router";


export default function SignOut() {
    const { doRequest } = useRequestHook({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });
    
    useEffect(() => {
        doRequest();
        
    }, []);
    
    return <div>Signing you out....</div>;
};