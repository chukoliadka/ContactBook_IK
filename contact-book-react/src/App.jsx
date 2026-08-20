import { Routes, Route, Navigate } from 'react-router-dom'
import ContactsPage from './pages/ContactsPage'
import EditContactPage from './pages/EditContactPage'

function App() {
  return (
    <Routes>

      <Route
        path="/contacts"
        element={<ContactsPage />}
      />

      <Route
        path="/contacts/:id/edit"
        element={<EditContactPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/contacts" replace />}
      />

    </Routes>
  )
}

export default App