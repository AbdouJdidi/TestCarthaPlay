document.addEventListener("DOMContentLoaded", () => {
    if (typeof AOS === "undefined") {
        AOS = {
            init: () => { },
        }
    }

    AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: false,
        mirror: false,
        disable: "mobile",
        offset: 120,
        delay: 0,
        disableMutationObserver: false,
    })
    const mobileMenuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")
    const menuIcon = document.getElementById("menu-icon")
    const closeIcon = document.getElementById("close-icon")

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden")
            menuIcon.classList.toggle("hidden")
            closeIcon.classList.toggle("hidden")
        })
    }

    const header = document.getElementById("header")
    if (window.scrollY <= 50) {
        header.classList.remove("scrolled")
    } else {
        header.classList.add("scrolled")
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled")
        } else {
            header.classList.remove("scrolled")
        }
    })
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()

            const targetId = this.getAttribute("href")
            if (targetId === "#") return

            const targetElement = document.querySelector(targetId)
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth",
                })
                if (!mobileMenu.classList.contains("hidden")) {
                    mobileMenu.classList.add("hidden")
                    menuIcon.classList.remove("hidden")
                    closeIcon.classList.add("hidden")
                }
            }
        })
    })
    document.body.style.overflowX = "hidden"
    document.documentElement.style.overflowX = "hidden"
})
