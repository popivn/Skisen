import '../public/assets/css/style.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router"
import App from './App.vue'
import { createI18n } from "vue-i18n"

import Home from "./Pages/Home/Index.vue"
import Diagnosis from "./Pages/Diagnosis/Index.vue"
import Chatbot from "./Pages/Chatbot/Index.vue"
import Contact from "./Pages/Contact/Index.vue"
import Privacy from "./Pages/Privacy/Index.vue"
import FaQ from "./Pages/FaQ/Index.vue"
import Terms from "./Pages/Terms/Index.vue"
import Profile from "./Pages/Profile/Index.vue"
import Login from "./Pages/Login/Index.vue"
import Register from "./Pages/Register/Index.vue"
// import Detect from "./Pages/Detect/Index.vue"

// Import translations
import en from "./locales/en.json"
import vi from "./locales/vi.json"

// Define routes
const routes = [
    { path: "/", component: Home, name: "home" },
    { path: "/diagnosis", component: Diagnosis, name: "diagnosis" },
    { path: "/chatbot", component: Chatbot, name: "chatbot" },
    { path: "/contact", component: Contact, name: "contact" },
    { path: "/privacy", component: Privacy, name: "privacy" },
    { path: "/terms", component: Terms, name: "terms" },
    { path: "/faq", component: FaQ, name: "faq" },
    { path: "/login", component: Login, name: "login" },
    { path: "/register", component: Register, name: "register" },
    { path: "/profile", component: Profile, name: "profile" },
    // { path: "/detect", component: Detect, name: "detect" },
]
  
  // Create router
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
      // Luôn cuộn lên đầu trang khi chuyển trang
      return { top: 0 }
    },
  })

const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: localStorage.getItem("language") || "vi", // Default language
    fallbackLocale: "vi",
    messages: {
        en,
        vi,
    },
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount("#app")
