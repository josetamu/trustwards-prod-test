'use client'

import { useEffect } from 'react';

export default function BuilderHtmlClass() {
  useEffect(() => {
    const htmlEl = document.documentElement;
    htmlEl.classList.add('trustwards-builder');
    return () => {
      htmlEl.classList.remove('trustwards-builder');
    };
  }, []);

  return null;
} 