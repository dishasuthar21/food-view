import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
    }, [id])

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <img
                        className="profile-avatar"
                        src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"
                        alt="Food partner avatar"
                    />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name || 'Partner profile'}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address || 'No address provided'}
                        </p>
                        <p className="profile-pill profile-id" title="Partner ID">
                            Partner ID: {profile?._id || id}
                        </p>
                        <Link to="/" className="profile-home-link">Back to Home</Link>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals ?? 0}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed ?? 0}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v._id || v.id} className="profile-grid-item">
                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video}
                            muted
                        />
                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile