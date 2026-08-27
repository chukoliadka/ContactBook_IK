import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, "");

    return digits.length >= 7 && digits.length <= 15;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function AddContactPage() {
    const navigate = useNavigate();
    const { setContacts } = useOutletContext();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        note: "",
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

    function handleSave(event) {
        event.preventDefault();

        clearErrors();

        let hasError = false;

        // Name
        if (!formData.name.trim()) {
            setNameError("Name is required");
            hasError = true;
        }

        // Phone
        if (!formData.phone.trim()) {
            setPhoneError("Phone is required");
            hasError = true;
        } else if (!isValidPhone(formData.phone.trim())) {
            setPhoneError("Enter a valid phone number");
            hasError = true;
        }

        // Email
        if (formData.email.trim() && !isValidEmail(formData.email.trim())) {
            setEmailError("Enter a valid email address");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const newContact = {
            id: crypto.randomUUID(),
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            note: formData.note.trim(),
            dateAdded: "Today",
        };

        setContacts((prevContacts) => [...prevContacts, newContact]);

        clearErrors();

        navigate(`/contacts/${newContact.id}`);
    }

    function handleCancel() {
        clearErrors();
        navigate("/contacts");
    }

    return (
        <main className="main-content">
            <header className="profile-header">
                <div className="profile-summary">
                    <div
                        className={`avatar-large ${getAvatarClass(formData.name)}`}
                        aria-hidden="true"
                    >
                        {getInitials(formData.name)}
                    </div>

                    <div className="profile-title">
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

export default AddContactPage;