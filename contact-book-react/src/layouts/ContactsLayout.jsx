import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "../App.css";

function getInitials(name) {
  if (!name) return "??";

  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return words[0].charAt(0).toUpperCase();
}

function getAvatarClass(name) {
  if (!name) return "avatar-color-1";

  const normalizedName = name.trim().toLowerCase();

  let hash = 0;

  for (let i = 0; i < normalizedName.length; i++) {
    hash += normalizedName.charCodeAt(i);
  }

  const colorNumber = (hash % 5) + 1;

  return `avatar-color-${colorNumber}`;
}

function getInitialContacts() {
  return [
    {
      id: "1",
      name: "Amara Bello",
      phone: "+1 (415) 555-0182",
      email: "amara@mail.com",
      note: "First contact",
      dateAdded: "Mar 10",
    },
    {
      id: "2",
      name: "Anton Reyes",
      phone: "+1 (555) 000-1122",
      email: "anton.reyes@mail.com",
      note: "Work colleague",
      dateAdded: "Mar 12",
    },
    {
      id: "3",
      name: "Dana Kimura",
      phone: "+1 (206) 555-0117",
      email: "dana@kimura.dev",
      note: "Designer",
      dateAdded: "Mar 13",
    },
    {
      id: "4",
      name: "Maria Novak",
      phone: "+1 (312) 555-0146",
      email: "maria.novak@fastmail.com",
      note: "Study group partner — prefers texts over calls. Met at the Week 3 workshop.",
      dateAdded: "Mar 14",
    },
    {
      id: "5",
      name: "Miles Okafor",
      phone: "+1 (777) 888-9999",
      email: "miles.o@studio.dev",
      note: "Developer",
      dateAdded: "Mar 15",
    },
    {
      id: "6",
      name: "Sana Lindqvist",
      phone: "+46 70 555 01 99",
      email: "sana@lindqvist.se",
      note: "Friend from Sweden",
      dateAdded: "Mar 16",
    },
  ];
}

function ContactsLayout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem("contacts");

    if (savedContacts) {
      return JSON.parse(savedContacts);
    }

    return getInitialContacts();
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  function handleAddContact() {
    navigate("/contacts/create");
  }

  const filteredContacts = contacts.filter((contact) => {
    const query = searchTerm.toLowerCase().trim();

    return (
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  });

  const sortedContacts = [...filteredContacts].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const groupedContacts = sortedContacts.reduce((groups, contact) => {
    const letter = contact.name.trim().charAt(0).toUpperCase();

    if (!groups[letter]) {
      groups[letter] = [];
    }

    groups[letter].push(contact);

    return groups;
  }, {});

  const groupLetters = Object.keys(groupedContacts).sort();

  return (
    <div className="container">
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="title-group">
            <h1>Contacts</h1>

            <span className="count" id="contacts-counter">
              {contacts.length} saved
            </span>
          </div>

          <button
            type="button"
            className="btn-add"
            id="add-contact-btn"
            aria-label="Додати новий контакт"
            onClick={handleAddContact}
          >
            + Add contact
          </button>
        </header>

        <search className="search-box">
          <form>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>

            <input
              type="search"
              id="search-input"
              placeholder="Search name, phone, or email"
              aria-label="Пошук контактів"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>
        </search>

        <nav className="contacts-nav" aria-label="Список контактів">
          {groupLetters.map((letter) => (
            <section className="group-section" key={letter}>
              <h2 className="group-letter">{letter}</h2>

              <ul className="contacts-list">
                {groupedContacts[letter].map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      className={`contact-item ${
                        contact.id === id ? "active" : ""
                      }`}
                      onClick={() => {
                        navigate(`/contacts/${contact.id}`);
                      }}
                    >
                      <span
                        className={`avatar ${getAvatarClass(contact.name)}`}
                      >
                        {getInitials(contact.name)}
                      </span>

                      <span className="contact-info">
                        <span className="name">{contact.name}</span>

                        <span className="detail">
                          {contact.phone || contact.email}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>

      <Outlet context={{ contacts, setContacts }} />
    </div>
  );
}

export default ContactsLayout;