let contacts = [
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
];

let selectedContactId = "4";
let isEditMode = false;

// 2. DOM Elements
const searchInput = document.getElementById('search-input');
const listDataWrapper = document.getElementById('contacts-list-data');
const counterElement = document.getElementById('contacts-counter');
const addContactBtn = document.getElementById('add-contact-btn');

const panelTitle = document.getElementById('panel-title');
const detailInitials = document.getElementById('detail-initials');
const detailDate = document.getElementById('detail-date');

const viewActions = document.getElementById('view-actions');
const formActions = document.getElementById('form-actions');
const contactForm = document.getElementById('contact-form');

const idInput = document.getElementById('contact-id');
const phoneInput = document.getElementById('input-phone');
const emailInput = document.getElementById('input-email');
const noteInput = document.getElementById('input-note');

const errorEmail = document.getElementById('error-email');
const errorPhone = document.getElementById('error-phone');

const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const cancelBtn = document.getElementById('cancel-btn');

// 3. Helper Functions
function getInitials(name) {
  if (!name) return "??";
  const words = name.trim().split(' ').filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
  return words[0].charAt(0).toUpperCase();
}

function getAvatarClass(name) {
  if (!name) return 'av-mn';
  const words = name.trim().split(' ').filter(w => w.length > 0);
  let initials = '';
  if (words.length >= 2) {
    initials = (words[0].charAt(0) + words[1].charAt(0)).toLowerCase();
  } else if (words.length === 1) {
    initials = words[0].charAt(0).toLowerCase();
  }
  const validClasses = ['av-ab', 'av-ar', 'av-dk', 'av-mn', 'av-mo', 'av-sl'];
  return validClasses.includes(`av-${initials}`) ? `av-${initials}` : 'av-mn';
}

function getFormattedDate() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getDate()}`;
}

// 4. Render Contacts List (Left Side)
function renderContactsList() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.phone.toLowerCase().includes(query)
  );

  filtered.sort((a, b) => a.name.localeCompare(b.name));
  listDataWrapper.innerHTML = '';
  let grouped = {};

  filtered.forEach(contact => {
    const firstLetter = contact.name.trim().charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(contact);
  });

  Object.keys(grouped).sort().forEach(letter => {
    const section = document.createElement('section');
    section.className = 'group-section';

    const h2 = document.createElement('h2');
    h2.className = 'group-letter';
    h2.textContent = letter;
    section.appendChild(h2);

    const ul = document.createElement('ul');
    ul.className = 'contacts-list';

    grouped[letter].forEach(contact => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `contact-item ${contact.id === selectedContactId ? 'active' : ''}`;

      const avColor = getAvatarClass(contact.name);
      button.innerHTML = `
        <span class="avatar ${avColor}">${getInitials(contact.name)}</span>
        <span class="contact-info">
            <span class="name">${contact.name}</span>
            <span class="detail">${contact.phone || contact.email}</span>
        </span>
      `;

      button.addEventListener('click', () => {
        if (isEditMode) {
          if (!confirm("You have unsaved changes. Switch anyway?")) return;
        }
        selectedContactId = contact.id;
        switchMode(false);
        renderContactsList();
        renderDetails();
      });

      li.appendChild(button);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    listDataWrapper.appendChild(section);
  });

  if (counterElement) counterElement.textContent = `${contacts.length} saved`;
}

// 5. Details Panel (Right Side)
function renderDetails() {
  const contact = contacts.find(c => c.id === selectedContactId);
  clearErrors();

  if (!contact) {
    panelTitle.innerHTML = "Select a Contact";
    detailInitials.textContent = "??";
    detailDate.textContent = "No contact chosen";
    contactForm.reset();
    idInput.value = "";
    viewActions.style.display = 'none';
    return;
  }

  viewActions.style.display = 'flex';
  idInput.value = contact.id;
  phoneInput.value = contact.phone || "";
  emailInput.value = contact.email || "";
  noteInput.value = contact.note || "";

  panelTitle.innerHTML = contact.name;
  detailInitials.textContent = getInitials(contact.name);
  detailDate.innerHTML = `Added ${contact.dateAdded}`;
}

// 6. View / Form
function switchMode(editMode, isNew = false) {
  isEditMode = editMode;

  viewActions.style.display = editMode ? 'none' : 'flex';
  formActions.style.display = editMode ? 'flex' : 'none';

  const inputs = [phoneInput, emailInput, noteInput];
  inputs.forEach(input => {
    if (editMode) {
      input.removeAttribute('readonly');
      input.style.border = "1px solid #cbd5e1";
      input.style.borderRadius = "6px";
      input.style.padding = "6px 10px";
      input.style.background = "#ffffff";
    } else {
      input.setAttribute('readonly', true);
      input.style.border = "none";
      input.style.padding = "0";
      input.style.background = "transparent";
    }
  });

  if (editMode) {
    const currentContact = contacts.find(c => c.id === selectedContactId);
    const placeholderName = isNew ? "" : (currentContact?.name || "");

    panelTitle.innerHTML = `
      <input type="text" id="input-name" value="${placeholderName}" placeholder="Enter name *" style="font-size: 24px; font-weight: 700; width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; outline: none; color: var(--text-main);">
      <span class="error-message" id="error-name" style="color: var(--danger-color); font-size: 12px; font-weight: 600; display: none; margin-top: 4px;">Name is required.</span>
    `;

    if (isNew) {
      contactForm.reset();
      idInput.value = "";
      detailInitials.textContent = "??";
      detailDate.textContent = "New contact creation";
    }
  } else {
    const contact = contacts.find(c => c.id === selectedContactId);
    if (contact) {
      panelTitle.innerHTML = contact.name;
    }
  }
}

// 7. Inline validation (Name, Phone, Email)
function validateInputs() {
  let isValid = true;

  const nameInputInHeader = document.getElementById('input-name');
  const errorNameInHeader = document.getElementById('error-name');

  if (errorNameInHeader) errorNameInHeader.style.display = "none";
  if (errorPhone) errorPhone.style.display = "none";
  errorEmail.style.display = "none";

  if (nameInputInHeader) nameInputInHeader.style.borderColor = "#cbd5e1";
  phoneInput.style.borderColor = "#cbd5e1";
  emailInput.style.borderColor = "#cbd5e1";

  if (nameInputInHeader && !nameInputInHeader.value.trim()) {
    errorNameInHeader.style.display = "block";
    nameInputInHeader.style.borderColor = "var(--danger-color)";
    isValid = false;
  }

  const phoneValue = phoneInput.value.trim();
  const phoneRegex = /^[+\s()0-9.-]+$/;

  if (!phoneValue) {
    if (errorPhone) {
      errorPhone.textContent = "Phone number is required.";
      errorPhone.style.display = "block";
    }
    phoneInput.style.borderColor = "var(--danger-color)";
    isValid = false;
  } else if (!phoneRegex.test(phoneValue) || phoneValue.replace(/[^0-9]/g, '').length < 7) {
    if (errorPhone) {
      errorPhone.textContent = "Invalid phone format (min 7 digits).";
      errorPhone.style.display = "block";
    }
    phoneInput.style.borderColor = "var(--danger-color)";
    isValid = false;
  }

  const emailValue = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValue) {
    errorEmail.textContent = "Email is required.";
    errorEmail.style.display = "block";
    emailInput.style.borderColor = "var(--danger-color)";
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    errorEmail.textContent = "Invalid email format.";
    errorEmail.style.display = "block";
    emailInput.style.borderColor = "var(--danger-color)";
    isValid = false;
  }

  return isValid;
}

function clearErrors() {
  errorEmail.style.display = "none";
  if (errorPhone) errorPhone.style.display = "none";
  emailInput.style.borderColor = "#cbd5e1";
  phoneInput.style.borderColor = "#cbd5e1";
}

emailInput.addEventListener('input', () => { if (emailInput.value.trim()) clearErrors(); });
phoneInput.addEventListener('input', () => { if (phoneInput.value.trim()) clearErrors(); });

// 8. CRUD
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateInputs()) return;

  const nameInputInHeader = document.getElementById('input-name');
  const currentId = idInput.value;

  const contactData = {
    name: nameInputInHeader.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    note: noteInput.value.trim() || "—"
  };

  if (currentId) {
    contacts = contacts.map(c => c.id === currentId ? { ...c, ...contactData } : c);
  } else {
    const newId = Date.now().toString();
    const newContact = {
      id: newId,
      ...contactData,
      dateAdded: getFormattedDate()
    };
    contacts.push(newContact);
    selectedContactId = newId;
  }

  switchMode(false);
  renderContactsList();
  renderDetails();
});

if (searchInput) {
  searchInput.addEventListener('input', renderContactsList);
}

addContactBtn.addEventListener('click', () => switchMode(true, true));
editBtn.addEventListener('click', () => switchMode(true, false));

cancelBtn.addEventListener('click', () => {
  clearErrors();
  switchMode(false);
  renderDetails();
});

deleteBtn.addEventListener('click', () => {
  if (!selectedContactId) return;

  if (confirm("Are you sure you want to delete this contact?")) {
    contacts = contacts.filter(c => c.id !== selectedContactId);
    selectedContactId = contacts.length > 0 ? contacts[0].id : null;

    switchMode(false);
    renderContactsList();
    renderDetails();
  }
});

renderContactsList();
renderDetails();