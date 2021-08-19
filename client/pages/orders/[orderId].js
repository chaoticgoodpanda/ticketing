import {useEffect, useState} from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => console.log(payment)
    });

    // empty array [] at end ensures function only runs one time
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        // setInterval only starts 1 second in, not at 0 seconds, so
        // need to invoke findTimeLeft() immediately
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        // clears the timer if we navigate away from component
        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired! Please make a new order in order to buy your tickets.</div>
    }



    return (
        <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout
            token={({ id }) => doRequest({token: id})}
            // this is the Stripe publishable key, not secret key
            // NextJS has docs on setting environmental variables, need to check eventually
            stripeKey='pk_test_51JPtVEFndKcBYO45Hd2sU8xPrYGTmz8akW7MMabgypIKeAAcmxnqiSXqsb3iu9ISgH8K7bzIctKQ8sKfZnuCr7sL00HKKjOnGn'
            // need to multiply by 100 b/c Stripe treats all USD as cents
            amount={order.ticket.price * 100}
            email={currentUser.email}
            />
        {errors}
    </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    // called {orderId} because we named our file [orderId].js
    const {orderId} = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;