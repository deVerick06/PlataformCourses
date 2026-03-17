import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import CourseDetails from './components/CourseDetails/CourseDetails'
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import CreateCourse from './components/CreateCourse/CreateCourse'
import Signup from './components/Signup/Signup'
import AddVideo from './components/AddVideo/AddVideo'
import Plans from './components/Plans/Plans'
import Dashboard from './components/Dashboard/Dashboard'
import Navbar from './components/Navbar/Navbar'
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
              <Navbar>
              <Home />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/:id'
          element={
            <ProtectedRoute>
              <Navbar>
              <CourseDetails />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/:id/add-video'
          element={
            <ProtectedRoute>
              <Navbar>
              <AddVideo />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/plans'
          element={
            <ProtectedRoute>
              <Navbar>
              <Plans />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/my-dashboard'
          element={
            <ProtectedRoute>
              <Navbar>
              <Dashboard />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/assistir/:video_id'
          element={
            <ProtectedRoute>
              <Navbar>
              <VideoPlayer />
              </Navbar>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/courses/add'
          element={
            <ProtectedRoute>
              <Navbar>
              <CreateCourse />
              </Navbar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App