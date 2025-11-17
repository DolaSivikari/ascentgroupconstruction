import { useState } from "react";
import { Slider } from "./ui/slider";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  altBefore?: string;
  altAfter?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState([50]);

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[var(--radius-sm)] group">
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={altAfter}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition[0]}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={altBefore}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[hsl(var(--bg))] shadow-lg"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[hsl(var(--bg))] rounded-full shadow-lg flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-primary"></div>
            <div className="w-0.5 h-4 bg-primary"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-[hsl(var(--ink))]/70 text-[hsl(var(--bg))] px-3 py-1 rounded text-sm font-medium">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-[hsl(var(--ink))]/70 text-[hsl(var(--bg))] px-3 py-1 rounded text-sm font-medium">
        After
      </div>

      {/* Slider Control */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 fade-transition">
        <Slider
          value={sliderPosition}
          onValueChange={setSliderPosition}
          max={100}
          step={1}
          className="cursor-grab active:cursor-grabbing"
        />
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
