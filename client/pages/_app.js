//wiring up bootstrap for global loading on every single page a user sees in our app
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header as='h2' icon='create-ticket' currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        // the set of data we are trying to fetch from individual pages (components) props
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser);
    }


    return {
        pageProps,
        ...data
    };
};

export default AppComponent;
