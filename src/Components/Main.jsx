"use client"


export default function Main({ children, className }) {
  return (
    <div className={`${className}`}>

      <div className={`container `}>
        {children}
      </div>
    </div>
  );
}
