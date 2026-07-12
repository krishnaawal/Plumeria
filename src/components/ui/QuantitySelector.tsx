"use client";

import { Minus, Plus } from "lucide-react";
import { clampQuantity } from "@/lib/utils";

export function QuantitySelector({
  value,
  max,
  onChange
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const update = (next: number) => onChange(clampQuantity(next, max));

  return (
    <div className="inline-flex items-center rounded-full border border-leaf-200 bg-white p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => update(value - 1)}
        disabled={value <= 1}
        className="grid h-10 w-10 place-items-center rounded-full text-leaf-900 transition hover:bg-leaf-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={16} />
      </button>
      <input
        aria-label="Quantity"
        value={value}
        onChange={(event) => update(Number(event.target.value))}
        className="h-10 w-14 bg-transparent text-center font-bold text-leaf-900"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => update(value + 1)}
        disabled={value >= max}
        className="grid h-10 w-10 place-items-center rounded-full text-leaf-900 transition hover:bg-leaf-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
