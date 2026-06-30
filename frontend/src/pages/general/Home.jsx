import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [authPanel, setAuthPanel] = useState(null)
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')

  useEffect(() => {
    axios.get("http://localhost:3000/api/food", { withCredentials: true })
      .then(response => {
        setVideos(response.data.foodItems)
      })
      .catch(() => { /* noop: optionally handle error */ })
  }, [])

  async function likeVideo(item) {
    const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true })

    if (response.data.like) {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
    } else {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
    }
  }

  async function saveVideo(item) {
    const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

    if (response.data.save) {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
    } else {
      setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
    }
  }

  const openAuthPanel = (type) => {
    setAuthPanel(type)
    setAuthForm({ email: '', password: '' })
    setAuthError('')
    setAuthMessage('')
  }

  const navigate = useNavigate()

  const closeAuthPanel = () => {
    setAuthPanel(null)
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setAuthForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthMessage('')

    try {
      const endpoint = authPanel === 'partner'
        ? "http://localhost:3000/api/auth/food-partner/login"
        : "http://localhost:3000/api/auth/user/login"

      const response = await axios.post(endpoint, {
        email: authForm.email,
        password: authForm.password,
      }, { withCredentials: true })

      setAuthMessage(`Successfully logged in as ${authPanel === 'partner' ? 'food partner' : 'user'}.`)
      closeAuthPanel()
      if (authPanel === 'partner') {
        navigate('/create-food')
      } else {
        navigate('/')
      }
      console.log(response.data)
    } catch (error) {
      setAuthError(error?.response?.data?.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div>
          <div className="home-navbar__brand">Food View</div>
          <div className="home-navbar__subtitle"></div>
        </div>
        <div className="home-navbar__actions">
          <button type="button" className="home-navbar__button" onClick={() => openAuthPanel('user')}>
            {/* <span aria-hidden="true">User</span> */}
            User Login
          </button>
          <button type="button" className="home-navbar__button home-navbar__button--partner" onClick={() => openAuthPanel('partner')}>
            
            Partner Login
          </button>
        </div>
      </header>

      {authPanel && (
        <div className="auth-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-panel-title">
          <div className="auth-modal">
            <button type="button" className="auth-modal__close" onClick={closeAuthPanel} aria-label="Close auth form">�</button>
            <h2 id="auth-panel-title">{authPanel === 'partner' ? 'Food Partner Login' : 'User Login'}</h2>
            <p className="auth-modal__description">Login directly on the home page without using route navigation.</p>
            {authError && <div className="auth-modal__error">{authError}</div>}
            {authMessage && <div className="auth-modal__success">{authMessage}</div>}
            <form className="auth-modal__form" onSubmit={handleAuthSubmit} noValidate>
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="you@example.com"
                required
              />
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="��������"
                required
              />
              <button className="auth-modal__submit" type="submit">Login</button>
            </form>
            <div className="auth-modal__alt">
              Not registered yet?{' '}
              <button
                type="button"
                className="auth-modal__link"
                onClick={() => {
                  const registerPath = authPanel === 'partner' ? '/food-partner/register' : '/user/register'
                  closeAuthPanel()
                  navigate(registerPath)
                }}
              >
                Register here
              </button>
            </div>
          </div>
        </div>
      )}

      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
      />
    </div>
  )
}

export default Home
