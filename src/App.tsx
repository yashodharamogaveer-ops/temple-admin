import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import TempleProfile from '@/pages/TempleProfile'
import Sevas from '@/pages/Sevas'
import Media from '@/pages/Media'
import History from '@/pages/History'
import EventsPage from '@/pages/Events'
import Notifications from '@/pages/Notifications'
import Committee from '@/pages/Committee'
import AdminUsers from '@/pages/AdminUsers'
import TempleManagementSystem from '@/pages/TempleManagementSystem'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/temple-profile" element={<TempleProfile />} />
        <Route path="/sevas" element={<Sevas />} />
        <Route path="/media" element={<Media />} />
        <Route path="/history" element={<History />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/temple-management-system" element={<TempleManagementSystem />} />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute requireSuperAdmin>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
