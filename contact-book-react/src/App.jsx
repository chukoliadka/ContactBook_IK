import { Routes, Route, Navigate } from "react-router-dom";
import ContactsLayout from "./layouts/ContactsLayout";
import ContactsPage from "./pages/ContactsPage";
import ViewContactPage from "./pages/ViewContactPage";
import AddContactPage from "./pages/AddContactPage";
import EditContactPage from "./pages/EditContactPage";

function App() {
  return (
    <Routes>
      <Route path="/contacts" element={<ContactsLayout />}>
        <Route index element={<ContactsPage />} />

        <Route path=":id" element={<ViewContactPage />} />

        <Route path="create" element={<AddContactPage />} />

        <Route path=":id/edit" element={<EditContactPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/contacts" replace />} />
    </Routes>
  );
}

export default App;