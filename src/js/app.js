import TicketList from '../components/ticket-list/ticket-list';

console.log('env server:', process.env.SERVER_URL);
const ticketList = new TicketList(process.env.SERVER_URL || 'https://help-desk-server.onrender.com');
