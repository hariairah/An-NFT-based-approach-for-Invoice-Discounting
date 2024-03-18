import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { AiOutlineTable } from 'react-icons/ai';
import { BiMoney } from 'react-icons/bi';
import { MdSell } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { BsPenFill } from 'react-icons/bs';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const routes = [
  {
    path: '/main-app/portfolio',
    name: "Portfolio",
    icon: <AiOutlineTable />,
  },
  {
    path: '/main-app/invest',
    name: "Investments",
    icon: <BiMoney />,
  },
  {
    path: '/main-app/sell',
    name: "Create/Mint Token",
    icon: <MdSell />,
  },
  {
    path: '/main-app/unsigned',
    name: "Unsigned Invoices",
    icon: <BsPenFill />,
  },
  {
    path: '/main-app/settings',
    name: "Settings",
    icon: <FiSettings />,
  },
];

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className='main-container'>
      <motion.div
        animate={{ width: isOpen ? "180px" : "60px" }}
        initial={false}
        className='sidebar'
      >
        <div className='top-section'>
          <div className='logo-bars'>
            <div className='bars'>
              <FaBars onClick={toggle} />
            </div>
            {isOpen && <h1 className='logo'>Invoice Discounting</h1>}
          </div>
        </div>
        <section className='routes'>
          {routes.map((route, index) => (
            <NavLink to={route.path} key={index} className="link">
              <div className='icon'>{route.icon}</div>
              <AnimatePresence>
                {isOpen && <motion.div className='link_text'>{route.name}</motion.div>}
              </AnimatePresence>
            </NavLink>
          ))}
        </section>
      </motion.div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Sidebar;
