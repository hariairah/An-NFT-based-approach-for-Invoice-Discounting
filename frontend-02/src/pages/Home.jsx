import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import banner from '../assets/banner.jpg'
import logo from '../assets/logo3.png'
import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons'; 

function Home() {
  useEffect(() => {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["secure", "easy", "efficient"];
    const typingDelay = 75;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) {
          cursorSpan.classList.add("typing");
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex + 1); // Clear and set new text
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
      }
    }
    
    function erase() {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) {
          cursorSpan.classList.add("typing");
        }
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1); // Clear and set text to erase
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }
    

    if (textArray.length) setTimeout(type, newTextDelay + 250);
  }, []);
  return (
    <div className="home-div">
      <div className="top-home">
        <img src={banner} className='banner-img'></img>
        <div className='top-bar'>
          <img src={logo} className='logo-home'></img>
          <a href="" className='website-name'>InvoiceDiscounting</a>
          <a href="" className='contact-us'>Contact Us</a>
        </div>
      </div>
      <div className='banner-text'>
        <h3 className='heading'>Smart Finance, Smarter Future:</h3>
        <p className='para1'>Embrace Blockchain and NFTs for</p>
        <p className='para2'>Invoice Discounting Excellence</p>
        <div className='get-started'>
          <Link to="/authentication" className='gs-button'>Get Started</Link>
        </div>
      </div>
      <div className='middle'>
        <div className='middle-left'>
          <div className="middle-text-container">
            <p className='middle-text-container1'>Invoice Discounting made <span className="typed-text"></span><span className="cursor">&nbsp;</span></p>
          </div>
        </div>
        <div className='middle-right'>
          <h2 className="how">How do we do it differently?</h2>
          <p className="how1">Innovatively, we leverage NFTs and blockchain to redefine invoice discounting.</p>
          <p className="how1">By utilizing NFTs for invoices, we combat fake and duplicate invoices, ensuring heightened security.</p>
          <p className="how1">The blockchain provides transparent, publicly accessible data, while </p>
          <p className="how1"> decentralized applications empower individuals to participate as investors, sellers, or buyers, setting us apart in the industry.</p> 
        </div>
      </div>
      <div className='footer'>
        <div className='footer-left'>
          <h3>InvoiceDiscounting</h3>
          <p className='copyright'>Copyright @ 2023</p>
        </div>
        <div className='footer-center'>
          <div className='details1'>
            <FontAwesomeIcon icon={faMapMarker} className='icon1'></FontAwesomeIcon>
            <p>Banashankari, Bengaluru</p>
          </div>
          <div className='details2'>
            <FontAwesomeIcon icon={faPhone} className='icon2'></FontAwesomeIcon>
            <p>+91 8345773247</p>
          </div>
          <div className='details3'>
            <FontAwesomeIcon icon={faEnvelope} className='icon3'></FontAwesomeIcon>
            <p><a href="mailto:support@company.com" className='company-name'>support@invid.com</a></p>
          </div>
        </div>
        <div className='footer-right'>
          <h4 className='about-us'>About us</h4>
          <p className="footer-company-about1">
            We are a team of four: Aishwarya, Haria, Shashank and Vinay 
          </p>
          <p className="footer-company-about2">who built this project with the aim of trying to make </p>
          <p className="footer-company-about3">invoice discounting a more secure process.</p>
          <div className="footer-icons">
            <a href="https://github.com/your-github-repo" className='github-icon'>
              <FontAwesomeIcon icon={faGithub}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
