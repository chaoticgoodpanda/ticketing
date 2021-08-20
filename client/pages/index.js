import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        )
    })

    return (
        <div>
            <h2>Tickets</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
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
