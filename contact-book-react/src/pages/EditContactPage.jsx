import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditContactPage() {
    const navigate = useNavigate()
    const { id } = useParams()

    const savedContacts = localStorage.getItem('contacts')

    const contacts = savedContacts
        ? JSON.parse(savedContacts)
        : []

    const contact = contacts.find(
        (contact) => contact.id === id
    )

    const [formData, setFormData] = useState({
        name: contact?.name || '',
        phone: contact?.phone || '',
        email: contact?.email || '',
        note: contact?.note || '',
    })

    function handleChange(event) {
        const { name, value } = event.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    function handleSave() {
        const updatedContacts = contacts.map((contact) =>
            contact.id === id
                ? {
                    ...contact,
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    note: formData.note,
                }
                : contact
        )

        localStorage.setItem(
            'contacts',
            JSON.stringify(updatedContacts)
        )

        navigate('/contacts')
    }

    return (
        <div>
            <h1>Edit Contact Page</h1>

            <p>Contact ID: {id}</p>

            <div>
                <label>
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Phone
                </label>

                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Note
                </label>

                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                />

                <button
                    type="button"
                    onClick={handleSave}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default EditContactPage