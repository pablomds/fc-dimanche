import React from 'react';
import { Link } from 'react-router-dom';
import RedCard1 from '../../assets/notFound/RedCard404.jpg';
import RedCard2 from '../../assets/notFound/RedCard4042.jpg';
import RedCard3 from '../../assets/notFound/RedCard4043.jpg';

const NotFound: React.FC = () => {
  
  const images = [RedCard1, RedCard2, RedCard3];
  
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-y-hidden select-none">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <img src={randomImage} alt="Red Card" className="w-2/5 min-w-[400px]" />
      <p className="text-xl text-gray-700 my-4 font-semibold">
        Page non trouvée
      </p>
      <Link
        to="/"
        className="flex justify-center drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#60A5FA] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
      >
        Revenir sur le terrain
      </Link>
    </div>
  );
};

export default NotFound;