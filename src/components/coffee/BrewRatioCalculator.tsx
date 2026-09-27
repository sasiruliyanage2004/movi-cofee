"use client";

import React, { useState } from "react";
import { Droplet, Thermometer, Clock, Scale } from "lucide-react";

interface BrewMethod {
  id: string;
  name: string;
  ratio: number; // 1:ratio
  temp: string;
  grind: string;
  time: string;
  bloomTime: string;
  guide: string;
}

const methods: BrewMethod[] = [
  {
    id: "v60",
    name: "V60 Pour Over",
    ratio: 15,
    temp: "92°C – 94°C",
    grind: "Medium-Fine (Table Salt texture)",
    time: "2:45 – 3:15 min",
    bloomTime: "45 sec",
    guide: "Spiral gentle pours in concentric circles, keeping slurry level consistent.",
  },
  {
    id: "french-press",
    name: "French Press",
    ratio: 12,
    temp: "94°C",
    grind: "Coarse (Sea Salt texture)",
    time: "4:00 min",
    bloomTime: "30 sec",
    guide: "Steep 4 minutes without stirring, break crust, skim foam, plunge gently.",
  },
  {
    id: "aeropress",
    name: "AeroPress",
    ratio: 13,
    temp: "88°C – 90°C",
    grind: "Medium (Sand texture)",
    time: "1:45 min",
    bloomTime: "30 sec",
    guide: "Inverted method. 1-minute gentle steep followed by a steady 30-second press.",
  },
  {
    id: "cold-brew",
    name: "Cold Brew Steep",
    ratio: 8,
    temp: "Cold Filtered Water (Room / Chilled)",
    grind: "Extra Coarse (Breadcrumbs texture)",
    time: "18 – 20 hrs",
    bloomTime: "Immediate immersion",
    guide: "Full immersion steep in cold mineral water. Filter through cloth or paper.",
  },
];

export const BrewRatioCalculator: React.FC = () => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>("v60");
  const [coffeeGrams, setCoffeeGrams] = useState<number>(18);

  const currentMethod = methods.find((m) => m.id === selectedMethodId) || methods[0];
  const totalWater = Math.round(coffeeGrams * currentMethod.ratio);
  const bloomWater = Math.round(coffeeGrams * 2.5);

  return (
    <div className="p-8 sm:p-12 border border-espresso/15 bg-warm-cream">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-espresso/15 gap-2">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
            TECHNICAL COFFEE CRAFT
          </span>
          <h3 className="font-serif text-3xl text-espresso font-normal">
            The Calibration Ratio Calculator
          </h3>
        </div>
        <p className="font-sans text-xs text-espresso/65 font-light">
          Calibrate water yield & timing for single-origin coffees.
        </p>
      </div>

      {/* Method Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {methods.map((method) => {
          const isActive = method.id === selectedMethodId;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethodId(method.id)}
              className={`p-3 text-center border text-xs font-sans uppercase tracking-[0.16em] transition-all cursor-pointer ${
                isActive
                  ? "border-espresso bg-espresso text-warm-cream font-medium"
                  : "border-espresso/15 bg-soft-beige/30 text-espresso hover:border-espresso/40"
              }`}
            >
              {method.name}
            </button>
          );
        })}
      </div>

      {/* Coffee Dose Slider */}
      <div className="mb-10 p-6 bg-soft-beige/40 border border-espresso/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-sans uppercase tracking-wider text-muted-coffee font-medium flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-muted-gold" /> Coffee Dose
          </span>
          <span className="font-serif text-2xl text-espresso font-medium">
            {coffeeGrams}g
          </span>
        </div>
        <input
          type="range"
          min={12}
          max={45}
          step={1}
          value={coffeeGrams}
          onChange={(e) => setCoffeeGrams(Number(e.target.value))}
          className="w-full h-1 bg-espresso/20 accent-muted-gold rounded-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-sans uppercase tracking-widest text-espresso/50 mt-2">
          <span>12g (Single Cup)</span>
          <span>25g (Two Cups)</span>
          <span>45g (Server Batch)</span>
        </div>
      </div>

      {/* Calculated Extraction Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* Total Water */}
        <div className="p-4 border border-espresso/15 bg-soft-beige/25">
          <div className="flex items-center gap-1.5 text-muted-gold mb-1">
            <Droplet className="w-4 h-4" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
              Water Yield
            </span>
          </div>
          <span className="font-serif text-2xl text-espresso font-normal">
            {totalWater} ml
          </span>
          <span className="block text-[10px] font-sans text-espresso/50 mt-0.5">
            1:{currentMethod.ratio} Ratio
          </span>
        </div>

        {/* Bloom Water */}
        <div className="p-4 border border-espresso/15 bg-soft-beige/25">
          <div className="flex items-center gap-1.5 text-muted-gold mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
              Bloom Pour
            </span>
          </div>
          <span className="font-serif text-2xl text-espresso font-normal">
            ~{bloomWater} ml
          </span>
          <span className="block text-[10px] font-sans text-espresso/50 mt-0.5">
            For {currentMethod.bloomTime}
          </span>
        </div>

        {/* Water Temperature */}
        <div className="p-4 border border-espresso/15 bg-soft-beige/25">
          <div className="flex items-center gap-1.5 text-muted-gold mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
              Water Temp
            </span>
          </div>
          <span className="font-serif text-xl sm:text-2xl text-espresso font-normal">
            {currentMethod.temp}
          </span>
          <span className="block text-[10px] font-sans text-espresso/50 mt-0.5">
            Mineral-balanced
          </span>
        </div>

        {/* Extraction Time */}
        <div className="p-4 border border-espresso/15 bg-soft-beige/25">
          <div className="flex items-center gap-1.5 text-muted-gold mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
              Brew Time
            </span>
          </div>
          <span className="font-serif text-xl sm:text-2xl text-espresso font-normal">
            {currentMethod.time}
          </span>
          <span className="block text-[10px] font-sans text-espresso/50 mt-0.5">
            Optimal Sweetness
          </span>
        </div>
      </div>

      {/* Extraction Guidance */}
      <div className="p-5 border-l-2 border-muted-gold bg-soft-beige/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans text-espresso/80">
        <div>
          <span className="font-semibold uppercase tracking-wider text-muted-coffee mr-2">
            Recommended Grind:
          </span>
          <span>{currentMethod.grind}.</span>
          <p className="mt-1 text-espresso/70 italic font-serif text-sm">
            &ldquo;{currentMethod.guide}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
