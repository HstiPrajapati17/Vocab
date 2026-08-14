import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../App';
import {
  Flame,
  Zap,
  Heart,
  Snowflake,
  Shield,
  Sparkles,
  Clock,
  Gift,
  Gem,
  Plus,
} from 'lucide-react';

const POWERUPS = [
  {
    id: 'streak_freeze',
    icon: Snowflake,
    emoji: '❄️',
    title: 'Streak Freeze',
    tagline: 'Protect your streak',
    desc: 'If you miss a day, one freeze keeps your streak alive. Stack multiple!',
    price: 10,
    currency: 'gem',
    rarity: 'common',
    color: '#3b82f6',
    accent: '#dbeafe',
    quantity: 1,
  },
  {
    id: 'xp_boost_15',
    icon: Zap,
    emoji: '⚡',
    title: 'XP Boost · 15 min',
    tagline: 'Double XP rush',
    desc: 'Earn 2× XP from every lesson you complete during the next 15 minutes.',
    price: 18,
    currency: 'gem',
    rarity: 'rare',
    color: '#f59e0b',
    accent: '#fef3c7',
    minutes: 15,
  },
  {
    id: 'refill_hearts',
    icon: Heart,
    emoji: '❤️',
    title: 'Refill Hearts',
    tagline: 'Full tank',
    desc: 'Restore all your hearts to the max right now. Instant energy to play!',
    price: 15,
    currency: 'gem',
    rarity: 'common',
    color: '#ef4444',
    accent: '#fee2e2',
  },
];

const GEM_PACKS = [
  {
    id: 'gem_pack_small',
    icon: Gem,
    emoji: '💎',
    title: 'Gem Stash',
    tagline: 'Kickstart',
    desc: '50 gems to grab a few power-ups when you need them.',
    price: 4.99,
    currency: 'usd',
    rarity: 'common',
    color: '#06b6d4',
    accent: '#cffafe',
    quantity: 50,
    tag: 'BEST VALUE',
  },
  {
    id: 'gem_pack_medium',
    icon: Sparkles,
    emoji: '✨',
    title: 'Treasure Pile',
    tagline: 'Popular',
    desc: '180 gems — unbeatable for stocking up on boosts & freezes.',
    price: 9.99,
    currency: 'usd',
    rarity: 'rare',
    color: '#8b5cf6',
    accent: '#ede9fe',
    quantity: 180,
    tag: 'POPULAR',
  },
  {
    id: 'gem_pack_large',
    icon: Gift,
    emoji: '🎁',
    title: 'Gem Fortress',
    tagline: 'Premium',
    desc: '500 gems — never run out of refills, freezes & boosts again.',
    price: 19.99,
    currency: 'usd',
    rarity: 'epic',
    color: '#ec4899',
    accent: '#fce7f3',
    quantity: 500,
    tag: 'PREMIUM',
  },
];

const HEART_PACKS = [
  {
    id: 'hearts_pack_10',
    icon: Shield,
    emoji: '💖',
    title: 'Heart Forever',
    tagline: 'Permanent upgrade',
    desc: 'Raise your max hearts by +5 and gain an instant 10 hearts refill.',
    price: 80,
    currency: 'gem',
    rarity: 'epic',
    color: '#f43f5e',
    accent: '#ffe4e6',
    quantity: 10,
    bonusMax: 5,
  },
];

const RarityBadge = ({ rarity }) => {
  const map = {
    common: { label: 'Common', bg: '#f3f4f6', text: '#4b5563' },
    rare: { label: 'Rare', bg: '#ede9fe', text: '#6d28d9' },
    epic: { label: 'Epic', bg: '#fce7f3', text: '#be185d' },
  };
  const s = map[rarity] || map.common;
  return (
    <span className="h_shop_rarity" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
};

const CountdownTimer = ({ target }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(target) - now;
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return (
    <span className="h_shop_active_badge">
      <Clock size={12} /> {m}:{s.toString().padStart(2, '0')} left
    </span>
  );
};

const Shop = () => {
  const { user, buyShopItem, showToast, addGems } = useApp();
  const [confirmItem, setConfirmItem] = useState(null);
  const gems = user?.gems || 0;
  const hearts = user?.hearts || 0;
  const maxHearts = user?.maxHearts || 5;
  const streakFreeze = user?.powerups?.streakFreeze || 0;
  const xpBoostActiveUntil = user?.powerups?.xpBoostActiveUntil || null;
  const xpBoostActive = xpBoostActiveUntil && new Date(xpBoostActiveUntil) > new Date();

  const ownedCountMap = useMemo(() => ({
    streak_freeze: streakFreeze,
    refill_hearts: Math.round((hearts / maxHearts) * 100),
  }), [streakFreeze, hearts, maxHearts]);

  const onBuyClick = (item) => {
    if (item.currency === 'gem' && (user?.gems || 0) < item.price) {
      showToast(`Need ${item.price - (user?.gems || 0)} more 💎`, 'error');
      return;
    }
    setConfirmItem(item);
  };

  const confirmPurchase = () => {
    if (!confirmItem) return;
    const item = confirmItem;
    setConfirmItem(null);
    if (item.currency === 'usd') {
      showToast('💎 Demo: Granting gems directly', 'success');
      addGems(item.quantity || 0, item.title);
      return;
    }
    buyShopItem(item);
  };

  const renderCard = (item, size = 'normal') => {
    const Icon = item.icon || Heart;
    const canAfford = item.currency === 'gem' ? gems >= item.price : true;
    const owned = ownedCountMap[item.id];
    const isBoost = item.id === 'xp_boost_15' || item.id === 'xp_boost_30';
    return (
      <div
        key={item.id}
        className={`h_shop_card h_shop_card_${item.rarity} ${size === 'wide' ? 'h_shop_card_wide' : ''}`}
        style={{
          '--accent': item.color,
          '--accent-soft': item.accent,
        }}
      >
        <div className="h_shop_card_glow" />
        <div className="h_shop_card_head">
          <div
            className="h_shop_icon_wrap"
            style={{ background: item.accent, color: item.color }}
          >
            {item.emoji && <span className="h_shop_icon_emoji">{item.emoji}</span>}
            <Icon size={item.emoji ? 20 : 28} />
          </div>
          <div className="h_shop_card_meta">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <RarityBadge rarity={item.rarity} />
              {item.tag && <span className="h_shop_tag">{item.tag}</span>}
              {isBoost && xpBoostActive && <CountdownTimer target={xpBoostActiveUntil} />}
            </div>
            <div className="h_shop_card_title">{item.title}</div>
            <div className="h_shop_card_tagline">{item.tagline}</div>
          </div>
        </div>
        <p className="h_shop_card_desc">{item.desc}</p>
        <div className="h_shop_card_foot">
          <div className="h_shop_owned" title="Owned">
            {typeof owned === 'number' && item.id === 'refill_hearts' ? (
              <Heart size={14} style={{ color: '#ef4444' }} />
            ) : null}
            {typeof owned === 'number' && item.id === 'streak_freeze' ? (
              <Snowflake size={14} style={{ color: '#3b82f6' }} />
            ) : null}
            {typeof owned === 'number' ? (
              <span>{item.id === 'refill_hearts' ? `${hearts}/${maxHearts}` : `×${owned}`}</span>
            ) : null}
            {item.quantity && item.currency === 'gem' && item.id.startsWith('gem_') ? (
              <span>+{item.quantity} 💎</span>
            ) : null}
            {item.id === 'hearts_pack_10' ? (
              <span>+{item.bonusMax} max hearts · +{item.quantity} refill</span>
            ) : null}
          </div>
          <button
            type="button"
            className={`h_shop_buy_btn ${canAfford ? '' : 'h_shop_buy_disabled'}`}
            onClick={() => onBuyClick(item)}
            disabled={!canAfford}
          >
            {item.currency === 'gem' ? (
              <>
                <Gem size={15} />
                <span>{item.price}</span>
              </>
            ) : (
              <>
                <span>${item.price}</span>
                <Plus size={13} />
                <span>{item.quantity}💎</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h_shop_page">
      <header className="h_shop_hero">
        <div className="h_shop_hero_bg" />
        <div className="h_shop_hero_content">
          <div>
            <h1 className="h_shop_title">
              Shop <Sparkles size={24} style={{ color: '#fbbf24' }} />
            </h1>
            <p className="h_shop_subtitle">
              Trade gems for power-ups. Stock up and climb the leaderboard faster.
            </p>
          </div>
          <div className="h_shop_stats">
            <div className="h_shop_stat">
              <span className="h_shop_stat_icon h_shop_stat_gem"><Gem size={18} /></span>
              <div>
                <div className="h_shop_stat_value">{gems}</div>
                <div className="h_shop_stat_label">Gems</div>
              </div>
            </div>
            <div className="h_shop_stat">
              <span className="h_shop_stat_icon h_shop_stat_heart"><Heart size={18} /></span>
              <div>
                <div className="h_shop_stat_value">{hearts} / {maxHearts}</div>
                <div className="h_shop_stat_label">Hearts</div>
              </div>
            </div>
            <div className="h_shop_stat">
              <span className="h_shop_stat_icon h_shop_stat_freeze"><Snowflake size={18} /></span>
              <div>
                <div className="h_shop_stat_value">{streakFreeze}</div>
                <div className="h_shop_stat_label">Freezes</div>
              </div>
            </div>
            {xpBoostActive && (
              <div className="h_shop_stat h_shop_stat_pulse">
                <span className="h_shop_stat_icon h_shop_stat_boost"><Zap size={18} /></span>
                <div>
                  <div className="h_shop_stat_value">
                    <CountdownTimer target={xpBoostActiveUntil} />
                  </div>
                  <div className="h_shop_stat_label">2× XP</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="h_shop_section">
        <div className="h_shop_section_head">
          <h2 className="h_shop_section_title">
            <Flame size={20} style={{ color: '#ef4444' }} /> Power-Ups
          </h2>
          <span className="h_shop_section_note">Spend gems earned in lessons</span>
        </div>
        <div className="h_shop_grid_3">
          {POWERUPS.map((it) => renderCard(it))}
        </div>
      </section>

      <section className="h_shop_section">
        <div className="h_shop_section_head">
          <h2 className="h_shop_section_title">
            <Shield size={20} style={{ color: '#f43f5e' }} /> Hearts
          </h2>
          <span className="h_shop_section_note">Upgrades last forever</span>
        </div>
        <div className="h_shop_grid_3">
          {HEART_PACKS.map((it) => renderCard(it))}
        </div>
      </section>

      <section className="h_shop_section">
        <div className="h_shop_section_head">
          <h2 className="h_shop_section_title">
            <Gem size={20} style={{ color: '#06b6d4' }} /> Gem Packs
          </h2>
          <span className="h_shop_section_note">Real-money · demo grants gems instantly</span>
        </div>
        <div className="h_shop_grid_3">
          {GEM_PACKS.map((it) => renderCard(it))}
        </div>
      </section>

      {confirmItem && (
        <div className="h_shop_modal_backdrop" onClick={() => setConfirmItem(null)}>
          <div
            className="h_shop_modal"
            onClick={(e) => e.stopPropagation()}
            style={{ '--accent': confirmItem.color, '--accent-soft': confirmItem.accent }}
          >
            <div className="h_shop_modal_head">
              <div
                className="h_shop_icon_wrap h_shop_modal_icon"
                style={{ background: confirmItem.accent, color: confirmItem.color }}
              >
                {confirmItem.emoji && <span className="h_shop_icon_emoji">{confirmItem.emoji}</span>}
                <confirmItem.icon size={confirmItem.emoji ? 22 : 30} />
              </div>
              <div>
                <div className="h_shop_modal_title">{confirmItem.title}</div>
                <div className="h_shop_modal_tagline">{confirmItem.tagline}</div>
              </div>
            </div>
            <p className="h_shop_modal_desc">{confirmItem.desc}</p>
            <div className="h_shop_modal_price">
              {confirmItem.currency === 'gem' ? (
                <>
                  <Gem size={20} />
                  <span>{confirmItem.price}</span>
                  <span className="h_shop_modal_you">· You have {gems}</span>
                </>
              ) : (
                <>
                  <span>${confirmItem.price}</span>
                  <span className="h_shop_modal_you">· Demo: Free gems</span>
                </>
              )}
            </div>
            <div className="h_shop_modal_actions">
              <button
                type="button"
                className="h_shop_btn_ghost"
                onClick={() => setConfirmItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h_shop_btn_primary"
                onClick={confirmPurchase}
                disabled={confirmItem.currency === 'gem' && gems < confirmItem.price}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
