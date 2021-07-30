//wiring up bootstrap for global loading on every single page a user sees in our app
import 'bootstrap/dist/css/bootstrap.css';
import {Component} from "react";

const PageView = ({Component, pageProps}) => {
    return <Component {...pageProps} />;
};

export default PageView;
