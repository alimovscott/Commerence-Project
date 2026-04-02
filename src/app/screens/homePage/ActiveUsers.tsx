import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

function memberAvatarUrl(member: Member): string | undefined {
  if (!member.memberImage) return undefined;
  const base = serverApi?.replace(/\/$/, "") ?? "";
  return base ? `${base}/${member.memberImage}` : member.memberImage;
}

export function TopContributorsSection() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <Box component="section" className="bg-zinc-50 py-24">
      <Container
        maxWidth={false}
        className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8"
      >
        <Box className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Our Top Contributors
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-500">
            Meet the most active members of our community who are shaping the
            future of luxury lifestyle.
          </p>
        </Box>

        {topUsers.length === 0 ? (
          <Box className="rounded-3xl border border-dashed border-zinc-200 bg-white py-16 text-center text-zinc-500">
            No contributors to show yet.
          </Box>
        ) : (
          <Box className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {topUsers.map((member: Member, i: number) => {
              const avatar = memberAvatarUrl(member);
              return (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: Math.min(i * 0.05, 0.2) }}
                  viewport={{ once: true }}
                  className="group relative flex h-[400px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-xl"
                >
                  <Box className="relative mb-8">
                    <Box className="absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-200 opacity-0 blur-xl transition-opacity group-hover:opacity-40" />
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={member.memberNick}
                        className="relative z-10 h-44 w-44 rounded-full border-4 border-white object-cover shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full border-4 border-white bg-zinc-200 text-4xl font-bold text-zinc-500 shadow-xl">
                        {member.memberNick.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </Box>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {member.memberNick}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-emerald-600">
                    {member.memberPoints.toLocaleString()} points
                  </p>
                </motion.div>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default TopContributorsSection;
