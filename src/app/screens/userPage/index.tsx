import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin } from "lucide-react";
import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import Settings from "./Settings";
import "../../../css/userPage.css";

// const AVATAR_FALLBACK =
//   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();

  if (!authMember) {
    history.push("/");
    return null;
  }

  const avatarSrc = authMember.memberImage
    ? `${serverApi}/${authMember.memberImage}`
    : "/icons/default-user.svg";

  return (
    <div className="min-h-screen bg-zinc-50">
      <Container
        maxWidth={false}
        className="mx-auto mb-20 mt-20 max-w-[1200px] px-4 sm:px-6 lg:px-8"
      >
        <Box component="header" className="mb-12">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900">
            My Account
          </h1>
          <p className="text-zinc-500">
            Manage your profile settings and preferences.
          </p>
        </Box>

        <Box className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[70%_30%]">
          <Stack spacing={3} className="space-y-6">
            <Stack spacing={3} className="flex flex-col gap-6">
              <h2 className="ml-2 text-2xl font-bold text-zinc-900">
                Modify Member Details
              </h2>
              <Settings />
            </Stack>
          </Stack>

          <Stack spacing={3} className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center shadow-sm"
            >
              <Stack alignItems="center" className="flex flex-col items-center">
                <Box className="relative mb-6">
                  <Box className="h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-50 shadow-inner">
                    <img
                      src={avatarSrc}
                      alt={authMember.memberNick}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement);
                      }}
                    />
                  </Box>
                  <Box className="absolute -bottom-1 -right-1 rounded-full border border-zinc-100 bg-white p-2 shadow-md">
                    <BadgeCheck className="h-6 w-6 text-emerald-600" />
                  </Box>
                </Box>

                <h3 className="mb-1 text-2xl font-bold text-zinc-900">
                  {authMember.memberNick}
                </h3>

                <Stack spacing={0.5} className="mb-6 flex flex-col gap-1">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
                    {authMember.memberType === MemberType.ADMIN
                      ? "ADMIN"
                      : "USER"}
                  </span>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                    className="mt-1 flex items-center justify-center gap-1 text-xs text-zinc-400"
                  >
                    <MapPin size={12} aria-hidden />
                    <span>
                      {authMember.memberAddress?.trim()
                        ? authMember.memberAddress
                        : "No address"}
                    </span>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={2}
                  className="mb-8 flex items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                    aria-label="Facebook"
                  >
                    <FacebookIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-400 transition-all hover:bg-pink-50 hover:text-pink-600"
                    aria-label="Instagram"
                  >
                    <InstagramIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-400 transition-all hover:bg-sky-50 hover:text-sky-500"
                    aria-label="Telegram"
                  >
                    <TelegramIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-zinc-50 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600"
                    aria-label="YouTube"
                  >
                    <YouTubeIcon sx={{ fontSize: 18 }} />
                  </button>
                </Stack>

                <Box className="w-full border-t border-zinc-100 pt-6">
                  <p className="text-sm italic leading-relaxed text-zinc-500">
                    &ldquo;
                    {authMember.memberDesc?.trim()
                      ? authMember.memberDesc
                      : "No description provided yet. Add a bio to tell people about yourself."}
                    &rdquo;
                  </p>
                </Box>
              </Stack>
            </motion.div>
          </Stack>
        </Box>
      </Container>
    </div>
  );
}
