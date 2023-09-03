import './ticket-list.css';
// import Task from '../../js/Task';

export default class TicketList {
  constructor() {
    this.addTicketButton = document.querySelector('.addTicketButton');
    this.ticketList = document.querySelector('.ticketList');
    this.ticketModal = document.querySelector('.ticketModal');
    this.deleteModal = document.querySelector('.deleteModal');
    this.confirmDeleteButton = document.querySelector('.confirmDeleteButton');
    this.cancelDeleteButton = document.querySelector('.cancelDeleteButton');
    this.modalBackground = document.querySelector('.modal-background');
    this.tickets = [];

    this.openAddTicketModal = this.openAddTicketModal.bind(this);
    this.confirmDeleteTicket = this.confirmDeleteTicket.bind(this);
    this.closeModals = this.closeModals.bind(this);

    this.addTicketButton.addEventListener('click', this.openAddTicketModal);
    this.confirmDeleteButton.addEventListener('click', this.confirmDeleteTicket);
    this.cancelDeleteButton.addEventListener('click', this.closeModals);

    this.loadTickets();
  }

  async loadTickets() {
    try {
      const response = await fetch('http://localhost:3000/?method=allTickets');
      if (!response.ok) {
        throw new Error('Failed to load tickets');
      }
      this.tickets = await response.json();
      this.displayTickets();
    } catch (error) {
      console.error(error);
    }
  }

  // Функция для отображения тикетов в списке
  displayTickets() {
    this.ticketList.innerHTML = '';
    this.tickets.forEach((ticket, index) => {
      const ticketItem = document.createElement('div');
      ticketItem.classList.add('ticket-item');

      const statusCheckbox = document.createElement('input');
      statusCheckbox.type = 'checkbox';
      statusCheckbox.checked = ticket.status;
      statusCheckbox.setAttribute('data-index', index);
      statusCheckbox.addEventListener('change', () => updateStatus(index));
      ticketItem.appendChild(statusCheckbox);

      const nameSpan = document.createElement('span');
      nameSpan.textContent = ticket.name;
      ticketItem.appendChild(nameSpan);

      const editButton = document.createElement('button');
      editButton.textContent = '✎';
      editButton.classList.add('edit-button');
      editButton.setAttribute('data-index', index);
      editButton.addEventListener('click', () => editTicket(index));
      ticketItem.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.classList.add('delete-button');
      deleteButton.setAttribute('data-index', index);
      this.openDeleteModal = this.openDeleteModal.bind(this);
      deleteButton.addEventListener('click', this.openDeleteModal);
      ticketItem.appendChild(deleteButton);

      this.ticketList.appendChild(ticketItem);
    });
  }

  openAddTicketModal() {
    this.ticketModal.style.display = 'block';
    this.modalBackground.style.display = 'block';
  }

  openDeleteModal(e) {
    this.indexSelectedTicket = e.target.getAttribute('data-index')
    this.deleteModal.style.display = 'block';
    this.modalBackground.style.display = 'block';
  }

  async confirmDeleteTicket() {
    const index = this.indexSelectedTicket;
    const { id } = this.tickets[index];
    try {
      const response = await fetch('http://localhost:3000/?method=deleteTicket&id=' + id, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }
      this.tickets.splice(index, 1);
      this.displayTickets();
    } catch (error) {
      console.error(error);
    }
    this.closeModals();
  }

  closeModals() {
    this.deleteModal.style.display = 'none';
    this.ticketModal.style.display = 'none';
    this.modalBackground.style.display = 'none';
    this.indexSelectedTicket = undefined;
  }

  // Другие методы для редактирования тикетов, обновления статуса и др.
}