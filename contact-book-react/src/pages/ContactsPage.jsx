import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function getInitials(name) {
    if (!name) return "??"

    const words = name
        .trim()
        .split(' ')
        .filter((word) => word.length > 0)

    if (words.length >= 2) {
        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase()
    }

    return words[0].charAt(0).toUpperCase()
}

function getAvatarClass(name) {
    if (!name) return 'av-mn'

    const words = name
        .trim()
        .split(' ')
        .filter((word) => word.length > 0)

    let initials = ''

    if (words.length >= 2) {
        initials = (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toLowerCase()
    } else if (words.length === 1) {
        initials = words[0].charAt(0).toLowerCase()
    }

    const validClasses = [
        'av-ab',
        'av-ar',
        'av-dk',
        'av-mn',
        'av-mo',
        'av-sl'
    ]

    return validClasses.includes(`av-${initials}`)
        ? `av-${initials}`
        : 'av-mn'
}

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '')

    return digits.length >= 7 && digits.length <= 15
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getInitialContacts() {
    return [
        {
            id: "1",
            name: "Amara Bello",
            phone: "+1 (415) 555-0182",
            email: "amara@mail.com",
            note: "First contact",
            dateAdded: "Mar 10"
        },
        {
            id: "2",
            name: "Anton Reyes",
            phone: "+1 (555) 000-1122",
            email: "anton.reyes@mail.com",
            note: "Work colleague",
            dateAdded: "Mar 12"
        },
        {
            id: "3",
            name: "Dana Kimura",
            phone: "+1 (206) 555-0117",
            email: "dana@kimura.dev",
            note: "Designer",
            dateAdded: "Mar 13"
        },
        {
            id: "4",
            name: "Maria Novak",
            phone: "+1 (312) 555-0146",
            email: "maria.novak@fastmail.com",
            note: "Study group partner — prefers texts over calls. Met at the Week 3 workshop.",
            dateAdded: "Mar 14"
        },
        {
            id: "5",
            name: "Miles Okafor",
            phone: "+1 (777) 888-9999",
            email: "miles.o@studio.dev",
            note: "Developer",
            dateAdded: "Mar 15"
        },
        {
            id: "6",
            name: "Sana Lindqvist",
            phone: "+46 70 555 01 99",
            email: "sana@lindqvist.se",
            note: "Friend from Sweden",
            dateAdded: "Mar 16"
        }
    ]
}

function ContactsPage() {
    const navigate = useNavigate()

    const [contacts, setContacts] = useState(() => {
        const savedContacts = localStorage.getItem('contacts')

        if (savedContacts) {
            return JSON.parse(savedContacts)
        }

        return getInitialContacts()
    })

    useEffect(() => {
        localStorage.setItem(
            'contacts',
            JSON.stringify(contacts)
        )
    }, [contacts])

    const [selectedContactId, setSelectedContactId] = useState("4")
    const [isEditMode, setIsEditMode] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        note: '',
    })

    const [nameError, setNameError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [emailError, setEmailError] = useState('')

    function clearErrors() {
        setNameError('')
        setPhoneError('')
        setEmailError('')
    }

    const selectedContact = contacts.find(
        (contact) => contact.id === selectedContactId
    )

    function handleChange(event) {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value,
        })

        if (name === 'name') {
            if (!value.trim()) {
                setNameError('Name is required')
            } else {
                setNameError('')
            }
        }

        if (name === 'phone') {
            if (!value.trim()) {
                setPhoneError('Phone is required')
            } else if (!isValidPhone(value.trim())) {
                setPhoneError('Enter a valid phone number')
            } else {
                setPhoneError('')
            }
        }

        if (name === 'email') {
            if (
                value.trim() &&
                !isValidEmail(value.trim())
            ) {
                setEmailError('Enter a valid email address')
            } else {
                setEmailError('')
            }
        }
    }

    function handleEdit() {
        if (!selectedContactId) return

        navigate(`/contacts/${selectedContactId}/edit`)
    }

    function handleSave(event) {
        event.preventDefault()

        let hasError = false

        // Перевірка Name
        if (!formData.name.trim()) {
            setNameError('Name is required')
            hasError = true
        } else {
            setNameError('')
        }

        // Перевірка Phone
        if (!formData.phone.trim()) {
            setPhoneError('Phone is required')
            hasError = true
        } else if (!isValidPhone(formData.phone.trim())) {
            setPhoneError('Enter a valid phone number')
            hasError = true
        } else {
            setPhoneError('')
        }

        // Перевірка Email
        if (
            formData.email.trim() &&
            !isValidEmail(formData.email.trim())
        ) {
            setEmailError('Enter a valid email address')
            hasError = true
        } else {
            setEmailError('')
        }

        // Якщо є хоча б одна помилка —
        // зупиняємо збереження
        if (hasError) {
            return
        }

        // Додавання нового контакту
        if (isAdding) {
            const newContact = {
                id: crypto.randomUUID(),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                note: formData.note.trim(),
                dateAdded: 'Today',
            }

            setContacts((prevContacts) => [
                ...prevContacts,
                newContact,
            ])

            setSelectedContactId(newContact.id)
            setIsAdding(false)
            setIsEditMode(false)

            setFormData({
                name: '',
                phone: '',
                email: '',
                note: '',
            })
        } else {
            // Редагування існуючого контакту
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === selectedContactId
                        ? {
                            ...contact,
                            name: formData.name.trim(),
                            phone: formData.phone.trim(),
                            email: formData.email.trim(),
                            note: formData.note.trim(),
                        }
                        : contact
                )
            )

            setIsEditMode(false)

            setFormData({
                name: '',
                phone: '',
                email: '',
                note: '',
            })
        }
    }

    function handleCancel() {
        clearErrors()

        setIsEditMode(false)
        setIsAdding(false)

        setFormData({
            name: '',
            phone: '',
            email: '',
            note: '',
        })
    }

    function handleDelete() {
        if (!selectedContactId) return

        const shouldDelete = window.confirm(
            'Are you sure you want to delete this contact?'
        )

        if (!shouldDelete) return

        clearErrors()

        const remainingContacts = contacts.filter(
            (contact) => contact.id !== selectedContactId
        )

        setContacts(remainingContacts)

        if (remainingContacts.length > 0) {
            setSelectedContactId(remainingContacts[0].id)
        } else {
            setSelectedContactId(null)
        }

        setIsEditMode(false)
        setIsAdding(false)
    }

    function handleAddContact() {
        clearErrors()

        setSelectedContactId(null)
        setIsAdding(true)
        setIsEditMode(false)

        setFormData({
            name: '',
            phone: '',
            email: '',
            note: '',
        })
    }

    const filteredContacts = contacts.filter((contact) => {
        const query = searchTerm.toLowerCase().trim()

        return (
            contact.name.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query)
        )
    })

    const sortedContacts = [...filteredContacts].sort((a, b) =>
        a.name.localeCompare(b.name)
    )

    const groupedContacts = sortedContacts.reduce((groups, contact) => {
        const letter = contact.name.trim().charAt(0).toUpperCase()

        if (!groups[letter]) {
            groups[letter] = []
        }

        groups[letter].push(contact)

        return groups
    }, {})

    const groupLetters = Object.keys(groupedContacts).sort()

    return (
        <div className="container">

            <aside className="sidebar">

                {/* Ліва панель */}
                <header className="sidebar-header">

                    <div className="title-group">
                        <h1>Contacts</h1>

                        <span
                            className="count"
                            id="contacts-counter"
                        >
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

                <nav
                    className="contacts-nav"
                    aria-label="Список контактів"
                >
                    {groupLetters.map((letter) => (
                        <section className="group-section" key={letter}>
                            <h2 className="group-letter">{letter}</h2>

                            <ul className="contacts-list">
                                {groupedContacts[letter].map((contact) => (
                                    <li key={contact.id}>
                                        <button
                                            type="button"
                                            className={`contact-item ${contact.id === selectedContactId ? 'active' : ''
                                                }`}
                                            onClick={() => setSelectedContactId(contact.id)}
                                        >
                                            <span className={`avatar ${getAvatarClass(contact.name)}`}>
                                                {getInitials(contact.name)}
                                            </span>

                                            <span className="contact-info">
                                                <span className="name">
                                                    {contact.name}
                                                </span>

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

            <main className="main-content">

                {selectedContact || isAdding ? (
                    <>
                        {/* Права панель */}
                        <header className="profile-header">

                            <div className="profile-summary">

                                <div
                                    className="avatar-large"
                                    id="detail-initials"
                                    aria-hidden="true"
                                >
                                    {getInitials(
                                        isEditMode || isAdding
                                            ? formData.name
                                            : selectedContact?.name
                                    )}
                                </div>

                                <div className="profile-title">
                                    {isEditMode || isAdding ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Contact name"
                                                className="profile-name-input"
                                            />

                                            {nameError && (
                                                <span className="error-message error-message-visible">
                                                    {nameError}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <h2>{selectedContact?.name}</h2>
                                    )}

                                    <p className="timestamp">
                                        {isAdding
                                            ? 'Creating new contact'
                                            : selectedContact?.dateAdded}
                                    </p>
                                </div>

                            </div>

                            <div
                                className="action-buttons"
                                id="view-actions"
                            >

                                <button
                                    type="button"
                                    className="btn-edit"
                                    id="edit-btn"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="btn-delete"
                                    id="delete-btn"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        </header>

                        <form
                            id="contact-form"
                            noValidate
                            onSubmit={handleSave}
                            className="contact-form"
                        >
                            <input type="hidden" id="contact-id" />

                            <dl className="details-grid">

                                <div className="table-row">

                                    <dt className="label">
                                        PHONE
                                    </dt>

                                    <dd className="value value-phone">
                                        <input
                                            type="text"
                                            id="input-phone"
                                            name="phone"
                                            className="contact-field"
                                            value={
                                                isEditMode || isAdding
                                                    ? formData.phone
                                                    : selectedContact?.phone || ''
                                            }
                                            readOnly={!(isEditMode || isAdding)}
                                            onChange={handleChange}
                                        />

                                        {phoneError && (
                                            <span className="error-message error-message-visible">
                                                {phoneError}
                                            </span>
                                        )}
                                    </dd>

                                </div>

                                <div className="table-row">
                                    <dt className="label">
                                        EMAIL
                                    </dt>

                                    <dd className="value value-email">
                                        <input
                                            type="email"
                                            id="input-email"
                                            name="email"
                                            className="contact-field"
                                            value={
                                                isEditMode || isAdding
                                                    ? formData.email
                                                    : selectedContact?.email || ''
                                            }
                                            readOnly={!(isEditMode || isAdding)}
                                            onChange={handleChange}
                                        />

                                        {emailError && (
                                            <span className="error-message error-message-visible">
                                                {emailError}
                                            </span>
                                        )}
                                    </dd>
                                </div>

                                <div className="table-row">
                                    <dt className="label">
                                        NOTE
                                    </dt>

                                    <dd className="value value-note">
                                        <textarea
                                            id="input-note"
                                            name="note"
                                            className="contact-field contact-note"
                                            value={
                                                isEditMode || isAdding
                                                    ? formData.note
                                                    : selectedContact?.note || ''
                                            }
                                            readOnly={!(isEditMode || isAdding)}
                                            onChange={handleChange}
                                        >
                                        </textarea>
                                    </dd>
                                </div>

                            </dl>

                            <div
                                className={`action-buttons form-actions ${isEditMode || isAdding ? 'form-actions-visible' : ''
                                    }`}
                                id="form-actions"
                            >
                                <button
                                    type="submit"
                                    className="btn-save"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    className="btn-cancel"
                                    id="cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </>
                ) : (
                    <div className="empty-state">
                        <h2>No contacts</h2>
                        <p>Select a contact or add a new one.</p>
                    </div>
                )}

            </main>

        </div>
    )
}

export default ContactsPage