import TicketList from '../components/ticket-list/ticket-list';

console.log('server:', process.env.SERVER_URL);
const ticketList = new TicketList(process.env.SERVER_URL);
