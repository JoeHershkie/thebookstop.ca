import React, { useState } from 'react';
import { addToCart } from '../stores/cartStore';
import { Check, Plus, Minus, Sparkles, BookOpen, Calendar } from 'lucide-react';

interface CoverOption {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  badge?: string;
}

const COVER_OPTIONS: CoverOption[] = [
  {
    id: 'botanical',
    name: 'Botanical & Flora',
    subtitle: 'Pressed florals, botanical leaves, & earthy greens',
    image: '/images/swatch-botanical.jpg',
    badge: 'Popular',
  },
  {
    id: 'antique-maps',
    name: 'Antique Maps & Sage',
    subtitle: 'Vintage cartography & William Morris foliage',
    image: '/images/swatch-antique-maps.jpg',
  },
  {
    id: 'stripes-foil',
    name: 'Retro Stripes & Gold Foil',
    subtitle: 'Warm gingham, vintage candy stripes, & foil accents',
    image: '/images/swatch-stripes-foil.jpg',
  },
  {
    id: 'wildflowers',
    name: 'Wildflower Meadow',
    subtitle: 'Vibrant lakeside blooms & rustic prairie florals',
    image: '/images/swatch-wildflowers.jpg',
  },
  {
    id: 'celestial',
    name: 'Celestial Midnight',
    subtitle: 'Nocturnal stars, crescent moons, & deep indigo',
    image: '/images/swatch-celestial.jpg',
  },
  {
    id: 'manuscript',
    name: 'Vintage Manuscript',
    subtitle: 'Antique calligraphy, aged parchment, & bookish motifs',
    image: '/images/swatch-manuscript.jpg',
  },
  {
    id: 'custom',
    name: 'Custom Request / Inquire',
    subtitle: 'Specify your favourite theme, colors, or author quote',
    badge: 'Made to Order',
  },
];

export default function PlannerCustomizer() {
  const [plannerType, setPlannerType] = useState<'1-month' | '3-month'>('1-month');
  const [selectedCover, setSelectedCover] = useState<CoverOption>(COVER_OPTIONS[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const price = plannerType === '1-month' ? 10 : 20;
  const totalPrice = price * quantity;

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    const title = plannerType === '1-month' 
      ? 'Handcrafted 1-Month Planner' 
      : 'Handcrafted 3-Month Planner';

    const itemId = `${plannerType}-${selectedCover.id}-${(customNotes || 'standard').slice(0, 15).replace(/\s+/g, '_')}`;

    addToCart(
      {
        id: itemId,
        type: plannerType,
        title,
        price,
        coverStyle: selectedCover.name,
        coverImage: selectedCover.image,
        customNotes: customNotes.trim() || undefined,
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="bg-[#fcfaf7] border border-[#261916]/10 rounded-2xl p-6 md:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Visual Preview & Details */}
        <div className="lg:col-span-5 flex flex-col items-center text-center lg:text-left">
          <div className="relative w-full aspect-4/5 max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#261916]/15 shadow-md bg-[#f4eee2]">
            {selectedCover.image ? (
              <img
                src={selectedCover.image}
                alt={selectedCover.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#852f24]/5 border-2 border-dashed border-[#852f24]/30">
                <Sparkles className="w-12 h-12 text-[#852f24] mb-3 opacity-80" />
                <h4 className="font-serif font-bold text-lg text-[#261916]">Custom Cover Design</h4>
                <p className="text-xs text-[#614f48] mt-2 max-w-xs">
                  Grace hand-sources and binds custom aesthetic covers for your exact preference or gift occasion.
                </p>
              </div>
            )}

            {/* Floating Price Tag */}
            <div className="absolute top-4 right-4 bg-[#852f24] text-[#fbf8f3] px-3.5 py-1.5 rounded-full font-mono text-sm font-bold shadow-md">
              ${price} CAD
            </div>

            {/* Type Pill */}
            <div className="absolute bottom-4 left-4 bg-[#fbf8f3]/90 backdrop-blur-xs text-[#261916] px-3 py-1 rounded-full text-xs font-serif font-medium border border-[#261916]/10 shadow-xs">
              {plannerType === '1-month' ? '1-Month Focus Edition' : '3-Month Quarterly Edition'}
            </div>
          </div>

          <div className="mt-6 w-full max-w-sm space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-[#614f48]">
              <BookOpen className="w-4 h-4 text-[#852f24]" />
              <span>Hand-cut, assembled & bound in Fort Frances</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#614f48]">
              <Calendar className="w-4 h-4 text-[#852f24]" />
              <span>Undated spreads — start any day of the year</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-7">
          <form onSubmit={handleAddToCart} className="space-y-7">
            
            {/* 1. Edition Selector */}
            <div>
              <label className="block font-serif text-sm font-bold text-[#261916] uppercase tracking-wider mb-2">
                1. Select Planner Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlannerType('1-month')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    plannerType === '1-month'
                      ? 'border-[#852f24] bg-[#852f24]/5 ring-1 ring-[#852f24]'
                      : 'border-[#261916]/15 bg-white hover:border-[#852f24]/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-bold text-base text-[#261916]">1-Month Edition</span>
                    <span className="font-mono font-bold text-sm text-[#852f24]">$10</span>
                  </div>
                  <p className="text-xs text-[#614f48] mt-1">
                    Compact 31-day daily focus, habit tracking, and reflections.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPlannerType('3-month')}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    plannerType === '3-month'
                      ? 'border-[#852f24] bg-[#852f24]/5 ring-1 ring-[#852f24]'
                      : 'border-[#261916]/15 bg-white hover:border-[#852f24]/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-serif font-bold text-base text-[#261916]">3-Month Edition</span>
                    <span className="font-mono font-bold text-sm text-[#852f24]">$20</span>
                  </div>
                  <p className="text-xs text-[#614f48] mt-1">
                    Full 90-day goal setting, weekly checkpoints, and project logs.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Cover Style Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-serif text-sm font-bold text-[#261916] uppercase tracking-wider">
                  2. Choose Cover Style
                </label>
                <span className="text-xs font-mono text-[#852f24] font-medium">
                  {selectedCover.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COVER_OPTIONS.map((cover) => {
                  const isSelected = selectedCover.id === cover.id;
                  return (
                    <button
                      key={cover.id}
                      type="button"
                      onClick={() => setSelectedCover(cover)}
                      className={`relative flex items-center gap-3 p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#852f24] bg-[#852f24]/10 shadow-xs'
                          : 'border-[#261916]/15 bg-white hover:border-[#852f24]/40'
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#261916]/15 bg-[#f4eee2]">
                        {cover.image ? (
                          <img
                            src={cover.image}
                            alt={cover.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#852f24]/10 text-[#852f24]">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#852f24]/80 flex items-center justify-center text-white">
                            <Check className="w-5 h-5" strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-bold text-[#261916] truncate">
                          {cover.name}
                        </div>
                        <div className="text-[11px] text-[#614f48] line-clamp-1">
                          {cover.badge || 'Handmade'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Custom Notes / Personalization */}
            <div>
              <label htmlFor="custom-notes" className="block font-serif text-sm font-bold text-[#261916] uppercase tracking-wider mb-1">
                3. Custom Personalization / Requests{' '}
                <span className="text-xs font-normal font-sans text-[#614f48]">(Optional)</span>
              </label>
              <input
                id="custom-notes"
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g., Prefers vintage botanicals, gift for a gardener, name on cover, etc."
                className="w-full px-4 py-2.5 rounded-xl border border-[#261916]/20 bg-white text-sm text-[#261916] placeholder-[#8a766e] focus:outline-none focus:border-[#852f24] focus:ring-1 focus:ring-[#852f24] transition-all"
              />
            </div>

            {/* 4. Quantity & Action */}
            <div className="pt-2 border-t border-[#261916]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Counter */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-[#614f48]">Quantity:</span>
                <div className="flex items-center border border-[#261916]/20 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-[#261916] hover:bg-[#852f24]/10 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-[#261916]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#261916] hover:bg-[#852f24]/10 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-serif font-bold text-base transition-all duration-200 shadow-md cursor-pointer ${
                  justAdded
                    ? 'bg-[#455a4a] text-[#fbf8f3] scale-102'
                    : 'bg-[#852f24] text-[#fbf8f3] hover:bg-[#6e241b] active:scale-98'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Add to Cart • ${totalPrice} CAD</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
