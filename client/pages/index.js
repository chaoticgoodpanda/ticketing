import buildClient from "../api/build-client";

// need to use axios to fetch data from getInitialProps
const LandingPage = ({ currentUser }) => {
    // console.log(currentUser);
    // axios.get('/api/users/currentuser').catch((err) => {
    //     console.log(err.message);
    // });
    return currentUser ? (
        <h1>You are signed in!</h1>)
        : (
            <h1>You are NOT signed in.</h1>);
};

// this is not a component, it is a plain function
// not allowed to fetch data from a component during the initial SSR
// first part of data pulled typically called "context"
LandingPage.getInitialProps = async (context) => {
    console.log('LANDING PAGE!');
    // executing props for appComponent
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');

    return data;
    
};

export default LandingPage;
