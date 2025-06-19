import React, {useState} from 'react';
import ChatList from './chatlist';
import MessageBox from './messagebox';

const contacts = [
  { id: 1, name: 'trung úy gấu gấu 🐶', img: '🐻' },
  { id: 2, name: 'cusibudi', img: '📸' },
  { id: 3, name: 'x_xlirin24', img: '👤' },
  { id: 4, name: 'draculez ☆ ☆ ☆', img: '🐱' },
];

// Dummy messages for each contact
const allMessages = {
  1: [
    { from: 'them', text: 'hey 🐶' }, 
    { from: 'me', text: 'hi!' }
  ],
  2: [{ from: 'them', text: 'what’s up 📸' }],
  3: [
    { from: 'them', text: 'Hơn tháng rồi con tó' },
    { from: 'me', text: '😬\nit dùng insta' },
    { from: 'me', text: 't sống chủ yếu ở discord' },
    { from: 'them', text: 'Vãi cức\nSài mà không biết là gì\n:))' },
  ],
  4: [{ from: 'them', text: 'meow 🐱' }],
};

export default function Messenger() {
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);

  const handleSelectContact = (id) => {
    setSelectedContactId(id);
  };

  return (
    <div className="w-full flex h-screen bg-black text-white">
      <ChatList
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelect={handleSelectContact}
      />
      <MessageBox messages={allMessages[selectedContactId]} />
    </div>
  );
}