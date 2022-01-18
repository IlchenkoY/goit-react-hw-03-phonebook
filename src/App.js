import shortid from 'shortid';
import { Component } from 'react';
import { ContactForm } from './components/ContactForm/ContactForm';
import { ContactList } from './components/Contactlist/ContactList';
import { Filter } from './components/Filter/Filter';
import { Container } from './components/Container/Container';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  formSubmitHandler = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    if (
      this.state.contacts.find(
        contactsEl =>
          contactsEl.name.toLowerCase() === contact.name.toLowerCase(),
      )
    ) {
      alert(`${contact.name} is already in contacts`);
      return;
    }

    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.target.value });
  };

  filteredContactsHandler = () => {
    const { contacts, filter } = this.state;

    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase()) ||
        contact.number.includes(filter),
    );
  };

  deleteContactHandler = id => {
    this.setState({
      contacts: this.state.contacts.filter(contactsEl => contactsEl.id !== id),
    });
  };

  componentDidUpdate() {
    localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
  }

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parseContacts = JSON.parse(contacts);

    if (parseContacts) {
      this.setState({ contacts: parseContacts });
    }
  }

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = this.filteredContactsHandler();

    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2>Contacts</h2>
        {contacts.length > 0 ? (
          <Filter value={filter} onChange={this.changeFilter} />
        ) : (
          <p>You have no contacts yet</p>
        )}
        {contacts.length > 0 && filteredContacts.length !== 0 && (
          <ContactList
            contacts={filteredContacts}
            onDelete={this.deleteContactHandler}
          />
        )}
      </Container>
    );
  }
}

export { App };
