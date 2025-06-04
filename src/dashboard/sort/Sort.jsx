import { useState } from 'react';
import './Sort.css';
import { Dropdown } from '../dropdown/Dropdown';

export const Sort = ({ onSortChange }) => {
  const [sortMode, setSortMode] = useState('alphabetical');
  const [ascending, setAscending] = useState(true);

  const handleSortChange = (mode, direction) => {
    setSortMode(mode);
    setAscending(direction);  
    onSortChange(mode, direction);
  };

  const renderSortOptions = () => {
    return (
      <>
        <button 
          className="dropdown__item" 
          onClick={(e) => {
            e.stopPropagation();
            handleSortChange('alphabetical', !ascending);
          }}
        >
          {sortMode === 'alphabetical' ? (ascending ? 'A-Z' : 'Z-A') : 'A-Z'} {sortMode === 'alphabetical' ? (ascending ? '↓' : '↑') : '↓'}
        </button>
        <button 
          className="dropdown__item" 
          onClick={(e) => {
            e.stopPropagation();
            handleSortChange('date', !ascending);
          }}
        >
          {sortMode === 'date' ? (ascending ? 'Date' : 'Date+') : 'Date'} {sortMode === 'date' ? (ascending ? '↓' : '↑') : '↓'}
        </button>
      </>
    );
  };

  return (
    <div className="sort__button" onClick={() => document.querySelector('.dropdown__toggle').click()}>
      Sort
      <Dropdown 
        label=""
        position="bottom-right"
        customMenu={renderSortOptions}
        showButton={false}
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    </div>
  );
};
