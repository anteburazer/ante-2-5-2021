import React from 'react';

interface ISpinnerProps {
  className?: string;
}

const Spinner: React.FC<ISpinnerProps> = ({ className }) => (
  <div className={className}>
    <div className="spinner-grow text-light" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
);

export default Spinner;