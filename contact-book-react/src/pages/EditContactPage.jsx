import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import "../App.css";

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

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, "");

    return digits.length >= 7 && digits.length <= 15;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function EditContactPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { contacts, setContacts } = useOutletContext();

    const contact = contacts.find((contact) => contact.id === id);

    const [formData, setFormData] = useState({
        name: contact?.name || "",
        phone: contact?.phone || "",
        email: contact?.email || "",
        note: contact?.note || "",
    });

    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");

    function clearErrors() {
        setNameError("");
        setPhoneError("");
        setEmailError("");
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        if (name === "name") {
            if (!value.trim()) {
                setNameError("Name is required");
            } else {
                setNameError("");
            }
        }

        if (name === "phone") {
            if (!value.trim()) {
                setPhoneError("Phone is required");
            } else if (!isValidPhone(value.trim())) {
                setPhoneError("Enter a valid phone number");
            } else {
                setPhoneError("");
            }
        }

        if (name === "email") {
            if (value.trim() && !isValidEmail(value.trim())) {
                setEmailError("Enter a valid email address");
            } else {
                setEmailError("");
            }
        }
    }

    async function handleSave(event) {
        event.preventDefault();

        clearErrors();

        let hasError = false;

        // Перевірка Name
        if (!formData.name.trim()) {
            setNameError("Name is required");
            hasError = true;
        } else {
            setNameError("");
        }

        // Перевірка Phone
        if (!formData.phone.trim()) {
            setPhoneError("Phone is required");
            hasError = true;
        } else if (!isValidPhone(formData.phone.trim())) {
            setPhoneError("Enter a valid phone number");
            hasError = true;
        } else {
            setPhoneError("");
        }

        // Перевірка Email
        if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
            setEmailError("Enter a valid email address");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (hasError) {
            return;
        }

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        phone: formData.phone.trim(),
                        email: formData.email.trim(),
                        note: formData.note.trim(),
                    }),
                },
            );

            const user = await response.json();

            const updatedContact = {
                id: user.id.toString(),
                name: user.name,
                phone: user.phone,
                email: user.email,
                note: user.note || "",
                dateAdded: contact.dateAdded,
            };

            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.id === id ? updatedContact : contact,
                ),
            );

            clearErrors();

            navigate(`/contacts/${id}`);
        } catch (error) {
            console.error("Failed to update contact:", error);
        }
    }

    function handleCancel() {
        clearErrors()
        navigate(`/contacts/${id}`);
    }

    if (!contact) {
        return (
            <main className="main-content">
                <div className="empty-state">
                    <h2>Contact not found</h2>

                    <p>The contact you are trying to edit does not exist.</p>

                    <button type="button" className="btn-edit" onClick={handleCancel}>
                        Back to contacts
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">
            <header className="profile-header">
                <div className="profile-summary">
                    <div
                        className={`avatar-large ${getAvatarClass(formData.name)}`}
                        aria-hidden="true"
                    >
                        {formData.name
                            ? formData.name
                                .trim()
                                .split(/\s+/)
                                .map((word) => word.charAt(0))
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()
                            : "??"}
                    </div>

                    <div className="profile-title">
                        <input
                            type="text"
                            name="name"
                            className="profile-name-input"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        {nameError && (
                            <span className="error-message error-message-visible">
                                {nameError}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <form className="contact-form" noValidate onSubmit={handleSave}>
                <dl className="details-grid">
                    <div className="table-row">
                        <dt className="label">PHONE</dt>

                        <dd className="value value-phone">
                            <input
                                type="text"
                                name="phone"
                                className="contact-field"
                                value={formData.phone}
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
                        <dt className="label">EMAIL</dt>

                        <dd className="value value-email">
                            <input
                                type="email"
                                name="email"
                                className="contact-field"
                                value={formData.email}
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
                        <dt className="label">NOTE</dt>

                        <dd className="value value-note">
                            <textarea
                                name="note"
                                className="contact-field contact-note"
                                value={formData.note}
                                onChange={handleChange}
                            />
                        </dd>
                    </div>
                </dl>

                <div className="action-buttons form-actions form-actions-visible">
                    <button type="submit" className="btn-save">
                        Save
                    </button>

                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}

export default EditContactPage;