import React from "react";
import { motion } from "framer-motion";
import type { TeamMember } from "./teamMembers";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.24) }}
      className="group text-center"
    >
      <div className="mb-4 aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-zinc-900">
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-emerald-600">{member.role}</p>
    </motion.article>
  );
}
