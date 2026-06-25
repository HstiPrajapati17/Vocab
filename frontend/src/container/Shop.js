import React from 'react';
import { useApp } from '../App';

const items = [
  { icon: '❄️', title: 'Streak Freeze', desc: 'Protect your streak if you miss a day', price: 10, type: 'gem' },
  { icon: '💊', title: 'XP Boost', desc: 'Double XP for 15 minutes', price: 20, type: 'gem' },
  { icon: '❤️', title: 'Refill Hearts', desc: 'Restore all hearts instantly', price: 15, type: 'gem' },
];

const Shop = () => {
  const { user } = useApp();
  const gems = Math.floor((user?.xp || 0) / 10);

  return (
    <div className="h_shop_page">
      <h1 className="h_shop_title">Shop</h1>
      <p className="text-muted mb-4">Spend gems earned from lessons on power-ups</p>

      <div className="h_shop_gems mb-4">
        <span className="h_shop_gems_icon">💎</span>
        <span className="fw-bold">{gems} gems available</span>
      </div>

      <div className="h_shop_section_title">Power-Ups</div>
      {items.map((item) => (
        <div key={item.title} className="h_shop_item">
          <span className="h_shop_item_icon">{item.icon}</span>
          <div className="flex-grow-1">
            <div className="fw-bold">{item.title}</div>
            <div className="text-muted small">{item.desc}</div>
          </div>
          <button type="button" className="h_shop_buy_btn" disabled={gems < item.price}>
            GET FOR 💎 {item.price}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Shop;
