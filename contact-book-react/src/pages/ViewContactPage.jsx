import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import "../App.css";

function getInitials(name) {
    if (!name) return "??";

    const words = name.trim().split(/\s+/);

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

function ViewContactPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { contacts, setContacts } = useOutletContext();

    const contact = contacts.find((contact) => contact.id === id);

    if (!contact) {
        return (
            <main className="main-content">
                <div className="empty-state">
                    <h2>Contact not found</h2>

                    <p>The contact you are trying to view does not exist.</p>

                    <button
                        type="button"
                        className="btn-edit"
                        onClick={() => navigate("/contacts")}
                    >
                        Back to contacts
                    </button>
                </div>
            </main>
        );
    }

    function handleEdit() {
        navigate(`/contacts/${id}/edit`);
    }

    function handleDelete() {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this contact?",
        );

        if (!shouldDelete) return;

        setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== id),
        );

        navigate("/contacts");
    }

    return (
        <main className="main-content">
            <header className="profile-header">
                <div className="profile-summary">
                    <div
                        className={`avatar-large ${getAvatarClass(contact.name)}`}
                        aria-hidden="true"
                    >
                        {getInitials(contact.name)}
                    </div>

                    <div className="profile-title">
                        <h2>{contact.name}</h2>

                        <p className="timestamp">{contact.dateAdded}</p>
                    </div>
                </div>

                <div className="action-buttons" id="view-actions">
                    <button type="button" className="btn-edit" onClick={handleEdit}>
                        Edit
                    </button>

                    <button type="button" className="btn-delete" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </header>

            <div className="contact-form">
                <dl className="details-grid">
                    <div className="table-row">
                        <dt className="label">PHONE</dt>

                        <dd className="value value-phone">
                            <input
                                type="text"
                                className="contact-field"
                                value={contact.phone || ""}
                                readOnly
                            />
                        </dd>
                    </div>

                    <div className="table-row">
                        <dt className="label">EMAIL</dt>

                        <dd className="value value-email">
                            <input
                                type="email"
                                className="contact-field"
                                value={contact.email || ""}
                                readOnly
                            />
                        </dd>
                    </div>

                    <div className="table-row">
                        <dt className="label">NOTE</dt>

                        <dd className="value value-note">
                            <textarea
                                className="contact-field contact-note"
                                value={contact.note || ""}
                                readOnly
                            />
                        </dd>
                    </div>
                </dl>
            </div>
        </main>
    );
}

export default ViewContactPage;