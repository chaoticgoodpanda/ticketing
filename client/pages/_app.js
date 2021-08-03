//wiring up bootstrap for global loading on every single page a user sees in our app
import 'bootstrap/dist/css/bootstrap.css';
import {Component} from "react";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />;
    </div>
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        // the set of data we are trying to fetch from individual pages (components) props
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    console.log(pageProps);
    return {
        pageProps,
        ...data
    };
};

export default AppComponent;