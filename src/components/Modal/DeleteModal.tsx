import React, { useRef, useEffect, useState } from 'react';
import { MatchVM } from '../../viewModels/MatchVM';
import Button from '../Buttons/Button';

interface IndexProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    matchVM: MatchVM;
};

const DeleteModal: React.FC<IndexProps> = ({ isOpen, onClose, matchVM, onDelete }) => {

    const modalRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const verifyPassword = () => {
        if (inputValue === 'je confirme') return true
        else return false
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
          }
        };
    
        if (isOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-20 flex justify-center items-center transition-colors ${
        isOpen ? "visible bg-black/50 " : "invisible"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white w-3/4 h-1/2 md:w-1/2 lg:w-1/3 md:h-1/3 rounded-xl shadow p-6 transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <h1 className="text-center text-xl font-semibold mb-8">
          Supprimer le match
        </h1>
        <div>
          Êtes-vous sur de vouloir <span className="font-semibold">annuler</span>  le match du{" "}
          {matchVM.getEventDateTimeAsString()} prévu à {matchVM.eventLocation} ?
        </div>
        <div className="mt-4 flex flex-col group">
          <label
            htmlFor="eventLocation"
            className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
          >
            SAISIS 'je confirme' POUR ANNULER LE MATCH :
          </label>
          <input
            type="text"
            placeholder='je confirme'
            onChange={e => setInputValue(e.target.value)}
            maxLength={11}
            className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
          />
        </div>
        <div className="mt-4 flex justify-center">
            <Button onClick={onDelete} buttonText='Confirmer' isDisabled={!verifyPassword()} className="bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] text-[#FFFFFF] p-4 h-14 w-full md:w-72 md:h-16" />
        </div>
      </div>
    </div>
  );
}

export default DeleteModal