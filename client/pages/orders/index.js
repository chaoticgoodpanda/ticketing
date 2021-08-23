import {List} from "semantic-ui-react";

const OrderIndex = ({orders}) => {
    return (
        <ul>
            {orders.map((order) => {
                return  (
                    <List>
                        <List.Item>{order.id}</List.Item>
                        <List.Item>{order.ticket.title}</List.Item>
                        <List.Item>{order.status}</List.Item>
                    </List>
            );
            })}
        </ul>
    );
};

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data };
};

export default OrderIndex;