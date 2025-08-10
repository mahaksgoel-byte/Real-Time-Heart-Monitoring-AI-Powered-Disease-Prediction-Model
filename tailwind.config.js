"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, BarChart3, Calendar, Shield, MessageCircle, Menu, User } from "lucide-react"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [currentNewsSlide, setCurrentNewsSlide] = useState(0)
  const [dailyTip, setDailyTip] = useState("")

  const tips = [
    "Take a 10-minute walk after dinner to boost circulation! 🚶‍♂️",
    "Eat a handful of nuts daily for heart-healthy fats. 🥜",
    "Practice deep breathing for 5 minutes to reduce stress. 🧘",
    "Drink 8 glasses of water today to stay hydrated. 💧",
    "Swap salt with herbs to lower sodium intake. 🌿",
  ]

  const newsItems = [
    {
      title: "Exercise Boosts Heart Health 🏃‍♂️",
      description: "A 2025 study confirms 150 minutes of weekly exercise cuts heart disease risk by 20%.",
      link: "https://www.heart.org/en/news",
    },
    {
      title: "Wearable Tech Advances ⌚",
      description: "New devices detect heart irregularities with 95% accuracy, aiding early intervention.",
      link: "https://www.heart.org/en/news",
    },
    {
      title: "Diet and Heart Health 🥗",
      description: "Plant-based diets linked to 25% lower heart disease risk in 2025 trials.",
      link: "https://www.heart.org/en/news",
    },
  ]

  useEffect(() => {
    setDailyTip(tips[Math.floor(Math.random() * tips.length)])

    const interval = setInterval(() => {
      setCurrentNewsSlide((prev) => (prev + 1) % newsItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const refreshTip = () => {
    setDailyTip(tips[Math.floor(Math.random() * tips.length)])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-red-600 to-red-400 text-white transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Heart className="mr-2 animate-pulse" /> HeartCare
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-gray-200">
            ×
          </button>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <Link href="/" className="flex items-center p-2 bg-white bg-opacity-20 rounded-lg">
            <Heart className="mr-2 w-5 h-5" /> Home
          </Link>
          <Link href="/checkins" className="flex items-center p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <Calendar className="mr-2 w-5 h-5" /> Daily Check-ins
          </Link>
          <Link href="/prediction" className="flex items-center p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <Heart className="mr-2 w-5 h-5" /> Prediction
          </Link>
          <Link href="/results" className="flex items-center p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <BarChart3 className="mr-2 w-5 h-5" /> Results
          </Link>
          <Link href="/preventions" className="flex items-center p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <Shield className="mr-2 w-5 h-5" /> Preventions
          </Link>
          <Link href="/chatbot" className="flex items-center p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
            <MessageCircle className="mr-2 w-5 h-5" /> Chatbot
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white text-red-600 p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-2xl">
            <Menu />
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <Heart className="mr-2" /> HeartCare
          </h1>
          <div className="relative">
            <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="text-2xl">
              <User />
            </button>
            {userDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64">
                <h3 className="text-lg font-bold mb-2">User Profile</h3>
                <p className="text-sm mb-1">Username: Demo User</p>
                <p className="text-sm mb-4">Email: demo@heartcare.com</p>
                <button className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 w-full">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600 to-red-400 text-white py-12 px-6 m-4 rounded-lg shadow-lg text-center">
          <h2 className="text-4xl font-bold mb-4">Your Heart, Our Mission</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Discover AI-powered tools to monitor, predict, and prevent cardiovascular disease with HeartCare.
          </p>
          <Link
            href="/prediction"
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 inline-flex items-center"
          >
            Take Control Now <span className="ml-2">→</span>
          </Link>
        </section>

        {/* Dashboard Preview */}
        <section className="container mx-auto mt-12 px-4">
          <h2 className="text-3xl font-semibold text-red-600 mb-6 flex items-center">
            <BarChart3 className="mr-2" /> Your Heart Health at a Glance
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Heart className="text-red-600 w-12 h-12 mx-auto mb-2" />
              <p className="text-2xl font-bold">72</p>
              <p className="text-gray-700">Heart Rate (BPM)</p>
            </div>
            <div className="text-center">
              <BarChart3 className="text-red-600 w-12 h-12 mx-auto mb-2" />
              <p className="text-2xl font-bold">120/80</p>
              <p className="text-gray-700">Blood Pressure</p>
            </div>
            <div className="text-center">
              <Shield className="text-red-600 w-12 h-12 mx-auto mb-2" />
              <p className="text-2xl font-bold">15%</p>
              <p className="text-gray-700">CVD Risk</p>
            </div>
          </div>
        </section>

        {/* Daily Heart Tip */}
        <section className="container mx-auto mt-12 px-4">
          <h2 className="text-3xl font-semibold text-red-600 mb-6 flex items-center">💡 Daily Heart Tip</h2>
          <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-between">
            <p className="text-gray-700 text-lg flex-1">{dailyTip}</p>
            <button
              onClick={refreshTip}
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition ml-4"
            >
              🔄
            </button>
          </div>
        </section>

        {/* News Carousel */}
        <section className="container mx-auto mt-12 px-4">
          <h2 className="text-3xl font-semibold text-red-600 mb-6 flex items-center">📰 Heart Health News</h2>
          <div className="relative overflow-hidden bg-white rounded-lg shadow-md">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentNewsSlide * 100}%)` }}
            >
              {newsItems.map((item, index) => (
                <div key={index} className="min-w-full p-6">
                  <h3 className="text-xl font-bold text-red-600 mb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <a href={item.link} className="text-red-600 hover:underline">
                    Read More
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentNewsSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length)}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentNewsSlide((prev) => (prev + 1) % newsItems.length)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-red-600 text-white p-8 mt-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">HeartCare</h3>
              <p className="text-sm">Empowering you to live a heart-healthy life with AI-driven insights.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-200">
                  Twitter
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  Facebook
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  Instagram
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <div className="flex">
                <input type="email" placeholder="Enter your email" className="p-2 rounded-l-lg flex-1 text-gray-800" />
                <button className="bg-white text-red-600 p-2 rounded-r-lg hover:bg-gray-100">Subscribe</button>
              </div>
            </div>
          </div>
          <p className="text-center mt-6 text-sm">© 2025 HeartCare. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
