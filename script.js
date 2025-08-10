document.addEventListener("DOMContentLoaded", () => {
  // API Configuration
  const API_BASE_URL = "http://localhost:5000"
  const GEMINI_API_KEY = "AIzaSyC8X2eC9W3si9BkhR0LzF9GcUmHDt1q7Jw" // Replace with your actual Gemini API key
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

  // Reusable toast notification
  function showToast(message, isError = false) {
    const toast = document.getElementById("toast")
    const toastMessage = document.getElementById("toastMessage")
    if (toast && toastMessage) {
      toastMessage.textContent = message
      toast.classList.remove("hidden", isError ? "bg-green-600" : "bg-red-600")
      toast.classList.add(isError ? "bg-red-600" : "bg-green-600")
      toast.classList.add("translate-y-0")
      setTimeout(() => {
        toast.classList.add("hidden")
        toast.classList.remove("translate-y-0")
      }, 3000)
    }
  }

  // Sidebar toggle
  const sidebar = document.getElementById("sidebar")
  const toggleSidebar = document.getElementById("toggleSidebar")
  const closeSidebar = document.getElementById("closeSidebar")
  const sidebarArrow = document.querySelector(".sidebar-arrow")
  const mainContent = document.getElementById("mainContent")

  function toggleSidebarVisibility() {
    if (sidebar && sidebarArrow && mainContent) {
      const isVisible = sidebar.classList.contains("sidebar-visible")
      sidebar.classList.toggle("sidebar-hidden", isVisible)
      sidebar.classList.toggle("sidebar-visible", !isVisible)
      sidebarArrow.classList.toggle("fa-chevron-left", !isVisible)
      sidebarArrow.classList.toggle("fa-chevron-right", isVisible)
      if (window.innerWidth < 1024) {
        mainContent.classList.toggle("ml-64", !isVisible)
        mainContent.classList.toggle("ml-0", isVisible)
      }
    }
  }

  if (toggleSidebar) toggleSidebar.addEventListener("click", toggleSidebarVisibility)
  if (closeSidebar) closeSidebar.addEventListener("click", toggleSidebarVisibility)

  window.addEventListener("resize", () => {
    if (sidebar && sidebarArrow && mainContent) {
      if (window.innerWidth >= 1024) {
        sidebar.classList.remove("sidebar-hidden")
        sidebar.classList.add("sidebar-visible")
        sidebarArrow.classList.add("fa-chevron-left")
        sidebarArrow.classList.remove("fa-chevron-right")
        mainContent.classList.add("lg:ml-64")
        mainContent.classList.remove("ml-0", "ml-64")
      } else {
        sidebar.classList.add("sidebar-hidden")
        sidebar.classList.remove("sidebar-visible")
        sidebarArrow.classList.add("fa-chevron-right")
        sidebarArrow.classList.remove("fa-chevron-left")
        mainContent.classList.remove("lg:ml-64", "ml-64")
        mainContent.classList.add("ml-0")
      }
    }
  })

  // User Profile Dropdown
  const userProfile = document.getElementById("userProfile")
  const userInfoDropdown = document.getElementById("userInfoDropdown")
  const userNameDisplay = document.getElementById("userNameDisplay")
  const userEmailDisplay = document.getElementById("userEmailDisplay")
  const logoutButton = document.getElementById("logoutButton")

  if (userProfile && userInfoDropdown && userNameDisplay && userEmailDisplay) {
    userProfile.addEventListener("click", () => {
      if (!localStorage.getItem("isLoggedIn")) {
        window.location.href = "login.html"
        return
      }
      userInfoDropdown.classList.toggle("hidden")
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      userNameDisplay.textContent = `Username: ${user.username || "N/A"}`
      userEmailDisplay.textContent = `Email: ${user.email || "N/A"}`
    })
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("user")
      window.location.href = "login.html"
    })
  }

  // Audio toggle for signup and login pages
  const backgroundAudio = document.getElementById("backgroundAudio")
  const toggleSoundButton = document.getElementById("toggleSound")

  if (backgroundAudio && toggleSoundButton) {
    toggleSoundButton.innerHTML = '<i class="fa-solid fa-volume-mute"></i>'
    toggleSoundButton.addEventListener("click", () => {
      if (backgroundAudio.paused) {
        backgroundAudio
          .play()
          .then(() => {
            toggleSoundButton.innerHTML = '<i class="fa-solid fa-volume-up"></i>'
          })
          .catch((error) => {
            console.error("Audio playback failed:", error.message)
            toggleSoundButton.innerHTML = '<i class="fa-solid fa-volume-mute"></i>'
            showToast("Failed to play audio. Interact with the page first.", true)
          })
      } else {
        backgroundAudio.pause()
        backgroundAudio.currentTime = 0
        toggleSoundButton.innerHTML = '<i class="fa-solid fa-volume-mute"></i>'
      }
    })
  }

  // Daily Heart Tip
  const dailyTip = document.getElementById("dailyTip")
  const refreshTip = document.getElementById("refreshTip")
  const tips = [
    "Take a 10-minute walk after dinner to boost circulation! 🚶‍♂️",
    "Eat a handful of nuts daily for heart-healthy fats. 🥜",
    "Practice deep breathing for 5 minutes to reduce stress. 🧘",
    "Drink 8 glasses of water today to stay hydrated. 💧",
    "Swap salt with herbs to lower sodium intake. 🌿",
    "Add one green veggie to every meal today. 🥦",
    "Get 15 minutes of sunlight to boost vitamin D. ☀️",
    "Aim for 7–9 hours of sleep tonight — your body needs it! 💤",
    "Start your day with a glass of warm lemon water. 🍋",
    "Unplug from screens 1 hour before bed for better sleep. 📵",
    "Try biking instead of driving for short trips. 🚴",
    "Snack on berries for a burst of antioxidants. 🍓",
    "Taste your food before adding extra salt. 🧂",
    "Write down 3 things you are grateful for today. 😌",
    "Make half your plate veggies at lunch and dinner. 🥗",
    "Dance to your favorite song for 3 minutes of cardio fun! 💃",
    "Try a cold shower for a natural energy boost. 🧊",
    "Wash your hands often — your immune system will thank you! 🧼",
    "Replace one coffee with green tea today. 🍵",
    "Do a brain teaser or puzzle to keep your mind sharp. 🧠",
    "Wear sunscreen even on cloudy days — protect your skin! 🧴",
    "Try a new colorful fruit or veggie today. 🍠",
    "Declutter one small space — tidy home, tidy mind. 🧹",
    "Skip sugary drinks — try infused water with mint and lemon. 🧃",
    "Take 5 deep breaths before reacting to stress. 🌬️",
    "Call a friend instead of texting — real connection matters. 💬",
    "Go for a nature walk and notice 5 things you see/hear. 🥾",
    "Add a source of protein to your breakfast. 🥚",
    "Read 10 pages of a book before bed. 📖",
    "Go salt-free for one meal and savor natural flavors. 🧂",
    "Get up and stretch every hour if you sit a lot. 🪑",
    "Walk barefoot on grass or sand to ground yourself. 👣",
    "Limit processed frozen meals — cook fresh when you can. 🥶",
    "Make your own smoothie with greens and fruit. 🧃",
    "Set a hydration reminder on your phone. 📱",
    "Take 10 minutes to do a light chore — movement counts! 🧺",
    "Meditate for 2 minutes before bed for deeper sleep. 🌙",
    "Swap full-fat dairy with low-fat versions. 🧀",
    "Add chia or flaxseeds to your yogurt or smoothie. 🫐",
    "End your shower with 30 seconds of cold water. 🚿",
    "Drink chamomile tea before bed to relax. 🫖",
    "Say one kind thing to yourself in the mirror today. 🪞",
    "Listen to calming music while working or studying. 🎧",
    "Try a meatless meal once this week — plant power! 🌱",
    "Add omega-3 rich fish like salmon to your weekly menu. 🐟",
    "Do 20 jumping jacks to get your blood flowing. 🏃",
    "Eat mindfully — slow down and enjoy each bite. 🍽️",
    "Avoid eating 2 hours before bedtime for better digestion. 🚫",
    "Replace candy with dried fruit or dark chocolate. 🍬",
    "Make your plate colorful — more colors = more nutrients! 🌈",
  ]

  function setRandomTip() {
    if (dailyTip) {
      dailyTip.textContent = tips[Math.floor(Math.random() * tips.length)]
    }
  }

  if (refreshTip && dailyTip) {
    setRandomTip()
    refreshTip.addEventListener("click", setRandomTip)
  }

  // News Carousel
  const newsCarousel = document.getElementById("newsCarousel")
  const prevNews = document.getElementById("prevNews")
  const nextNews = document.getElementById("nextNews")
  let currentSlide = 0
  let autoSlideInterval
  const totalSlides = 25

  function updateCarousel() {
    if (newsCarousel) {
      newsCarousel.style.transform = `translateX(-${currentSlide * 100}%)`
    }
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides
      updateCarousel()
    }, 5000)
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval)
  }

  if (nextNews && prevNews && newsCarousel) {
    nextNews.addEventListener("click", () => {
      stopAutoSlide()
      currentSlide = (currentSlide + 1) % totalSlides
      updateCarousel()
      startAutoSlide()
    })

    prevNews.addEventListener("click", () => {
      stopAutoSlide()
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
      updateCarousel()
      startAutoSlide()
    })

    startAutoSlide()
  }

  // Counter Animation
  const counters = document.querySelectorAll(".heart-counter")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = counter.dataset.count
          let start = 0
          const isPercentage = target.includes("%")
          const isBloodPressure = target.includes("/")
          const duration = 2000
          const increment = isBloodPressure ? 1 : Number.parseFloat(target) / (duration / 16)

          const updateCounter = () => {
            if (isBloodPressure) {
              const [sys, dia] = target.split("/")
              const sysStart = Number.parseInt(counter.textContent.split("/")[0]) || 0
              const diaStart = Number.parseInt(counter.textContent.split("/")[1]) || 0
              if (sysStart < sys || diaStart < dia) {
                counter.textContent = `${Math.min(sysStart + 1, sys)}/${Math.min(diaStart + 1, dia)}`
                requestAnimationFrame(updateCounter)
              }
            } else {
              start += increment
              if (start < Number.parseFloat(target)) {
                counter.textContent = isPercentage ? `${Math.floor(start)}%` : Math.floor(start)
                requestAnimationFrame(updateCounter)
              } else {
                counter.textContent = target
              }
            }
          }

          updateCounter()
          observer.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => observer.observe(counter))

  // 3D Tilt Effect
  const tiltCards = document.querySelectorAll(".tilt-card")
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const tiltX = (centerY - y) / 20
      const tiltY = (x - centerX) / 20
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    })
  })

  // Signup form validation
  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    const usernameInput = document.getElementById("username")
    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirmPassword")
    const signupButton = document.getElementById("signupButton")
    const signupText = document.getElementById("signupText")
    const signupSpinner = document.getElementById("signupSpinner")
    const usernameError = document.getElementById("usernameError")
    const emailError = document.getElementById("emailError")
    const passwordError = document.getElementById("passwordError")
    const confirmPasswordError = document.getElementById("confirmPasswordError")

    if (
      usernameInput &&
      emailInput &&
      passwordInput &&
      confirmPasswordInput &&
      signupButton &&
      signupText &&
      signupSpinner &&
      usernameError &&
      emailError &&
      passwordError &&
      confirmPasswordError
    ) {
      signupForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const username = usernameInput.value.trim()
        const email = emailInput.value.trim()
        const password = passwordInput.value
        const confirmPassword = confirmPasswordInput.value

        usernameError.classList.add("hidden")
        emailError.classList.add("hidden")
        passwordError.classList.add("hidden")
        confirmPasswordError.classList.add("hidden")

        let isValid = true

        if (username.length < 3) {
          usernameError.textContent = "Username must be at least 3 characters long."
          usernameError.classList.remove("hidden")
          isValid = false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          emailError.textContent = "Please enter a valid email address."
          emailError.classList.remove("hidden")
          isValid = false
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (!passwordRegex.test(password)) {
          passwordError.textContent =
            "Password must be at least 8 characters long and contain at least one letter and one number."
          passwordError.classList.remove("hidden")
          isValid = false
        }

        if (password !== confirmPassword) {
          confirmPasswordError.textContent = "Passwords do not match."
          confirmPasswordError.classList.remove("hidden")
          isValid = false
        }

        if (isValid) {
          signupButton.disabled = true
          signupText.textContent = "Signing Up..."
          signupSpinner.classList.remove("hidden")

          await new Promise((resolve) => setTimeout(resolve, 1000))
          localStorage.setItem("user", JSON.stringify({ username, email, password }))
          showToast("Sign Up Successful! Please log in.", false)

          signupForm.reset()
          signupButton.disabled = false
          signupText.textContent = "Sign Up"
          signupSpinner.classList.add("hidden")
          window.location.href = "login.html"
        }
      })
    }
  }

  // Login form validation
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")
    const loginButton = document.getElementById("loginButton")
    const loginText = document.getElementById("loginText")
    const loginSpinner = document.getElementById("loginSpinner")
    const emailError = document.getElementById("emailError")
    const passwordError = document.getElementById("passwordError")

    if (emailInput && passwordInput && loginButton && loginText && loginSpinner && emailError && passwordError) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        const email = emailInput.value.trim()
        const password = passwordInput.value

        emailError.classList.add("hidden")
        passwordError.classList.add("hidden")

        let isValid = true

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          emailError.textContent = "Please enter a valid email address."
          emailError.classList.remove("hidden")
          isValid = false
        }

        if (!password) {
          passwordError.textContent = "Password is required."
          passwordError.classList.remove("hidden")
          isValid = false
        }

        if (isValid) {
          loginButton.disabled = true
          loginText.textContent = "Logging In..."
          loginSpinner.classList.remove("hidden")

          await new Promise((resolve) => setTimeout(resolve, 1000))
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

          if (storedUser.email === email && storedUser.password === password) {
            localStorage.setItem("isLoggedIn", "true")
            showToast("Login Successful!", false)
            window.location.href = "index.html"
          } else {
            passwordError.textContent = "Invalid email or password."
            passwordError.classList.remove("hidden")
            loginButton.disabled = false
            loginText.textContent = "Log In"
            loginSpinner.classList.add("hidden")
          }
        }
      })
    }
  }

  // Check-ins page - MODIFIED FOR MANUAL HEART RATE INPUT
  const checkinForm = document.getElementById("checkinForm")
  if (checkinForm) {
    const heartRateInput = document.getElementById("heartRate")
    const heartRateError = document.getElementById("heartRateError")
    const bloodPressureInput = document.getElementById("bloodPressure")
    const bloodPressureError = document.getElementById("bloodPressureError")
    const weightInput = document.getElementById("weight")
    const weightError = document.getElementById("weightError")
    const activityInput = document.getElementById("activity")
    const activityError = document.getElementById("activityError")
    const checkinSubmit = document.getElementById("checkinSubmit")

    // Set heart rate input for manual entry
    if (heartRateInput && heartRateError) {
      heartRateInput.placeholder = "Enter your heart rate (BPM)"
      heartRateInput.removeAttribute("readonly")
      heartRateError.classList.add("hidden")

      // Add real-time validation for heart rate
      heartRateInput.addEventListener("input", () => {
        const value = Number.parseInt(heartRateInput.value)
        if (heartRateInput.value && (isNaN(value) || value < 40 || value > 200)) {
          heartRateError.textContent = "Heart rate must be between 40-200 BPM"
          heartRateError.classList.remove("hidden")
        } else {
          heartRateError.classList.add("hidden")
        }
      })
    }

    if (
      checkinForm &&
      bloodPressureInput &&
      weightInput &&
      activityInput &&
      checkinSubmit &&
      bloodPressureError &&
      weightError &&
      activityError
    ) {
      checkinForm.addEventListener("submit", (event) => {
        event.preventDefault()

        const heartRate = Number.parseInt(heartRateInput.value)
        const bloodPressure = bloodPressureInput.value.trim()
        const weight = Number.parseFloat(weightInput.value)
        const activity = Number.parseInt(activityInput.value)

        heartRateError.classList.add("hidden")
        bloodPressureError.classList.add("hidden")
        weightError.classList.add("hidden")
        activityError.classList.add("hidden")
        checkinSubmit.disabled = true

        let isValid = true

        // Validate heart rate
        if (!heartRateInput.value || isNaN(heartRate) || heartRate < 40 || heartRate > 200) {
          heartRateError.textContent = "Please enter a valid heart rate (40-200 BPM)"
          heartRateError.classList.remove("hidden")
          isValid = false
        }

        const bpRegex = /^\d{2,3}\/\d{2,3}$/
        if (!bpRegex.test(bloodPressure)) {
          bloodPressureError.classList.remove("hidden")
          isValid = false
        }

        if (isNaN(weight) || weight <= 0) {
          weightError.classList.remove("hidden")
          isValid = false
        }

        if (isNaN(activity) || activity < 0) {
          activityError.classList.remove("hidden")
          isValid = false
        }

        if (isValid) {
          const checkin = {
            heartRate: heartRate,
            bloodPressure,
            weight,
            activity,
            date: new Date().toLocaleString(),
          }
          const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]")
          history.push(checkin)
          localStorage.setItem("checkinHistory", JSON.stringify(history))

          showToast("Check-in submitted successfully!", false)
          checkinForm.reset()
          heartRateInput.placeholder = "Enter your heart rate (BPM)"
          displayCheckinHistory()
        } else {
          showToast("Please correct the errors.", true)
        }

        checkinSubmit.disabled = false
      })
    }

    const clearHistory = document.getElementById("clearHistory")
    if (clearHistory) {
      clearHistory.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all check-in history?")) {
          localStorage.removeItem("checkinHistory")
          displayCheckinHistory()
          showToast("History cleared successfully!", false)
        }
      })
    }
  }

  // Display check-in history function
  function displayCheckinHistory() {
    const historyContainer = document.getElementById("checkinHistory")
    if (!historyContainer) return

    const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]")

    if (history.length === 0) {
      historyContainer.innerHTML = '<p class="text-gray-500 text-center">No check-ins recorded yet.</p>'
      return
    }

    const historyHTML = history
      .reverse()
      .map(
        (checkin, index) => `
      <div class="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-gray-800">Check-in #${history.length - index}</h3>
          <span class="text-sm text-gray-500">${checkin.date}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div><span class="font-medium">Heart Rate:</span> ${checkin.heartRate} BPM</div>
          <div><span class="font-medium">Blood Pressure:</span> ${checkin.bloodPressure}</div>
          <div><span class="font-medium">Weight:</span> ${checkin.weight} kg</div>
          <div><span class="font-medium">Activity:</span> ${checkin.activity} min</div>
        </div>
      </div>
    `,
      )
      .join("")

    historyContainer.innerHTML = historyHTML
  }

  // Initialize check-in history display
  displayCheckinHistory()

  // PREDICTION PAGE - INTEGRATED WITH BACKEND
  const predictionForm = document.getElementById("predictionForm")
  if (predictionForm) {
    const heartRateInput = document.getElementById("heartRate")
    const heartRateError = document.getElementById("heartRateError")
    const ageInput = document.getElementById("age")
    const ageError = document.getElementById("ageError")
    const heightInput = document.getElementById("height")
    const heightError = document.getElementById("heightError")
    const weightInput = document.getElementById("weight")
    const weightError = document.getElementById("weightError")
    const apHiInput = document.getElementById("ap_hi")
    const apHiError = document.getElementById("apHiError")
    const apLoInput = document.getElementById("ap_lo")
    const apLoError = document.getElementById("apLoError")
    const activeInput = document.getElementById("active")
    const predictionSubmit = document.getElementById("predictionSubmit")
    const errorSummary = document.getElementById("errorSummary")
    const errorList = document.getElementById("errorList")
    const progressBar = document.getElementById("progressBar")
    const progressPercentage = document.getElementById("progressPercentage")

    // Set heart rate input for manual entry
    if (heartRateInput && heartRateError) {
      heartRateInput.placeholder = "Enter your heart rate (BPM)"
      heartRateInput.removeAttribute("readonly")
      heartRateError.classList.add("hidden")
    }

    // Debounced progress update
    let progressTimeout
    function updateProgress() {
      clearTimeout(progressTimeout)
      progressTimeout = setTimeout(() => {
        const requiredFields = predictionForm.querySelectorAll("input[required], select[required]")
        let filledFields = 0
        requiredFields.forEach((field) => {
          if (field.tagName === "INPUT") {
            if (field.value.trim() !== "") {
              filledFields++
            }
          } else if (field.tagName === "SELECT") {
            if (field.value !== "") {
              filledFields++
            }
          }
        })
        const percentage = Math.round((filledFields / requiredFields.length) * 100)
        if (progressBar && progressPercentage) {
          progressBar.style.width = `${percentage}%`
          progressPercentage.textContent = `${percentage}%`
        }
      }, 100)
    }

    function validateField(input, errorElement, message, condition) {
      if (condition) {
        errorElement.classList.remove("hidden")
        errorElement.textContent = message
        return false
      } else {
        errorElement.classList.add("hidden")
        return true
      }
    }

    // Auto-fill from latest check-in with validation
    const history = JSON.parse(localStorage.getItem("checkinHistory") || "[]")
    if (history.length > 0) {
      const latest = history[history.length - 1]

      if (weightInput && latest.weight && !isNaN(latest.weight) && latest.weight >= 30 && latest.weight <= 200) {
        weightInput.value = latest.weight
      }

      if (apHiInput && apLoInput && latest.bloodPressure) {
        const bpRegex = /^\d{2,3}\/\d{2,3}$/
        if (bpRegex.test(latest.bloodPressure)) {
          const [sys, dia] = latest.bloodPressure.split("/")
          const sysNum = Number.parseInt(sys)
          const diaNum = Number.parseInt(dia)
          if (sysNum >= 80 && sysNum <= 250 && diaNum >= 50 && diaNum <= 150 && diaNum < sysNum) {
            apHiInput.value = sys
            apLoInput.value = dia
          }
        }
      }

      if (heartRateInput && latest.heartRate && latest.heartRate !== "N/A") {
        const hrNum = Number.parseInt(latest.heartRate)
        if (!isNaN(hrNum) && hrNum >= 40 && hrNum <= 200) {
          heartRateInput.value = hrNum
        }
      }

      if (activeInput && latest.activity !== undefined) {
        const activity = Number.parseInt(latest.activity)
        if (!isNaN(activity) && activity >= 0) {
          activeInput.value = activity > 0 ? "1" : "0"
        }
      }

      updateProgress()
    }

    if (
      predictionForm &&
      ageInput &&
      heightInput &&
      weightInput &&
      apHiInput &&
      apLoInput &&
      activeInput &&
      predictionSubmit &&
      ageError &&
      heightError &&
      weightError &&
      apHiError &&
      apLoError
    ) {
      // Real-time progress and validation for inputs
      ;[ageInput, heightInput, weightInput, apHiInput, apLoInput, heartRateInput, activeInput].forEach((input) => {
        if (input) {
          input.addEventListener("input", () => {
            updateProgress()
            const id = input.id
            const value = Number.parseFloat(input.value)
            if (id === "age")
              validateField(
                input,
                ageError,
                "Age must be between 18 and 100.",
                isNaN(value) || value < 18 || value > 100,
              )
            if (id === "height")
              validateField(
                input,
                heightError,
                "Height must be between 100 and 250 cm.",
                isNaN(value) || value < 100 || value > 250,
              )
            if (id === "weight")
              validateField(
                input,
                weightError,
                "Weight must be between 30 and 200 kg.",
                isNaN(value) || value < 30 || value > 200,
              )
            if (id === "ap_hi")
              validateField(
                input,
                apHiError,
                "Systolic BP must be between 80 and 250 mmHg.",
                isNaN(value) || value < 80 || value > 250,
              )
            if (id === "ap_lo") {
              const apHi = Number.parseFloat(apHiInput.value)
              validateField(
                input,
                apLoError,
                "Diastolic BP must be between 50 and 150 mmHg and less than systolic.",
                isNaN(value) || value < 50 || value > 150 || value >= apHi,
              )
            }
            if (id === "heartRate")
              validateField(
                input,
                heartRateError,
                "Heart rate must be between 40 and 200 BPM.",
                isNaN(value) || value < 40 || value > 200,
              )
          })
        }
      })

      // BACKEND INTEGRATION - PREDICTION FORM SUBMISSION
      predictionForm.addEventListener("submit", async (event) => {
        event.preventDefault()

        // Clear previous errors
        const errorElements = [ageError, heightError, weightError, apHiError, apLoError, heartRateError]
        errorElements.forEach((error) => error.classList.add("hidden"))
        if (errorSummary) errorSummary.classList.add("hidden")

        const age = Number.parseFloat(ageInput.value)
        const height = Number.parseFloat(heightInput.value)
        const weight = Number.parseFloat(weightInput.value)
        const apHi = Number.parseFloat(apHiInput.value)
        const apLo = Number.parseFloat(apLoInput.value)
        const heartRate = Number.parseFloat(heartRateInput.value)
        const gender = Number.parseInt(document.getElementById("gender").value)
        const cholesterol = Number.parseInt(document.getElementById("cholesterol").value)
        const gluc = Number.parseInt(document.getElementById("gluc").value)
        const smoke = Number.parseInt(document.getElementById("smoke").value)
        const alco = Number.parseInt(document.getElementById("alco").value)
        const active = Number.parseInt(activeInput.value)

        let isValid = true
        const errors = []

        // Validate all fields
        if (
          !validateField(ageInput, ageError, "Age must be between 18 and 100.", isNaN(age) || age < 18 || age > 100)
        ) {
          isValid = false
          errors.push("Invalid age")
        }
        if (
          !validateField(
            heightInput,
            heightError,
            "Height must be between 100 and 250 cm.",
            isNaN(height) || height < 100 || height > 250,
          )
        ) {
          isValid = false
          errors.push("Invalid height")
        }
        if (
          !validateField(
            weightInput,
            weightError,
            "Weight must be between 30 and 200 kg.",
            isNaN(weight) || weight < 30 || weight > 200,
          )
        ) {
          isValid = false
          errors.push("Invalid weight")
        }
        if (
          !validateField(
            apHiInput,
            apHiError,
            "Systolic BP must be between 80 and 250 mmHg.",
            isNaN(apHi) || apHi < 80 || apHi > 250,
          )
        ) {
          isValid = false
          errors.push("Invalid systolic blood pressure")
        }
        if (
          !validateField(
            apLoInput,
            apLoError,
            "Diastolic BP must be between 50 and 150 mmHg and less than systolic.",
            isNaN(apLo) || apLo < 50 || apLo > 150 || apLo >= apHi,
          )
        ) {
          isValid = false
          errors.push("Invalid diastolic blood pressure")
        }
        if (
          !validateField(
            heartRateInput,
            heartRateError,
            "Heart rate must be between 40 and 200 BPM.",
            isNaN(heartRate) || heartRate < 40 || heartRate > 200,
          )
        ) {
          isValid = false
          errors.push("Invalid heart rate")
        }

        if (!isValid) {
          if (errorSummary && errorList) {
            errorList.innerHTML = errors.map((error) => `<li>${error}</li>`).join("")
            errorSummary.classList.remove("hidden")
          }
          showToast("Please correct the errors before submitting.", true)
          return
        }

        // Disable submit button and show loading state
        predictionSubmit.disabled = true
        const originalText = predictionSubmit.innerHTML
        predictionSubmit.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...'

        try {
          // Prepare data for backend API
          const userData = {
            age: age,
            gender: gender,
            height: height,
            weight: weight,
            ap_hi: apHi,
            ap_lo: apLo,
            cholesterol: cholesterol,
            gluc: gluc,
            smoke: smoke,
            alco: alco,
            active: active,
            pulse_pressure: apHi - apLo,
          }

          // Call backend API
          const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userData: userData,
              heartRate: heartRate,
            }),
          })

          if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`)
          }

          const results = await response.json()

          // Store results in localStorage for results page
          localStorage.setItem("predictionResults", JSON.stringify(results))

          showToast("Risk assessment completed successfully!", false)

          // Redirect to results page immediately
          setTimeout(() => {
            window.location.href = "results.html"
          }, 1000)
        } catch (error) {
          console.error("Prediction error:", error)
          showToast("Failed to connect to prediction service. Please check if the backend is running.", true)
        } finally {
          // Re-enable submit button
          predictionSubmit.disabled = false
          predictionSubmit.innerHTML = originalText
        }
      })
    }
  }

     // Chatbot Functionality
  const chatInput = document.getElementById("chatInput")
  const sendMessage = document.getElementById("sendMessage")
  const startListening = document.getElementById("startListening")
  const chatMessages = document.getElementById("chatWindow")
  const toggleSpeech = document.getElementById("toggleSpeech")

  // Initialize chat history
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]")
  let isSpeechEnabled = true // Default: speech output enabled

  // Function to display messages with improved styling
  function displayMessage(message, isUser = true) {
    if (!chatMessages) {
      console.error("Chat window element not found")
      return
    }
    const messageDiv = document.createElement("div")
    messageDiv.className = `my-2 p-3 rounded-lg max-w-[80%] shadow-sm ${
      isUser
        ? "ml-auto bg-red-100 text-right text-gray-800"
        : "mr-auto bg-gray-200 text-left text-gray-900"
    }`
    messageDiv.innerHTML = `<p class="text-sm">${message}</p>`
    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Speak AI response if speech is enabled and it's not a user message
    if (!isUser && isSpeechEnabled && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = "en-US"
      utterance.volume = 1.0
      utterance.rate = 1.0
      utterance.pitch = 1.0
      try {
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Text-to-speech error:", error)
        showToast("Text-to-speech failed. Please check browser settings.", true)
      }
    }
  }

  // Function to save chat history
  function saveChatHistory(message, isUser) {
    chatHistory.push({ message, isUser, timestamp: new Date().toLocaleString() })
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
  }

  // Load and display chat history
  function loadChatHistory() {
    chatHistory.forEach(({ message, isUser }) => displayMessage(message, isUser))
  }

  // Gemini API integration
  async function getGeminiResponse(message) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      console.error("Gemini API key is missing or not set")
      showToast("Chatbot configuration error: API key is missing. Please contact support.", true)
      return "Sorry, the chatbot is not properly configured. Please try again later."
    }

    try {
      console.log("Sending request to Gemini API with message:", message)
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are HeartBot, a health-focused AI assistant specializing in cardiovascular health. Provide accurate, concise, and friendly answers related to heart health, lifestyle, and general wellness. If the question is unrelated to health or beyond your expertise, politely redirect to relevant health topics or suggest consulting a healthcare professional. Current user message: "${message}"`,
                },
              ],
            },
          ],
        }),
      })

      console.log("Gemini API response status:", response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Gemini API error: Status ${response.status}, Response: ${errorText}`)
        let errorMessage = "Failed to connect to AI service. Please try again."
        if (response.status === 401) {
          errorMessage = "Invalid API key. Please contact support."
        } else if (response.status === 429) {
          errorMessage = "API request limit exceeded. Please try again later."
        } else if (response.status === 403) {
          errorMessage = "API access denied. Please check API key restrictions."
        }
        showToast(errorMessage, true)
        return `Sorry, there was an error: ${errorMessage}`
      }

      const data = await response.json()
      console.log("Gemini API response data:", data)
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request."
      return reply
    } catch (error) {
      console.error("Gemini API network error:", error.message)
      showToast("Network error connecting to AI service. Please check your internet connection.", true)
      return "Sorry, I couldn't connect to the AI service. Please try again later."
    }
  }

  // Handle text input
  if (sendMessage && chatInput) {
    sendMessage.addEventListener("click", async () => {
      const message = chatInput.value.trim()
      if (!message) {
        showToast("Please enter a message.", true)
        return
      }

      console.log("User sent text message:", message)
      displayMessage(message)
      saveChatHistory(message, true)
      chatInput.value = ""
      sendMessage.disabled = true
      sendMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

      const reply = await getGeminiResponse(message)
      displayMessage(reply, false)
      saveChatHistory(reply, false)

      sendMessage.disabled = false
      sendMessage.innerHTML = '<i class="fa-solid fa-paper-plane"></i>'
    })

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage.click()
      }
    })
  }

  // Voice input using Web Speech API
  if (startListening && chatInput) {
    let recognition
    try {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.lang = "en-US"
      recognition.interimResults = false
    } catch (error) {
      console.error("Speech recognition not supported in this browser:", error)
      showToast("Speech recognition is not supported in your browser.", true)
      startListening.disabled = true
      startListening.style.display = "none"
      return
    }

    startListening.addEventListener("click", () => {
      try {
        console.log("Starting speech recognition")
        startListening.innerHTML = '<i class="fa-solid fa-microphone fa-beat text-yellow-400"></i>'
        recognition.start()
      } catch (error) {
        console.error("Speech recognition initialization error:", error)
        showToast("Failed to start speech recognition. Please try again.", true)
        startListening.innerHTML = '<i class="fa-solid fa-microphone"></i>'
      }
    })

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      console.log("Speech recognition result:", transcript)
      chatInput.value = transcript
      displayMessage(transcript)
      saveChatHistory(transcript, true)

      startListening.disabled = true
      startListening.innerHTML = '<i class="fa-solid fa-microphone fa-beat text-yellow-400"></i>'

      const reply = await getGeminiResponse(transcript)
      displayMessage(reply, false)
      saveChatHistory(reply, false)

      startListening.disabled = false
      startListening.innerHTML = '<i class="fa-solid fa-microphone"></i>'
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      let errorMessage = "Speech recognition failed. Please try again."
      if (event.error === "no-speech") {
        errorMessage = "No speech detected. Please try speaking again."
      } else if (event.error === "audio-capture") {
        errorMessage = "Microphone not detected. Please check your device."
      } else if (event.error === "not-allowed") {
        errorMessage = "Microphone access denied. Please allow microphone permissions."
      }
      showToast(errorMessage, true)
      startListening.innerHTML = '<i class="fa-solid fa-microphone"></i>'
      startListening.disabled = false
    }

    recognition.onend = () => {
      console.log("Speech recognition ended")
      startListening.innerHTML = '<i class="fa-solid fa-microphone"></i>'
      startListening.disabled = false
    }
  }

  // Toggle speech output
  if (toggleSpeech) {
    toggleSpeech.addEventListener("click", () => {
      isSpeechEnabled = !isSpeechEnabled
      toggleSpeech.innerHTML = isSpeechEnabled
        ? '<i class="fa-solid fa-volume-up text-green-600"></i>'
        : '<i class="fa-solid fa-volume-mute text-red-600"></i>'
      showToast(`Speech output ${isSpeechEnabled ? "enabled" : "disabled"}`, false)
    })
  }

  // Load chat history on page load
  if (chatMessages) {
    console.log("Loading chat history")
    loadChatHistory()
  }

  // RESULTS DISPLAY FUNCTION
  function displayPredictionResults(results) {
    // Create results container if it doesn't exist
    let resultsContainer = document.getElementById("resultsContainer")
    if (!resultsContainer) {
      resultsContainer = document.createElement("div")
      resultsContainer.id = "resultsContainer"
      resultsContainer.className = "mt-8 bg-gray-50 p-6 rounded-lg"

      // Insert after the prediction form
      const predictionSection = document.querySelector("section")
      if (predictionSection) {
        predictionSection.appendChild(resultsContainer)
      }
    }

    // Extract key metrics
    const initialRisk = results.initial_risk_percentage
    const month12NoChanges = results.scenario_1_no_changes.month_12?.risk_percentage || 0
    const month12WithImprovements = results.scenario_2_with_improvements.month_12?.risk_percentage || 0
    const riskReduction = month12NoChanges - month12WithImprovements

    // Get risk level and color
    function getRiskLevel(risk) {
      if (risk < 20) return { level: "Low Risk", color: "text-green-600" }
      if (risk < 40) return { level: "Moderate Risk", color: "text-yellow-600" }
      if (risk < 60) return { level: "High Risk", color: "text-orange-600" }
      return { level: "Very High Risk", color: "text-red-600" }
    }

    const initialRiskInfo = getRiskLevel(initialRisk)
    const month12NoChangesInfo = getRiskLevel(month12NoChanges)
    const month12WithImprovementsInfo = getRiskLevel(month12WithImprovements)

    resultsContainer.innerHTML = `
      <h2 class="text-3xl font-bold text-red-600 mb-6 text-center">
        <i class="fas fa-chart-line mr-2"></i>
        Your CVD Risk Assessment Results
      </h2>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <i class="fa-solid fa-heart-circle-exclamation text-4xl ${initialRiskInfo.color} mb-2"></i>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Initial Risk</h3>
          <p class="text-3xl font-bold ${initialRiskInfo.color}">${initialRisk.toFixed(1)}%</p>
          <p class="text-sm text-gray-600 mt-1">${initialRiskInfo.level}</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <i class="fa-solid fa-clock text-4xl text-orange-600 mb-2"></i>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">12-Month (No Changes)</h3>
          <p class="text-3xl font-bold ${month12NoChangesInfo.color}">${month12NoChanges.toFixed(1)}%</p>
          <p class="text-sm text-gray-600 mt-1">${month12NoChangesInfo.level}</p>
        </div>
        
        <div class="text-center p-6 bg-white rounded-lg shadow">
          <i class="fa-solid fa-shield-heart text-4xl text-green-600 mb-2"></i>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">12-Month (With Improvements)</h3>
          <p class="text-3xl font-bold ${month12WithImprovementsInfo.color}">${month12WithImprovements.toFixed(1)}%</p>
          <p class="text-sm text-gray-600 mt-1">${month12WithImprovementsInfo.level}</p>
        </div>
      </div>

      <!-- Risk Reduction -->
      <div class="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
        <h3 class="text-lg font-semibold text-green-800 mb-2 flex items-center">
          <i class="fa-solid fa-shield-heart mr-2"></i> Risk Reduction Potential
        </h3>
        <p class="text-2xl font-bold text-green-600">${riskReduction.toFixed(1)}% reduction possible</p>
        <p class="text-sm text-green-700 mt-1">
          With lifestyle improvements, you could reduce your risk by up to ${riskReduction.toFixed(1)} percentage points over 12 months.
        </p>
      </div>

      <!-- Chart -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <i class="fa-solid fa-chart-area mr-2"></i> Risk Progression Over Time
        </h3>
        <div class="bg-white p-4 rounded-lg border">
          <canvas id="riskChart" width="400" height="200"></canvas>
        </div>
      </div>

      <!-- Recommendations -->
      ${results.improvement_recommendations ? generateRecommendationsHTML(results.improvement_recommendations) : ""}

      <!-- Patient Profile Summary -->
      <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 class="text-lg font-semibold text-blue-800 mb-4">Your Health Profile Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><strong>Age:</strong> ${results.patient_profile.age} years</div>
          <div><strong>Gender:</strong> ${results.patient_profile.gender === 1 ? "Male" : "Female"}</div>
          <div><strong>BMI:</strong> ${(results.patient_profile.weight / Math.pow(results.patient_profile.height / 100, 2)).toFixed(1)}</div>
          <div><strong>Blood Pressure:</strong> ${results.patient_profile.ap_hi}/${results.patient_profile.ap_lo} mmHg</div>
          <div><strong>Heart Rate:</strong> ${results.current_heart_rate || "N/A"} BPM</div>
          <div><strong>Cholesterol:</strong> ${["", "Normal", "Above Normal", "Well Above Normal"][results.patient_profile.cholesterol]}</div>
          <div><strong>Glucose:</strong> ${["", "Normal", "Above Normal", "Well Above Normal"][results.patient_profile.gluc]}</div>
          <div><strong>Physical Activity:</strong> ${results.patient_profile.active ? "Active" : "Sedentary"}</div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div class="flex items-start">
          <i class="fa-solid fa-info-circle text-blue-500 mt-1 mr-2"></i>
          <div class="text-sm text-blue-800">
            <strong>Disclaimer:</strong> This assessment is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
          </div>
        </div>
      </div>
    `

    // Create the chart after DOM is updated
    setTimeout(() => createRiskChart(results), 100)

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: "smooth" })
  }

  function generateRecommendationsHTML(recommendations) {
    let html =
      '<div class="mb-8"><h3 class="text-lg font-semibold text-gray-700 mb-4">Personalized Recommendations</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-6">'

    if (recommendations.high_priority && recommendations.high_priority.length > 0) {
      html += `
        <div class="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 class="font-semibold text-red-800 mb-2">🚨 High Priority</h4>
          <ul class="text-sm text-red-700 space-y-1">
            ${recommendations.high_priority.map((item) => `<li>• ${item}</li>`).join("")}
          </ul>
        </div>
      `
    }

    if (recommendations.medium_priority && recommendations.medium_priority.length > 0) {
      html += `
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 class="font-semibold text-yellow-800 mb-2">⚠️ Medium Priority</h4>
          <ul class="text-sm text-yellow-700 space-y-1">
            ${recommendations.medium_priority.map((item) => `<li>• ${item}</li>`).join("")}
          </ul>
        </div>
      `
    }

    if (recommendations.personalized_changes && recommendations.personalized_changes.length > 0) {
      html += `
        <div class="bg-green-50 p-4 rounded-lg border border-green-200 md:col-span-2">
          <h4 class="font-semibold text-green-800 mb-2">💡 Expected Benefits</h4>
          <ul class="text-sm text-green-700 space-y-1">
            ${recommendations.personalized_changes.map((item) => `<li>• ${item}</li>`).join("")}
          </ul>
        </div>
      `
    }

    html += "</div></div>"
    return html
  }

  function createRiskChart(results) {
    const canvas = document.getElementById("riskChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const months = [1, 2, 3, 4, 5, 6, 9, 12]

    const noChangesData = months.map((month) => results.scenario_1_no_changes[`month_${month}`]?.risk_percentage || 0)

    const withImprovementsData = months.map(
      (month) => results.scenario_2_with_improvements[`month_${month}`]?.risk_percentage || 0,
    )

    // Simple chart implementation
    const chartWidth = canvas.width - 80
    const chartHeight = canvas.height - 80
    const maxRisk = Math.max(...noChangesData, ...withImprovementsData, results.initial_risk_percentage)
    const minRisk = Math.min(...withImprovementsData, results.initial_risk_percentage)
    const riskRange = maxRisk - minRisk + 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(60, 40)
    ctx.lineTo(60, chartHeight + 40)
    ctx.lineTo(chartWidth + 60, chartHeight + 40)
    ctx.stroke()

    // Draw grid lines and labels
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px Arial"

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = 40 + (chartHeight / 5) * i
      const value = maxRisk - (riskRange / 5) * i
      ctx.beginPath()
      ctx.moveTo(55, y)
      ctx.lineTo(chartWidth + 60, y)
      ctx.stroke()
      ctx.fillText(value.toFixed(0) + "%", 10, y + 4)
    }

    // X-axis labels
    months.forEach((month, index) => {
      const x = 60 + (chartWidth / (months.length - 1)) * index
      ctx.fillText(`M${month}`, x - 10, chartHeight + 60)
    })

    // Draw lines
    function drawLine(data, color, label) {
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.beginPath()

      data.forEach((risk, index) => {
        const x = 60 + (chartWidth / (months.length - 1)) * index
        const y = 40 + chartHeight - ((risk - (minRisk - 5)) / riskRange) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        // Draw points
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()
      })

      ctx.stroke()
    }

    // Draw initial risk line
    const initialY = 40 + chartHeight - ((results.initial_risk_percentage - (minRisk - 5)) / riskRange) * chartHeight
    ctx.strokeStyle = "#6b7280"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(60, initialY)
    ctx.lineTo(chartWidth + 60, initialY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw data lines
    drawLine(noChangesData, "#ef4444", "No Changes")
    drawLine(withImprovementsData, "#22c55e", "With Improvements")

    // Legend
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(chartWidth - 150, 50, 15, 15)
    ctx.fillStyle = "#374151"
    ctx.fillText("No Changes", chartWidth - 130, 62)

    ctx.fillStyle = "#22c55e"
    ctx.fillRect(chartWidth - 150, 75, 15, 15)
    ctx.fillStyle = "#374151"
    ctx.fillText("With Improvements", chartWidth - 130, 87)

    ctx.fillStyle = "#6b7280"
    ctx.fillRect(chartWidth - 150, 100, 15, 2)
    ctx.fillStyle = "#374151"
    ctx.fillText("Initial Risk", chartWidth - 130, 107)
  }

  // RESULTS PAGE - DISPLAY BACKEND DATA
  const resultsDisplay = document.getElementById("resultsDisplay")
  if (resultsDisplay) {
    const storedResults = localStorage.getItem("predictionResults")

    if (storedResults) {
      try {
        const results = JSON.parse(storedResults)
        displayResultsOnResultsPage(results)
      } catch (error) {
        console.error("Error parsing results:", error)
        displayNoResults()
      }
    } else {
      displayNoResults()
    }
  }

  function displayResultsOnResultsPage(results) {
    const resultsDisplay = document.getElementById("resultsDisplay")
    if (!resultsDisplay) return

    // Extract key metrics
    const initialRisk = results.initial_risk_percentage
    const month12NoChanges = results.scenario_1_no_changes.month_12?.risk_percentage || 0
    const month12WithImprovements = results.scenario_2_with_improvements.month_12?.risk_percentage || 0
    const riskReduction = month12NoChanges - month12WithImprovements

    // Get risk level and color
    function getRiskLevel(risk) {
      if (risk < 20) return { level: "Low Risk", color: "text-green-600" }
      if (risk < 40) return { level: "Moderate Risk", color: "text-yellow-600" }
      if (risk < 60) return { level: "High Risk", color: "text-orange-600" }
      return { level: "Very High Risk", color: "text-red-600" }
    }

    const initialRiskInfo = getRiskLevel(initialRisk)
    const month12NoChangesInfo = getRiskLevel(month12NoChanges)
    const month12WithImprovementsInfo = getRiskLevel(month12WithImprovements)

    resultsDisplay.innerHTML = `
    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="text-center p-6 bg-gray-50 rounded-lg">
        <i class="fa-solid fa-heart-circle-exclamation text-4xl ${initialRiskInfo.color} mb-2"></i>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Initial Risk</h3>
        <p class="text-3xl font-bold ${initialRiskInfo.color}">${initialRisk.toFixed(1)}%</p>
        <p class="text-sm text-gray-600 mt-1">${initialRiskInfo.level}</p>
      </div>
      
      <div class="text-center p-6 bg-gray-50 rounded-lg">
        <i class="fa-solid fa-clock text-4xl text-orange-600 mb-2"></i>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">12-Month (No Changes)</h3>
        <p class="text-3xl font-bold ${month12NoChangesInfo.color}">${month12NoChanges.toFixed(1)}%</p>
        <p class="text-sm text-gray-600 mt-1">${month12NoChangesInfo.level}</p>
      </div>
      
      <div class="text-center p-6 bg-gray-50 rounded-lg">
        <i class="fa-solid fa-shield-heart text-4xl text-green-600 mb-2"></i>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">12-Month (With Improvements)</h3>
        <p class="text-3xl font-bold ${month12WithImprovementsInfo.color}">${month12WithImprovements.toFixed(1)}%</p>
        <p class="text-sm text-gray-600 mt-1">${month12WithImprovementsInfo.level}</p>
      </div>
    </div>

    <!-- Risk Reduction -->
    <div class="bg-green-50 p-6 rounded-lg border border-green-200 mb-8">
      <h3 class="text-lg font-semibold text-green-800 mb-2 flex items-center">
        <i class="fa-solid fa-shield-heart mr-2"></i> Risk Reduction Potential
      </h3>
      <p class="text-2xl font-bold text-green-600">${riskReduction.toFixed(1)}% reduction possible</p>
      <p class="text-sm text-green-700 mt-1">
        With lifestyle improvements, you could reduce your risk by up to ${riskReduction.toFixed(1)} percentage points over 12 months.
      </p>
    </div>

    <!-- Chart -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <i class="fa-solid fa-chart-area mr-2"></i> Risk Progression Over Time
      </h3>
      <div class="bg-white p-4 rounded-lg border">
        <canvas id="riskChart" width="400" height="200"></canvas>
      </div>
    </div>

    <!-- Recommendations -->
    ${results.improvement_recommendations ? generateRecommendationsHTML(results.improvement_recommendations) : ""}

    <!-- Patient Profile Summary -->
    <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">Your Health Profile Summary</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><strong>Age:</strong> ${results.patient_profile.age} years</div>
        <div><strong>Gender:</strong> ${results.patient_profile.gender === 1 ? "Male" : "Female"}</div>
        <div><strong>BMI:</strong> ${(results.patient_profile.weight / Math.pow(results.patient_profile.height / 100, 2)).toFixed(1)}</div>
        <div><strong>Blood Pressure:</strong> ${results.patient_profile.ap_hi}/${results.patient_profile.ap_lo} mmHg</div>
        <div><strong>Heart Rate:</strong> ${results.current_heart_rate || "N/A"} BPM</div>
        <div><strong>Cholesterol:</strong> ${["", "Normal", "Above Normal", "Well Above Normal"][results.patient_profile.cholesterol]}</div>
        <div><strong>Glucose:</strong> ${["", "Normal", "Above Normal", "Well Above Normal"][results.patient_profile.gluc]}</div>
        <div><strong>Physical Activity:</strong> ${results.patient_profile.active ? "Active" : "Sedentary"}</div>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
      <div class="flex items-start">
        <i class="fa-solid fa-info-circle text-blue-500 mt-1 mr-2"></i>
        <div class="text-sm text-blue-800">
          <strong>Disclaimer:</strong> This assessment is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
        </div>
      </div>
    </div>
  `

    // Create the chart after DOM is updated
    setTimeout(() => createRiskChart(results), 100)
  }

  function displayNoResults() {
    const resultsDisplay = document.getElementById("resultsDisplay")
    if (!resultsDisplay) return

    resultsDisplay.innerHTML = `
    <div class="text-center py-12">
      <i class="fa-solid fa-exclamation-triangle text-6xl text-yellow-600 mb-4"></i>
      <h3 class="text-2xl font-bold text-gray-800 mb-4">No Results Found</h3>
      <p class="text-gray-600 mb-6">Please run a prediction first to see your cardiovascular risk assessment.</p>
      <a href="prediction.html" class="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition inline-flex items-center">
        <i class="fa-solid fa-heartbeat mr-2"></i> Run Prediction
      </a>
    </div>
  `
  }

  console.log("HeartCare - Backend Integration Complete")
})
