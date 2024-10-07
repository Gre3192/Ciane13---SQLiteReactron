import React, { useState } from 'react';
import { FaBars, FaArrowLeft, FaCog, FaChevronDown } from 'react-icons/fa';
import { sidebarItem } from "../JsonConfig/SidebarItem";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleCogClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleSidebarClick = (e) => {
    if (e.target.closest('.fa-cog')) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const toggleSection = (index) => {
    setOpenSections(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={handleSidebarClick} className="flex flex-col top-0 z-20">
        <div className={`w-64 bg-gray-800 h-screen text-white p-6 pr-0 fixed transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-52'}`}>
          <div className='relative flex flex-col h-full'>
            <button onClick={toggleSidebar} className={`scale-150 pr-4 self-end top-0 right-0 ${!isOpen ? 'visible' : 'hidden'}`}>
              <FaBars />
            </button>
            <button onClick={toggleSidebar} className={`scale-150 pr-4 self-end top-0 right-0 ${isOpen ? 'visible' : 'hidden'}`}>
              <FaArrowLeft />
            </button>
            <ul className="list-none mt-8">
              {sidebarItem.map((item, index) => {
                const isOpenSection = openSections[index];
                return (
                  <li key={index} className="py-2 w-fit">
                    {item.fields ? (
                      <div>
                        <div className="flex items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSection(index); }}>
                          <span>{item.title}</span>
                          <FaChevronDown className={`ml-1 w-3 h-3 transform transition-transform duration-300 ${isOpenSection ? 'rotate-0' : '-rotate-90'}`} />
                        </div>
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpenSection ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <ul className="list-none ml-4 mt-2">
                            {item.fields.map((subItem, subIndex) => (
                              <li key={subIndex} className="py-1 hover:bg-gray-700 hover:text-gray-300 rounded cursor-pointer">
                                <Link to={subItem.link} onClick={handleLinkClick} className="block px-2">
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div onClick={(e) => { e.stopPropagation(); }}>
                        <Link to={item.link} onClick={handleLinkClick} className="block px-2 py-1 hover:bg-gray-700 hover:text-gray-300 rounded cursor-pointer">
                          {item.name}
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link
              to="/Setting"
              className="absolute bottom-9 right-4 scale-150 transform transition-transform duration-300 hover:scale-175 hover:rotate-180 fa-cog"
              onClick={handleCogClick}
            >
              <FaCog />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
