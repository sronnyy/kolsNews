"use client"

import CustomButton from './Utils/Button'; // Importe o botão


export default function Nav({ children, className, onRunAllClick }) {
  return (
    <div className={`${className} bg-gray-900 py-8 absolute right-0 left-0`}>
      <div className="flex items-center container  gap-3 justify-between">
        <h1 className="text-2xl uppercase text-white">Kols Tracker</h1>

        <div className='flex gap-3'>
          {children}
          <CustomButton handleClick={onRunAllClick}>RUN</CustomButton>
        </div>

      </div>
    </div>
  );
}
