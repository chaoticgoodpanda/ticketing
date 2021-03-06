import Link from 'next/link';
import {List} from 'semantic-ui-css/semantic.min.css';

const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <List>
                <List.Item>{ticket.id}</List.Item>
                <List.Item>{ticket.title}</List.Item>
                <List.Item>{ticket.price}</List.Item>
            </List>
        )
    })

    return (
        <div>
            <h1>Tickets for Sale!</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name of Ticket</th>
                        <th>Unit Price</th>
                        <th>Click to Buy</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
};

// this is not a component, it is a plain function
// not allowed to fetch data from a component during the initial SSR
// first part of data pulled typically called "context"
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');

    // everything inside of here is going to be emerged into Props
    // as an array of all tickets fetched inside API
    return { tickets: data };
};

export default LandingPage;
