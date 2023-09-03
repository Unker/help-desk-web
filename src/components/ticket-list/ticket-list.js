import './ticket-list.css';
// import Task from '../../js/Task';

export default class TicketList {
  constructor(url) {
    this.url = url;
    this.addTicketButton = document.querySelector('.addTicketButton');
    this.ticketList = document.querySelector('.ticketList');
    this.ticketModal = document.querySelector('.ticketModal');
    this.deleteModal = document.querySelector('.deleteModal');
    this.confirmButton = document.querySelector('.confirmButton');
    this.cancelButton = document.querySelector('.cancelButton');
    this.modalBackground = document.querySelector('.modal-background');
    this.tickets = [];

    this.#createFormTicket();

    this.openAddTicketModal = this.openAddTicketModal.bind(this);
    this.confirmDeleteTicket = this.confirmDeleteTicket.bind(this);
    this.closeModals = this.closeModals.bind(this);

    this.addTicketButton.addEventListener('click', this.openAddTicketModal);
    this.confirmButton.addEventListener('click', this.confirmDeleteTicket);
    this.cancelButton.addEventListener('click', this.closeModals);

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
    const title = this.ticketModal.querySelector('.form-title');
    title.textContent = 'Добавить тикет';
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
      const response = await fetch(`${this.url}/?method=deleteTicket&id=${id}`, {
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

  #createFormTicket() {
    // Создаем элементы формы
    const form = document.createElement('form');
    form.classList.add('form-ticket');

    const titleLabel = document.createElement('label');
    titleLabel.classList.add('form-title');
    titleLabel.textContent = '';

    const labelName = document.createElement('label');
    labelName.textContent = 'Краткое описание';

    const nameInput = document.createElement('input');

    const labelDescription = document.createElement('label');
    labelDescription.textContent = 'Подробное описание';

    const descriptionInput = document.createElement('textarea');

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancelButton');

    const okButton = document.createElement('button');
    okButton.classList.add('confirmButton');

    // Настройка элементов формы
    nameInput.type = 'text';
    nameInput.setAttribute('required', true);
    cancelButton.textContent = 'Отмена';
    okButton.textContent = 'Ок';

    // Добавляем элементы формы в контейнер
    form.appendChild(titleLabel);
    form.appendChild(labelName);
    form.appendChild(nameInput);
    form.appendChild(labelDescription);
    form.appendChild(descriptionInput);
    form.appendChild(buttonContainer);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);

    // Добавляем обработчики событий для кнопок
    cancelButton.addEventListener('click', () => {
      this.closeModals();
    });

    okButton.addEventListener('click', async (e) => {
      console.log('Отправка формы');
      if (form.checkValidity()) {
        e.preventDefault();

        const formData = {
          name: nameInput.value,
          description: descriptionInput.value,
        };
        
        try {
          const response = await fetch(`${this.url}/?method=createTicket`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify(formData),
          });
          if (!response.ok) {
            throw new Error('Failed to create ticket');
          }
          this.displayTickets();
        } catch (error) {
          console.error(error);
        }

        this.closeModals();
      }
    });

    // Добавляем форму в контейнер модального окна
    this.ticketModal.appendChild(form);
  }
}