import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import CourseDetails from './components/CourseDetails'
import VideoPlayer from './components/VideoPlayer'
import CreateCourse from './components/CreateCourse'
import Signup from './components/Signup'
import AddVideo from './components/AddVideo'
import './index.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route 
          path='/home' 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/:id'
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/:id/add-video'
          element={
            <ProtectedRoute>
              <AddVideo />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/assistir/:video_id'
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/add'
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App