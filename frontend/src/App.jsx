import { Navigate, Route, Routes } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import SignUpPage from "./pages/auth/signUpPage"
import LoginPage from "./pages/auth/LoginPage"
import { Toaster } from 'react-hot-toast'
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/Profile/ProfilePage"

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if(data.error) return null
        if(!res.ok) throw new Error(data.error || "Something went Wrong")
        return data
      } catch (error) {
        console.error("Error in AuthUser Querry FE:",error)
      }
    },
    retry:false,
  })

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      {authUser && <Sidebar />}
      <Routes >
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
