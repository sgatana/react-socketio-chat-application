import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';

export default function Header({ onSignOut, user }) {
  return (
    <div className='header'>
      <div className='header-content'>
        <span className='user-icon'>
          <MdAccountCircle /> welcome {user.username}
        </span>
        <span className='user-icon' onClick={onSignOut}>
          <IoMdLogOut />
          Logout
        </span>
      </div>
    </div>
  );
}
