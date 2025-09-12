'use client';

import React, { useState, useEffect } from 'react';
import './Expander.css';

const Expander = ({
  items = [],
  mode = 'click',
  singleOpen = true,
  openAll = false,
  openThis = null,
  openAtBuilder = true,
  contentTransitionDuration = 0.3,
  includeSchema = false,
  context = 'default' // Nueva prop para el contexto
}) => {
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    if (openAll) {
      setOpenItems(new Set(items.map((_, index) => index)));
    } else if (openThis !== null && openThis >= 0 && openThis < items.length) {
      setOpenItems(new Set([openThis]));
    } else if (openAtBuilder) {
      setOpenItems(new Set(items.map((_, index) => index)));
    }
  }, [openAll, openThis, openAtBuilder, items.length]);

  const toggleItem = (index) => {
    if (mode === 'hover') return;

    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      
      if (singleOpen) {
        if (newOpenItems.has(index)) {
          newOpenItems.clear();
        } else {
          newOpenItems.clear();
          newOpenItems.add(index);
        }
      } else {
        if (newOpenItems.has(index)) {
          newOpenItems.delete(index);
        } else {
          newOpenItems.add(index);
        }
      }
      
      return newOpenItems;
    });
  };

  const handleMouseEnter = (index) => {
    if (mode === 'hover') {
      setOpenItems(prev => {
        const newOpenItems = new Set(prev);
        if (singleOpen) {
          newOpenItems.clear();
        }
        newOpenItems.add(index);
        return newOpenItems;
      });
    }
  };

  const handleMouseLeave = (index) => {
    if (mode === 'hover') {
      setOpenItems(prev => {
        const newOpenItems = new Set(prev);
        newOpenItems.delete(index);
        return newOpenItems;
      });
    }
  };

  return (
    <div
      className={`tw-expander-wrapper expander-context-${context}`}
      data-openatbuilder={openAtBuilder}
      data-contenttransitionduration={contentTransitionDuration}
      data-mode={mode}
      data-singleopen={singleOpen}
      data-openall={openAll}
      data-openthis={openThis}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="tw-expander-item"
          itemScope={includeSchema ? "" : undefined}
          itemType={includeSchema ? "https://schema.org/Question" : undefined}
        >
          <div
            className={`tw-expander-question ${openItems.has(index) ? 'tw-expander-active' : ''}`}
            onClick={() => toggleItem(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <div className="tw-expander-icon">
              {item.icon || (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.0013 2.66699V13.3337M13.3346 8.00033H2.66797" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <h3
              className="tw-expander-question-text"
              itemProp={includeSchema ? "name" : undefined}
            >
              {item.label}
            </h3>
          </div>
          <div
            className={`tw-expander-answer ${openItems.has(index) ? 'tw-expander-open' : ''}`}
            itemScope={includeSchema ? "" : undefined}
            itemProp={includeSchema ? "acceptedAnswer" : undefined}
            itemType={includeSchema ? "https://schema.org/Answer" : undefined}
          >
            <div
              className="tw-expander-answer-content"
              itemProp={includeSchema ? "text" : undefined}
            >
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Expander;
