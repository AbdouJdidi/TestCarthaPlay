import React, { useEffect, useRef } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import logo from "./logo.png";
import pic1 from "./pic1.png";
import pic2 from "./pic2.png";
import pic3 from "./pic3.png";
import pic4 from "./pic4.png";
import pic5 from "./pic5.png";
import abdou from "./abdou.png"
import nader from "./nader.png"
import roudayna from "./roudayna.png"


import arrow1 from "./arrow1.png"
import arrow2 from "./arrow2.png"
import { Link } from "react-router-dom";


const LandingPage = () => {

  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    document.documentElement.className = `
      m-0 p-0 w-full max-w-[100vw] overflow-x-hidden relative
      overflow-y-scroll rtl scroll-smooth
    `;
    document.body.className = `
      m-0 p-0 w-full max-w-[100vw] overflow-x-hidden relative
      bg-[radial-gradient(circle,_#00a1ff,_#0046a5)]
      font-[Baloo_Bhaijaan_2]
      
      min-h-screen
    `;
  }, []);
  
  useEffect(() => {
    

    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: false,
      disable: "mobile",
      offset: 120,
      delay: 0,
      disableMutationObserver: false,
    });

    if (mobileMenuButtonRef.current) {
      mobileMenuButtonRef.current.addEventListener("click", () => {
        mobileMenuRef.current.classList.toggle("hidden");
        menuIconRef.current.classList.toggle("hidden");
        closeIconRef.current.classList.toggle("hidden");
      });
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        headerRef.current.classList.add("scrolled");
      } else {
        headerRef.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });

          if (!mobileMenuRef.current.classList.contains("hidden")) {
            mobileMenuRef.current.classList.add("hidden");
            menuIconRef.current.classList.remove("hidden");
            closeIconRef.current.classList.add("hidden");
          }
        }
      });
    });

    // Prevent horizontal scrolling
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className="min-h-screen bg-transparent backdrop-blur-0 transition-all duration-300 ease-in-out" id="header" dir="rtl" lang="ar">
      <nav
        ref={mobileMenuRef}
        id="mobile-menu"
        className="w-full z-[9999] top-0 left-0 right-0 fixed py-4 px-4 md:px-6 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center order-2">
            <a href="#" className="text-2xl text-white font-bakbak">
              CarthaPlay
            </a>
            <img src={logo} alt="Logo" className="h-12 w-12 mr-2 max-w-full h-auto" />
          </div>
          <div className="hidden md:flex items-center gap-10 order-1">
            <a href="#home" className="text-white hover:text-blue-100 font-baloo2">
              الرئيسية
            </a>
            <a href="#features" className="text-white hover:text-blue-100 font-baloo2">
              المميزات
            </a>
            <a href="#resources" className="text-white hover:text-blue-100 font-baloo2">
              الموارد
            </a>
            <a href="#contact" className="text-white hover:text-blue-100 font-baloo2">
              تواصل معنا
            </a>
             <a href="/CarthaPlayInstaller.exe" download >
             <button className="bg-[#0057b7] text-white rounded-full py-2 px-5 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-[#0046a5] hover:-translate-y-0.5 order-1 flex items-center gap-1 text-white font-baloo2">
             تحميل اللعبة    
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
             </a>
            
            <div class="md:hidden">
                <button id="mobile-menu-button" class="text-white p-2">
                    <svg id="menu-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg id="close-icon" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section className="education-video-section py-16 overflow-hidden pt-32" id="home">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div
              className="md:w-1/2 relative education-illustration"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <img className="max-w-full h-auto" src={pic1} alt="Hero" />
            </div>
            <div
              className="md:w-1/2 text-white text-center md:text-right mb-10 md:mb-0 font-baloo2"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl md:text-5xl mb-4 font-baloo">نبدلو التعليم</h2>
              <h3 className="text-3xl md:text-4xl mb-6 font-baloo">...لعبة بلعبة</h3>
              <p className="text-lg mb-4">
                <span className="font-baloo">CarthaPlay,</span> المنصة إلّي تخلي القراية تجربة ممتعة وفعّالة.
              </p>
              <p className="text-lg mb-4">
                مع <span className="font-baloo">CarthaPlay</span>، نعاونوا المربّين و الأولياء باش يقدّموا محتوى تعليمي
                في شكل ألعاب ترفيهية وممتعة. المنصة مصمّمة باش تخلّي الصغار يقروا، يلعبوا ويتطوّروا في نفس الوقت.
              </p>
              <p className="text-lg mb-6">كل لعبة تتبع هدف تربوي، وكل طفل عندو متابعة وتقييم خاص بيه.</p>
              <Link
                to="/signup/teacher"
                className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-baloo2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                اكتشف المنصة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="cartha-play-section py-16" id="features">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div
              className="md:w-1/2 relative education-illustration"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <img className="max-w-full h-auto" src={pic2} alt="CarthaPlay Illustration" />
            </div>
            <div
              className="md:w-1/2 text-white text-center md:text-right mb-10 md:mb-0 font-baloo2"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl md:text-5xl mb-6 font-baloo">شنوة CarthaPlay؟</h2>
              <p className="text-lg mb-4">
                <span className="font-baloo">CarthaPlay,</span> هي فكرة جمعتنا، إحنا ثلاث طلبة مهندسين: رودينة كوكة، عبد
                الرحمان الجديدي، ونادر بن صالح.
              </p>
              <p className="text-lg mb-4">
                حبّينا نبدلو طريقة التعليم ونخليوها أكثر تفاعلية وقريبة للصغار والأولياء. آمنا إلّي التعليم ينجم يكون
                لعبة، وقررنا نطوّرو <span className="font-baloo">CarthaPlay</span> باش نوصّلو الرسالة هاذي.
              </p>
              <p className="text-lg mb-6">
                المنصّة متاعنا ديما في القمّة، وربحنا برشا Hackathon ومسابقات في مجال EdTech، وكلّ مرّة نزيدو نطوّرو باش
                نقدمو حاجة أفضل للأطفال والمربين.
              </p>
              <Link
                to="/signup/teacher"
                className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-baloo2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                اكتشف المنصة
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="cartha-play-guide-section py-16" id="resources">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 flex justify-center" data-aos="fade-left" data-aos-duration="1000">
              <img src={pic3} className="max-w-full h-auto" alt="CarthaPlay Usage Guide" />
            </div>
            <div className="md:w-1/2 text-white text-center md:text-right mb-10 md:mb-0 font-baloo2" style={{ direction: 'rtl' }} data-aos="fade-right" data-aos-duration="1000">
              <h2 className="text-4xl md:text-5xl mb-6 font-baloo">تحبّ تفهم كيفاش تستعمل CarthaPlay؟</h2>
              <p className="text-lg mb-6">
                في دليل الاستعمال باش تلقى كلّ شي: كيفاش تخلق حساب، كيفاش تبرمج الألعاب و كيفاش تتابع تقدّم التلامذة.
                كل خطوة مفسّرة بطريقة بسيطة وبصور باش تسهّل عليك الاستعمال من أوّل مرّة.
              </p>
              <Link
                to="/signup/teacher"
                className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-baloo2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                اكتشف المنصة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="account-creation-section py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 flex justify-center" data-aos="fade-right" data-aos-duration="1000">
              <img className="max-w-full h-auto" src={pic4} alt="CarthaPlay Account Creation" />
            </div>
            <div className="md:w-1/2 text-white text-center md:text-right mb-10 md:mb-0 font-baloo2" style={{ direction: 'rtl' }} data-aos="fade-left" data-aos-duration="1000">
              <h2 className="text-4xl md:text-5xl mb-6 font-baloo">المرحلة الأولى : إنشاء حساب</h2>
              <p className="text-lg mb-6">
                في دليل الاستعمال باش تلقى كلّ شي: كيفاش تخلق حساب، كيفاش تبرمج الألعاب و كيفاش تتابع تقدّم التلامذة.
                كل خطوة مفسّرة بطريقة بسيطة وبصور باش تسهّل عليك الاستعمال من أوّل مرّة.
              </p>
              <Link
                to="/signup/teacher"
                className="inline-block bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 font-baloo2"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                اكتشف المنصة
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <section className="contact-section py-16" id="contact">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl text-white text-center mb-12 font-baloo" data-aos="fade-down">تواصل معنا:</h2>
          <div className="flex justify-center mb-12 relative" data-aos="zoom-in" data-aos-duration="1200">
            <div className="absolute left-4 bottom-2 md:left-[15%] md:-bottom-4" data-aos="fade-right" data-aos-delay="300">
              <img src={arrow1} alt="Left Arrow" className="w-20 h-20 md:w-40 md:h-40 max-w-full h-auto" />
            </div>
            <div className="w-64 h-64 md:w-80 md:h-80 relative z-10">
              <img src={pic5} alt="Contact Illustration" className="w-full h-full object-contain" />
            </div>
            <div className="absolute right-4 bottom-2 md:right-[15%] md:-bottom-4" data-aos="fade-left" data-aos-delay="300">
              <img src={arrow2} alt="Right Arrow" className="w-20 h-20 md:w-40 md:h-40 max-w-full h-auto" />
            </div>
          </div>
            {/* Contact Cards (Similar as above, repeat with different details) */}

            <div class="flex flex-col md:flex-row gap-4 p-6">
                <div class="bg-[#004AAD] rounded-3xl p-6 flex-1 relative overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-2.5"
                    data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
                    <div class="flex justify-center mb-8 mt-4">
                        <div class="w-32 h-32 rounded-full border-4 border-transparent relative">
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#f00" stroke-width="2"
                                    stroke-dasharray="60 290" stroke-dashoffset="0" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="2"
                                    stroke-dasharray="220 290" stroke-dashoffset="-60" />
                            </svg>
                        </div>
                    </div>
                    <div class="text-center text-white">

                       <div class="flex justify-center -mb-10">
                            <div class="relative z-10 bottom-36">
                                <img src={roudayna} alt="Profile"
                                    class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                          </div>
                        </div>
                        <h2 class="text-2xl font-bold font-baloo2">Roudayna Kouka</h2>
                        <p class="text-lg mb-4 text-[#5DE0E6] font-baloo2"><strong>CMO</strong></p>
                        <div class="flex items-center justify-center mb-2">
                            <a href="mailto:roudayna.kouka@etudiant-fst.utm.tn"
                                class="text-sm hover:underline font-baloo2">
                                <strong>roudayna.kouka<br />etudiant-fst.utm.tn@</strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <a href="tel:+21693629921" class="text-sm hover:underline font-baloo2">
                                <strong>921 629 93 +216</strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-full transform translate-y-1">
                    </div>
                </div>
                <div class="bg-[#004AAD] rounded-3xl p-6 flex-1 relative overflow-hidden contact-card"
                    data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                    <div class="flex justify-center mb-8 mt-4">
                        <div class="w-32 h-32 rounded-full border-4 border-transparent relative">
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#f00" stroke-width="2"
                                    stroke-dasharray="60 290" stroke-dashoffset="0" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="2"
                                    stroke-dasharray="220 290" stroke-dashoffset="-60" />
                            </svg>
                        </div>
                    </div>
                    <div class="text-center text-white">


                    <div class="flex justify-center -mb-10">
                            <div class="relative z-10 bottom-36">
                                <img src={nader} alt="Profile"
                                    class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                          </div>
                        </div>
                      
                        <h2 class="text-2xl font-bold font-baloo2">Nader Ben Salah</h2>
                        <p class="text-lg mb-4 text-[#5DE0E6] font-baloo2"><strong>CEO</strong></p>
                        <div class="flex items-center justify-center mb-2">
                            <a href="mailto:nader.bensalah@etudiant-fst.utm.tn"
                                class="text-sm hover:underline font-baloo2">
                                <strong> nader.bensalah<br />etudiant-fst.utm.tn@</strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">

                            <a href="tel:+21623032610" class="text-sm hover:underline font-baloo2">
                                <strong> 610 032 23 +216</strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-full transform translate-y-1">
                    </div>
                </div>
                <div class="bg-[#004AAD] rounded-3xl p-6 flex-1 relative overflow-hidden contact-card"
                    data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">
                    <div class="flex justify-center mb-8 mt-4">
                        <div class="w-32 h-32 rounded-full border-4 border-transparent relative">
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#f00" stroke-width="2"
                                    stroke-dasharray="60 290" stroke-dashoffset="0" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="2"
                                    stroke-dasharray="220 290" stroke-dashoffset="-60" />
                            </svg>
                        </div>
                    </div>
                    <div class="text-center text-white">

                        <div class="flex justify-center -mb-10">
                            <div class="relative z-10 bottom-36">
                                <img src={abdou} alt="Profile"
                                    class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                          </div>
                        </div>
                        <h2 class="text-2xl font-bold font-baloo2">Abderrahmen Jedidi</h2>
                        <p class="text-lg mb-4 text-[#5DE0E6] font-baloo2"><strong>CTO</strong></p>
                        <div class="flex items-center justify-center mb-2">
                            <a href="mailto:abderrahmen.jedidi@etudiant-fst.utm.tn"
                                class="text-sm hover:underline font-baloo2">
                                <strong> abderrahmen.jedidi<br />etudiant-fst.utm.tn@</strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <a href="tel:+21653158628" class="text-sm hover:underline font-baloo2">
                                <strong>
                                    628 158 53 +216
                                </strong>
                            </a>
                            <div class="bg-white p-1 rounded-md mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-700" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-full transform translate-y-1">
                    </div>
                </div>

            </div>
        </div>
      </section>
    </header>
  );
};

export default LandingPage;
