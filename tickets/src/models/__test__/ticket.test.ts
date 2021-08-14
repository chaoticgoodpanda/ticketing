import { Ticket} from "../ticket";

it('implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });

    // Save ticket to mongoDB
    await ticket.save();

    // fetch ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make 2 separate changes to the tickets we fetch
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15});

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('should not reach this point');
});

it('increments a version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);


})