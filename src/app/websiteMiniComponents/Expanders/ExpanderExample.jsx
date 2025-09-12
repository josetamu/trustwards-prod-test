'use client';

import React from 'react';
import Expander from './Expander';
import './ExpanderExample.css';

const ExpanderExample = () => {
  const exampleData = [
    {
      label: "¿Cómo funciona el sistema?",
      content: "Nuestro sistema utiliza tecnología avanzada para proporcionar soluciones eficientes y escalables."
    },
    {
      label: "¿Cuáles son los beneficios?",
      content: "Los beneficios incluyen mayor productividad, reducción de costos y mejor experiencia del usuario."
    },
    {
      label: "¿Hay soporte técnico?",
      content: "Sí, ofrecemos soporte técnico 24/7 para todos nuestros clientes con diferentes niveles de servicio."
    }
  ];

  return (
    <div className="expander-example-page">
      <h2>Ejemplo de Expander en Página</h2>
      
      {/* Estilo por defecto */}
      <section className="example-section">
        <h3>Estilo por defecto</h3>
        <Expander
          items={exampleData}
          context="default"
        />
      </section>

      {/* Estilo personalizado para página */}
      <section className="example-section">
        <h3>Estilo personalizado para página</h3>
        <Expander
          items={exampleData}
          context="page"
          mode="click"
          singleOpen={false}
        />
      </section>

      {/* Estilo minimalista */}
      <section className="example-section">
        <h3>Estilo minimalista</h3>
        <Expander
          items={exampleData}
          context="minimal"
          mode="hover"
        />
      </section>
    </div>
  );
};

export default ExpanderExample;
