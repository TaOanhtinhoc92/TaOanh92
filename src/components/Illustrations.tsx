import React from 'react';

interface IllustrationProps {
  name?: string;
  className?: string;
  size?: number | string;
}

export const Illustration: React.FC<IllustrationProps> = ({
  name = 'default',
  className = 'w-full h-48 max-h-56',
}) => {
  switch (name) {
    case 'trang-tri-canh-quan':
    case 'cong-vien-truong-hoc':
      return (
        <svg viewBox="0 0 320 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#F0FDF4" />
          <path d="M0 160 Q 80 145 160 155 T 320 150 L 320 200 L 0 200 Z" fill="#BBF7D0" />
          {/* School building background */}
          <rect x="30" y="80" width="100" height="80" rx="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
          <polygon points="25,80 80,45 135,80" fill="#EF4444" />
          <rect x="70" y="125" width="20" height="35" fill="#B45309" />
          <rect x="45" y="95" width="15" height="15" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
          <rect x="100" y="95" width="15" height="15" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
          {/* Garden & Flower pots */}
          <ellipse cx="220" cy="165" rx="70" ry="25" fill="#86EFAC" />
          {/* Red Flower pot */}
          <polygon points="175,175 180,150 195,150 200,175" fill="#EA580C" />
          <circle cx="187" cy="140" r="10" fill="#EF4444" />
          <circle cx="187" cy="140" r="4" fill="#FDE047" />
          {/* Yellow Flower pot */}
          <polygon points="215,180 220,155 235,155 240,180" fill="#D97706" />
          <circle cx="227" cy="145" r="11" fill="#FACC15" />
          <circle cx="227" cy="145" r="4" fill="#EA580C" />
          {/* Bush */}
          <circle cx="260" cy="145" r="18" fill="#22C55E" />
          <circle cx="275" cy="140" r="14" fill="#16A34A" />
          <circle cx="250" cy="145" r="12" fill="#15803D" />
          {/* Sun */}
          <circle cx="280" cy="40" r="18" fill="#FDE047" />
        </svg>
      );

    case 'quang-hop-ho-hap':
      return (
        <svg viewBox="0 0 340 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="340" height="200" rx="16" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
          {/* Sun */}
          <circle cx="65" cy="40" r="20" fill="#FBBF24" />
          <path d="M65 10 V 15 M65 65 V 70 M35 40 H 40 M90 40 H 95" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          {/* Plant Left */}
          <rect x="60" y="150" width="40" height="35" rx="3" fill="#B45309" />
          <path d="M80 150 V 90" stroke="#16A34A" strokeWidth="4" />
          <ellipse cx="60" cy="115" rx="18" ry="8" transform="rotate(-25 60 115)" fill="#22C55E" />
          <ellipse cx="100" cy="110" rx="18" ry="8" transform="rotate(25 100 110)" fill="#22C55E" />
          <circle cx="80" cy="85" r="12" fill="#EC4899" />
          {/* Arrows for Plant: Absorbs CO2, Releases O2 */}
          <path d="M125 105 L 98 105" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#arrow)" />
          <text x="130" y="110" fill="#475569" fontSize="13" fontWeight="bold">CO₂ (Hấp thụ)</text>
          <path d="M98 75 L 140 70" stroke="#0284C7" strokeWidth="2.5" />
          <polygon points="145,69 137,65 138,73" fill="#0284C7" />
          <text x="150" y="74" fill="#0284C7" fontSize="13" fontWeight="bold">O₂ (Thải ra)</text>

          {/* Human child on Right */}
          <circle cx="270" cy="85" r="24" fill="#FED7AA" stroke="#FB923C" strokeWidth="2" />
          {/* Hair */}
          <path d="M246 80 Q 270 50 294 80 Q 270 65 246 80 Z" fill="#1E293B" />
          {/* Eyes & Smile */}
          <circle cx="262" cy="85" r="2.5" fill="#1E293B" />
          <circle cx="278" cy="85" r="2.5" fill="#1E293B" />
          <path d="M266 96 Q 270 102 274 96" stroke="#EA580C" strokeWidth="2" fill="none" />
          {/* Body */}
          <path d="M240 160 Q 270 120 300 160" fill="#38BDF8" />
          {/* Red scarf */}
          <polygon points="265,115 275,115 270,140" fill="#EF4444" />
          {/* Arrow Human breathes in O2 and breathes out CO2 */}
          <text x="210" y="180" fill="#0F766E" fontSize="12" fontWeight="600">Hô hấp của con người</text>
        </svg>
      );

    case 'hoa-hong':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FFF1F2" />
          {/* Pot */}
          <polygon points="70,170 80,125 120,125 130,170" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
          <rect x="75" y="122" width="50" height="7" rx="3" fill="#EA580C" />
          {/* Stem & Thorns */}
          <path d="M100 125 Q 98 80 100 55" stroke="#15803D" strokeWidth="4" />
          {/* Thorns */}
          <polygon points="98,105 91,102 98,99" fill="#166534" />
          <polygon points="102,88 108,85 102,82" fill="#166534" />
          {/* Leaves with serrated edge hint */}
          <path d="M98 100 Q 65 95 65 110 Q 85 115 98 102" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
          <path d="M102 85 Q 135 80 135 95 Q 115 100 102 87" fill="#16A34A" stroke="#15803D" strokeWidth="1.5" />
          {/* Rose flower */}
          <circle cx="100" cy="50" r="28" fill="#E11D48" />
          <circle cx="100" cy="50" r="21" fill="#F43F5E" />
          <circle cx="98" cy="48" r="14" fill="#FB7185" />
          <path d="M92 48 Q 100 38 108 48 Q 100 58 92 48 Z" fill="#FFE4E6" />
        </svg>
      );

    case 'hoa-dao':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FDF2F8" />
          {/* Wooden branch */}
          <path d="M30 150 Q 80 130 110 90 T 170 50" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <path d="M110 90 Q 130 110 160 115" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          {/* Pink Peach Blossoms */}
          <g transform="translate(85, 115)">
            <circle cx="0" cy="-8" r="7" fill="#F472B6" />
            <circle cx="8" cy="-2" r="7" fill="#F472B6" />
            <circle cx="5" cy="7" r="7" fill="#F472B6" />
            <circle cx="-5" cy="7" r="7" fill="#F472B6" />
            <circle cx="-8" cy="-2" r="7" fill="#F472B6" />
            <circle cx="0" cy="2" r="4" fill="#FDE047" />
          </g>
          <g transform="translate(130, 80)">
            <circle cx="0" cy="-9" r="8" fill="#EC4899" />
            <circle cx="9" cy="-3" r="8" fill="#EC4899" />
            <circle cx="6" cy="8" r="8" fill="#EC4899" />
            <circle cx="-6" cy="8" r="8" fill="#EC4899" />
            <circle cx="-9" cy="-3" r="8" fill="#EC4899" />
            <circle cx="0" cy="2" r="5" fill="#FEF08A" />
          </g>
          <g transform="translate(160, 50)">
            <circle cx="0" cy="-6" r="6" fill="#F472B6" />
            <circle cx="6" cy="-2" r="6" fill="#F472B6" />
            <circle cx="4" cy="5" r="6" fill="#F472B6" />
            <circle cx="-4" cy="5" r="6" fill="#F472B6" />
            <circle cx="-6" cy="-2" r="6" fill="#F472B6" />
            <circle cx="0" cy="1" r="3" fill="#FDE047" />
          </g>
        </svg>
      );

    case 'hoa-mai':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#FEFCE8" />
          {/* Bonsai branch */}
          <path d="M40 160 Q 90 140 100 100 T 170 70" stroke="#713F12" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 100 Q 120 125 155 135" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
          {/* Yellow Apricot Blossom */}
          <g transform="translate(100, 80)">
            <circle cx="0" cy="-12" r="10" fill="#EAB308" />
            <circle cx="11" cy="-4" r="10" fill="#FACC15" />
            <circle cx="7" cy="10" r="10" fill="#FACC15" />
            <circle cx="-7" cy="10" r="10" fill="#FACC15" />
            <circle cx="-11" cy="-4" r="10" fill="#EAB308" />
            <circle cx="0" cy="1" r="6" fill="#CA8A04" />
            <circle cx="0" cy="1" r="3" fill="#DC2626" />
          </g>
          <g transform="translate(145, 120)">
            <circle cx="0" cy="-8" r="7" fill="#FACC15" />
            <circle cx="8" cy="-3" r="7" fill="#FACC15" />
            <circle cx="5" cy="7" r="7" fill="#FACC15" />
            <circle cx="-5" cy="7" r="7" fill="#FACC15" />
            <circle cx="-8" cy="-3" r="7" fill="#FACC15" />
            <circle cx="0" cy="1" r="4" fill="#EA580C" />
          </g>
        </svg>
      );

    case 'hoa-sen':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#F0FDFA" />
          {/* Water ripple */}
          <ellipse cx="100" cy="165" rx="75" ry="15" fill="#99F6E4" />
          <ellipse cx="60" cy="155" rx="35" ry="12" fill="#15803D" />
          <ellipse cx="140" cy="160" rx="30" ry="10" fill="#16A34A" />
          {/* Lotus Petals */}
          <path d="M100 60 Q 80 100 100 140 Q 120 100 100 60 Z" fill="#F472B6" />
          <path d="M100 70 Q 70 105 85 140 Q 100 120 100 70 Z" fill="#F43F5E" opacity="0.85" />
          <path d="M100 70 Q 130 105 115 140 Q 100 120 100 70 Z" fill="#F43F5E" opacity="0.85" />
          <path d="M100 85 Q 50 115 70 145 Q 90 135 100 85 Z" fill="#FB7185" opacity="0.75" />
          <path d="M100 85 Q 150 115 130 145 Q 110 135 100 85 Z" fill="#FB7185" opacity="0.75" />
          {/* Center yellow pistil */}
          <ellipse cx="100" cy="120" rx="8" ry="12" fill="#FDE047" />
        </svg>
      );

    case 'cay-luoi-ho':
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" fill="#ECFDF5" />
          {/* Pot */}
          <polygon points="75,175 80,135 120,135 125,175" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Upright sharp tiger tail leaves */}
          <path d="M100 135 Q 95 70 100 35 Q 105 70 100 135 Z" fill="#15803D" stroke="#EAB308" strokeWidth="3" />
          <path d="M85 135 Q 70 85 82 50 Q 92 85 85 135 Z" fill="#16A34A" stroke="#EAB308" strokeWidth="2.5" />
          <path d="M115 135 Q 130 85 118 50 Q 108 85 115 135 Z" fill="#16A34A" stroke="#EAB308" strokeWidth="2.5" />
          <path d="M72 135 Q 55 100 68 80 Q 78 105 72 135 Z" fill="#22C55E" stroke="#CA8A04" strokeWidth="2" />
          <path d="M128 135 Q 145 100 132 80 Q 122 105 128 135 Z" fill="#22C55E" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );

    case 'chau-trong':
      return (
        <svg viewBox="0 0 260 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="260" height="180" rx="12" fill="#F8FAFC" />
          {/* Gốm sứ */}
          <g transform="translate(25, 40)">
            <polygon points="10,90 15,40 55,40 60,90" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
            <circle cx="35" cy="65" r="8" fill="none" stroke="#4F46E5" strokeWidth="1.5" />
            <text x="35" y="112" textAnchor="middle" fontSize="11" fill="#4338CA" fontWeight="bold">Chậu gốm</text>
          </g>
          {/* Nhựa */}
          <g transform="translate(105, 40)">
            <polygon points="10,90 15,40 55,40 60,90" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
            <line x1="12" y1="52" x2="58" y2="52" stroke="#DC2626" strokeWidth="2" />
            <text x="35" y="112" textAnchor="middle" fontSize="11" fill="#B91C1C" fontWeight="bold">Chậu nhựa</text>
          </g>
          {/* Treo */}
          <g transform="translate(185, 30)">
            <line x1="35" y1="5" x2="15" y2="50" stroke="#64748B" strokeWidth="1.5" />
            <line x1="35" y1="5" x2="55" y2="50" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="35" cy="5" r="3" fill="#475569" />
            <polygon points="12,85 15,50 55,50 58,85" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
            <text x="35" y="122" textAnchor="middle" fontSize="11" fill="#A16207" fontWeight="bold">Chậu treo</text>
          </g>
        </svg>
      );

    case 'gia-the':
      return (
        <svg viewBox="0 0 280 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" rx="12" fill="#F1F5F9" />
          {/* Xơ dừa */}
          <g transform="translate(20, 20)">
            <rect width="70" height="70" rx="8" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            <path d="M15 50 Q 35 25 55 50 M20 35 Q 35 60 50 35" stroke="#92400E" strokeWidth="2.5" />
            <text x="35" y="95" textAnchor="middle" fontSize="11" fill="#78350F" fontWeight="bold">Xơ dừa</text>
          </g>
          {/* Trấu hun */}
          <g transform="translate(105, 20)">
            <rect width="70" height="70" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <circle cx="25" cy="35" r="3" fill="#1E293B" />
            <circle cx="45" cy="40" r="3" fill="#1E293B" />
            <circle cx="35" cy="55" r="3" fill="#1E293B" />
            <text x="35" y="95" textAnchor="middle" fontSize="11" fill="#0F172A" fontWeight="bold">Trấu hun</text>
          </g>
          {/* Mùn cưa */}
          <g transform="translate(190, 20)">
            <rect width="70" height="70" rx="8" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
            <path d="M25 35 L 45 45 M30 55 L 50 35" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            <text x="35" y="95" textAnchor="middle" fontSize="11" fill="#9A3412" fontWeight="bold">Mùn cưa</text>
          </g>
        </svg>
      );

    case 'dung-cu-trong-cay':
      return (
        <svg viewBox="0 0 280 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="160" rx="12" fill="#F8FAFC" />
          {/* Xẻng nhỏ */}
          <g transform="translate(30, 25)">
            <rect x="25" y="65" width="8" height="40" rx="3" fill="#78350F" />
            <path d="M20 65 Q 29 15 38 65 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <text x="29" y="125" textAnchor="middle" fontSize="11" fill="#334155" fontWeight="bold">Xẻng nhỏ</text>
          </g>
          {/* Bình tưới */}
          <g transform="translate(100, 25)">
            <rect x="20" y="45" width="45" height="45" rx="10" fill="#22C55E" />
            <path d="M65 55 L 85 40" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
            <path d="M20 50 Q 5 65 20 80" stroke="#15803D" strokeWidth="4" fill="none" />
            <text x="45" y="125" textAnchor="middle" fontSize="11" fill="#166534" fontWeight="bold">Bình tưới</text>
          </g>
          {/* Găng tay */}
          <g transform="translate(195, 25)">
            <rect x="15" y="70" width="35" height="20" rx="3" fill="#38BDF8" />
            <path d="M15 70 Q 15 35 25 35 T 35 70 T 45 40 T 50 70 Z" fill="#0284C7" />
            <text x="32" y="125" textAnchor="middle" fontSize="11" fill="#0369A1" fontWeight="bold">Găng tay</text>
          </g>
        </svg>
      );

    case 'bo-lap-ghep':
      return (
        <svg viewBox="0 0 300 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="180" rx="12" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
          {/* Thanh thẳng nhiều lỗ (Đỏ) */}
          <g transform="translate(20, 25)">
            <rect width="180" height="22" rx="11" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {[15, 35, 55, 75, 95, 115, 135, 155, 165].map((x, i) => (
              <circle key={i} cx={x} cy="11" r="4.5" fill="#EFF6FF" stroke="#991B1B" strokeWidth="1" />
            ))}
          </g>
          {/* Tấm nhiều lỗ (Xanh lá) */}
          <g transform="translate(20, 60)">
            <rect width="110" height="60" rx="6" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            {[20, 45, 70, 95].map((x, i) =>
              [15, 30, 45].map((y, j) => (
                <circle key={`${i}-${j}`} cx={x} cy={y} r="3.5" fill="#EFF6FF" />
              ))
            )}
          </g>
          {/* Bánh xe & trục */}
          <g transform="translate(150, 75)">
            <circle cx="30" cy="30" r="26" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <circle cx="30" cy="30" r="16" fill="#94A3B8" />
            <circle cx="30" cy="30" r="6" fill="#F8FAFC" />
          </g>
          {/* Cờ-lê & Tua-vít */}
          <g transform="translate(225, 30)">
            <rect x="8" y="50" width="8" height="40" rx="2" fill="#EF4444" />
            <polygon points="12,50 12,15 16,10 8,10" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <text x="12" y="115" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">Tua-vít</text>
          </g>
          <g transform="translate(255, 30)">
            <path d="M12 25 L 12 85" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            <circle cx="12" cy="20" r="9" fill="none" stroke="#64748B" strokeWidth="4" />
            <text x="12" y="115" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">Cờ-lê</text>
          </g>
        </svg>
      );

    case 'bap-benh':
      return (
        <svg viewBox="0 0 300 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="180" rx="12" fill="#F0FDF4" />
          {/* Base - Chân đế tam giác */}
          <polygon points="110,150 150,75 190,150" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
          <circle cx="150" cy="80" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          {/* Plank (Thanh đòn nghiêng) */}
          <g transform="rotate(-15 150 80)">
            <rect x="25" y="73" width="250" height="14" rx="7" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Ghế ngồi bên trái */}
            <rect x="35" y="55" width="28" height="18" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="40" y="40" width="18" height="15" rx="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Ghế ngồi bên phải */}
            <rect x="235" y="55" width="28" height="18" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
            <rect x="240" y="40" width="18" height="15" rx="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'robot':
      return (
        <svg viewBox="0 0 240 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="220" rx="12" fill="#F8FAFC" />
          {/* Head */}
          <rect x="90" y="25" width="60" height="40" rx="8" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          <circle cx="105" cy="40" r="5" fill="#1E293B" />
          <circle cx="135" cy="40" r="5" fill="#1E293B" />
          <line x1="105" y1="55" x2="135" y2="55" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          {/* Antennas */}
          <line x1="95" y1="25" x2="85" y2="10" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="145" y1="25" x2="155" y2="10" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          {/* Body */}
          <rect x="75" y="70" width="90" height="75" rx="10" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
          <rect x="95" y="85" width="50" height="45" rx="5" fill="#EF4444" />
          {/* Arms */}
          <rect x="50" y="80" width="20" height="50" rx="6" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          <rect x="170" y="80" width="20" height="50" rx="6" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          {/* Base & Wheels */}
          <rect x="80" y="150" width="80" height="20" rx="4" fill="#3B82F6" />
          <circle cx="70" cy="180" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="70" cy="180" r="6" fill="#94A3B8" />
          <circle cx="170" cy="180" r="16" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="170" cy="180" r="6" fill="#94A3B8" />
        </svg>
      );

    case 'do-choi-dan-gian':
      return (
        <svg viewBox="0 0 300 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="180" rx="12" fill="#FFFBEB" />
          {/* Đèn ông sao */}
          <g transform="translate(60, 80)">
            <polygon points="0,-45 13,-14 43,-14 18,6 27,36 0,18 -27,36 -18,6 -43,-14 -13,-14" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            <circle cx="0" cy="0" r="18" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
            <line x1="0" y1="36" x2="0" y2="80" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <text x="0" y="95" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">Đèn ông sao</text>
          </g>
          {/* Con cù quay (con quay gỗ) */}
          <g transform="translate(160, 85)">
            <polygon points="-25,-25 25,-25 0,35" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <line x1="0" y1="35" x2="0" y2="48" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="-25" x2="0" y2="-40" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <text x="0" y="90" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">Con cù quay</text>
          </g>
          {/* Tò he */}
          <g transform="translate(240, 80)">
            <line x1="0" y1="10" x2="0" y2="85" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="-20" r="16" fill="#F43F5E" />
            <circle cx="-10" cy="-30" r="8" fill="#F59E0B" />
            <circle cx="10" cy="-30" r="8" fill="#10B981" />
            <text x="0" y="95" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">Tò he</text>
          </g>
        </svg>
      );

    case 'den-long':
      return (
        <svg viewBox="0 0 200 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="220" rx="12" fill="#FEF2F2" />
          {/* Handle / Quai xách 16cm x 2cm */}
          <path d="M70 70 Q 100 20 130 70" stroke="#EA580C" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Lantern Body 22cm x 15cm */}
          <g transform="translate(100, 130)">
            {/* Convex lantern shape */}
            <path d="M-40 -50 C -65 0, -65 0, -40 50 L 40 50 C 65 0, 65 0, 40 -50 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            {/* Slits */}
            {[-30, -18, -6, 6, 18, 30].map((x, i) => (
              <line key={i} x1={x} y1="-45" x2={x * 1.3} y2="45" stroke="#FEF08A" strokeWidth="2.5" />
            ))}
            {/* Decorative fringe */}
            <line x1="0" y1="50" x2="0" y2="80" stroke="#EF4444" strokeWidth="3" />
            <circle cx="0" cy="80" r="4" fill="#FACC15" />
          </g>
        </svg>
      );

    case 'chuon-chuon-thang-bang':
      return (
        <svg viewBox="0 0 240 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="220" rx="12" fill="#F0FDFA" />
          {/* Perch / Stand with sharp tip */}
          <rect x="115" y="140" width="10" height="60" fill="#78350F" rx="2" />
          <polygon points="120,115 113,140 127,140" fill="#B45309" />
          {/* Dragonfly Head balanced exactly on tip */}
          <g transform="translate(120, 115)">
            {/* Nose/Beak touching the tip */}
            <circle cx="0" cy="0" r="3" fill="#DC2626" />
            {/* Head & Body extending back */}
            <path d="M-8 0 Q 0 -15 8 0 L 3 60 L -3 60 Z" fill="#0D9488" stroke="#0F766E" strokeWidth="1.5" />
            {/* Wings forward curved */}
            <path d="M-5 5 Q -70 -25 -85 -10 Q -50 20 -5 10 Z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />
            <path d="M5 5 Q 70 -25 85 -10 Q 50 20 5 10 Z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />
            {/* Clay weights on wingtips creating balance */}
            <circle cx="-80" cy="-10" r="7" fill="#F43F5E" />
            <circle cx="80" cy="-10" r="7" fill="#F43F5E" />
          </g>
          <text x="120" y="212" textAnchor="middle" fontSize="11" fill="#0F766E" fontWeight="bold">Điểm tựa thăng bằng ở mỏ</text>
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 p-6 ${className}`}>
          <span className="text-sm font-medium">Hình ảnh bài học</span>
        </div>
      );
  }
};
