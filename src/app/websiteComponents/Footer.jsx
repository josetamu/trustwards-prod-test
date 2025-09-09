import React, { useState } from 'react';
import './Footer.css';

const Footer = ({ className = '' }) => {
  const [openFaqItem, setOpenFaqItem] = useState(null);

  const toggleFaqItem = (index) => {
    setOpenFaqItem(openFaqItem === index ? null : index);
  };

  const faqData = [
    {
      question: "¿Qué es Trustwards?",
      answer: "Trustwards es una plataforma que te permite crear sitios web profesionales de manera fácil y rápida, sin necesidad de conocimientos técnicos."
    },
    {
      question: "¿Cómo funciona el constructor de sitios?",
      answer: "Nuestro constructor utiliza un sistema de arrastrar y soltar intuitivo que te permite personalizar cada elemento de tu sitio web en tiempo real."
    },
    {
      question: "¿Puedo usar mi propio dominio?",
      answer: "Sí, puedes conectar tu dominio personalizado o usar uno de nuestros subdominios gratuitos."
    },
    {
      question: "¿Qué incluye el plan gratuito?",
      answer: "El plan gratuito incluye acceso a todas las plantillas, constructor de sitios, hosting básico y soporte por email."
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer: "Sí, ofrecemos soporte técnico por email y chat en vivo para todos nuestros usuarios."
    }
  ];

  return (
    <footer className={`tw-footer ${className}`}>
      {/* FAQ Section */}
      <section className="tw-footer__faq">
        <div className="tw-footer__container">
          <h2 className="tw-footer__faq-title">Preguntas Frecuentes</h2>
          <div className="tw-footer__faq-list">
            {faqData.map((item, index) => (
              <div key={index} className="tw-footer__faq-item">
                <button 
                  className="tw-footer__faq-question"
                  onClick={() => toggleFaqItem(index)}
                  aria-expanded={openFaqItem === index}
                >
                  <span>{item.question}</span>
                  <span className={`tw-footer__faq-icon ${openFaqItem === index ? 'tw-footer__faq-icon--open' : ''}`}>
                    +
                  </span>
                </button>
                <div className={`tw-footer__faq-answer ${openFaqItem === index ? 'tw-footer__faq-answer--open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="tw-footer__main">
        <div className="tw-footer__container">
          <div className="tw-footer__content">
            <div className="tw-footer__brand">
              <img src="/assets/logo-light-mode.svg" alt="Trustwards" className="tw-footer__logo" />
              <p className="tw-footer__description">
                Crea sitios web profesionales sin conocimientos técnicos. 
                Herramientas potentes para hacer crecer tu negocio online.
              </p>
            </div>
            
            <div className="tw-footer__links">
              <div className="tw-footer__link-group">
                <h3 className="tw-footer__link-title">Producto</h3>
                <ul className="tw-footer__link-list">
                  <li><a href="#caracteristicas" className="tw-footer__link">Características</a></li>
                  <li><a href="#precios" className="tw-footer__link">Precios</a></li>
                  <li><a href="#plantillas" className="tw-footer__link">Plantillas</a></li>
                  <li><a href="#integraciones" className="tw-footer__link">Integraciones</a></li>
                </ul>
              </div>
              
              <div className="tw-footer__link-group">
                <h3 className="tw-footer__link-title">Empresa</h3>
                <ul className="tw-footer__link-list">
                  <li><a href="#sobre-nosotros" className="tw-footer__link">Sobre Nosotros</a></li>
                  <li><a href="#blog" className="tw-footer__link">Blog</a></li>
                  <li><a href="#carreras" className="tw-footer__link">Carreras</a></li>
                  <li><a href="#contacto" className="tw-footer__link">Contacto</a></li>
                </ul>
              </div>
              
              <div className="tw-footer__link-group">
                <h3 className="tw-footer__link-title">Soporte</h3>
                <ul className="tw-footer__link-list">
                  <li><a href="#ayuda" className="tw-footer__link">Centro de Ayuda</a></li>
                  <li><a href="#documentacion" className="tw-footer__link">Documentación</a></li>
                  <li><a href="#comunidad" className="tw-footer__link">Comunidad</a></li>
                  <li><a href="#status" className="tw-footer__link">Estado del Servicio</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="tw-footer__bottom">
            <div className="tw-footer__copyright">
              <p>&copy; 2024 Trustwards. Todos los derechos reservados.</p>
            </div>
            <div className="tw-footer__legal">
              <a href="#privacidad" className="tw-footer__legal-link">Política de Privacidad</a>
              <a href="#terminos" className="tw-footer__legal-link">Términos de Servicio</a>
              <a href="#cookies" className="tw-footer__legal-link">Cookies</a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="tw-footer__newsletter">
        <div className="tw-footer__container">
          <div className="tw-footer__newsletter-content">
            <div className="tw-footer__newsletter-text">
              <h3 className="tw-footer__newsletter-title">Mantente al día</h3>
              <p className="tw-footer__newsletter-description">
                Recibe las últimas actualizaciones, consejos y ofertas especiales directamente en tu bandeja de entrada.
              </p>
            </div>
            <form className="tw-footer__newsletter-form">
              <div className="tw-footer__newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Tu dirección de email"
                  className="tw-footer__newsletter-input"
                  required
                />
                <button type="submit" className="tw-cta tw-cta--newsletter">
                  Suscribirse
                </button>
              </div>
              <p className="tw-footer__newsletter-disclaimer">
                Al suscribirte, aceptas recibir emails de marketing. Puedes darte de baja en cualquier momento.
              </p>
            </form>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
