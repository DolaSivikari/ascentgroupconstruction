import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { use3DTilt } from "@/hooks/use3DTilt";

interface ServiceCard3DProps {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  icon_name: string | null;
  featured?: boolean;
}

export const ServiceCard3D = ({
  name,
  slug,
  short_description,
  icon_name,
  featured,
}: ServiceCard3DProps) => {
  const { tiltStyle, handleMouseMove, handleMouseLeave } = use3DTilt({
    maxTilt: 10,
    scale: 1.03,
  });
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = icon_name
    ? (LucideIcons[icon_name as keyof typeof LucideIcons] as any)
    : null;

  return (
    <Link to={`/services/${slug}`}>
      <motion.div
        className="relative h-full group cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          handleMouseLeave();
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-border bg-card backdrop-blur-sm h-full"
          style={{
            ...tiltStyle,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Background Layer - furthest back */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5"
            style={{
              transform: "translateZ(-30px)",
              transformStyle: "preserve-3d",
            }}
            animate={{
              opacity: isHovered ? 1 : 0.5,
            }}
          />

          {/* Middle Layer - glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent"
            style={{
              transform: "translateZ(-15px)",
              transformStyle: "preserve-3d",
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Content Layer - front */}
          <div
            className="relative p-6 h-full flex flex-col"
            style={{
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Icon */}
            {IconComponent && (
              <motion.div
                className="mb-4"
                style={{
                  transform: "translateZ(20px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
              </motion.div>
            )}

            {/* Featured Badge */}
            {featured && (
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-semibold backdrop-blur-sm"
                style={{
                  transform: "translateZ(25px)",
                  transformStyle: "preserve-3d",
                }}
              >
                Featured
              </motion.div>
            )}

            {/* Title */}
            <motion.h3
              className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors"
              style={{
                transform: "translateZ(15px)",
                transformStyle: "preserve-3d",
              }}
            >
              {name}
            </motion.h3>

            {/* Description */}
            {short_description && (
              <motion.p
                className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1"
                style={{
                  transform: "translateZ(10px)",
                  transformStyle: "preserve-3d",
                }}
              >
                {short_description}
              </motion.p>
            )}

            {/* CTA */}
            <motion.div
              className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all"
              style={{
                transform: "translateZ(20px)",
                transformStyle: "preserve-3d",
              }}
            >
              <span>Explore Service</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: isHovered ? "100%" : "-100%",
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.6 }}
              style={{
                transform: "translateZ(30px)",
                transformStyle: "preserve-3d",
              }}
            />
          </div>

          {/* Shadow Layer */}
          <div
            className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
            style={{
              transform: "translateZ(-40px)",
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
};
