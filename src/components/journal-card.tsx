import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { type JournalPost } from "@/data/content";
import { EASE } from "@/components/anim";

export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: post.slug }}
      className="group block"
    >
      <div className="overflow-hidden bg-[#f2f2f2]">
        <motion.img
          src={post.image}
          alt={post.title}
          className="aspect-video w-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--nh-red)]">
          {post.tag}
          <span className="mx-2 text-black/20">/</span>
          {post.date}
        </p>
        <h3 className="font-detective mt-2 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-[1.15] text-[var(--nh-black)] normal-case transition-colors duration-300 group-hover:text-[var(--nh-red)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black/55">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
