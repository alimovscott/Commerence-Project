import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudDownload, Save } from "lucide-react";
import { Box, Stack } from "@mui/material";
import { useGlobals } from "../../hooks/useGlobals";
import { MemberUpdateInput } from "../../../lib/types/member";
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";

const IMG_FALLBACK =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100";

const inputClass =
  "w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export default function Settings() {
  const { authMember, setAuthMember } = useGlobals();

  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [memberUpdateInput, setMemberUpdateInput] =
    useState<MemberUpdateInput>({
      memberNick: authMember?.memberNick,
      memberPhone: authMember?.memberPhone,
      memberPassword: authMember?.memberPassword,
      memberAddress: authMember?.memberAddress,
      memberDesc: authMember?.memberDesc,
      memberImage: authMember?.memberImage,
    });

  const memberNickHandlar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setMemberUpdateInput((prev) => ({ ...prev, memberNick: v }));
  };

  const memberPhoneHandlar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setMemberUpdateInput((prev) => ({ ...prev, memberPhone: v }));
  };

  const memberAddressHandlar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setMemberUpdateInput((prev) => ({ ...prev, memberAddress: v }));
  };

  const memberDescriptionHandlar = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const v = e.target.value;
    setMemberUpdateInput((prev) => ({ ...prev, memberDesc: v }));
  };

  const handleSubmitButton = async () => {
    try {
      if (!authMember) throw new Error(Messages.error2);

      if (
        memberUpdateInput.memberNick === "" ||
        memberUpdateInput.memberPhone === "" ||
        memberUpdateInput.memberAddress === "" ||
        memberUpdateInput.memberDesc === ""
      ) {
        throw new Error(Messages.error3);
      }

      const member = new MemberService();
      const result = await member.updateMamber(memberUpdateInput);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Modified succesfullly", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const handleImageViewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validateImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validateImageTypes.includes(file.type)) {
      sweetErrorHandling(Messages.error5).then();
      return;
    }

    setMemberUpdateInput((prev) => ({
      ...prev,
      memberImage: file as unknown as string,
    }));
    setMemberImage(URL.createObjectURL(file));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Box className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          alignItems={{ sm: "center" }}
          className="mb-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center"
        >
          <Box className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-50 bg-zinc-100 shadow-inner">
            <img
              src={memberImage}
              alt="User"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = IMG_FALLBACK;
              }}
            />
          </Box>
          <Stack spacing={1} className="space-y-2">
            <span className="text-sm font-bold text-zinc-900">
              Upload image
            </span>
            <p className="text-xs text-zinc-500">
              JPG, JPEG, PNG formats only!
            </p>
            <Box className="pt-2">
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-zinc-600 transition-colors hover:bg-zinc-200">
                <CloudDownload size={18} aria-hidden />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Choose File
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  hidden
                  onChange={handleImageViewer}
                />
              </label>
            </Box>
          </Stack>
        </Stack>

        <Stack spacing={3} className="space-y-6">
          <Stack spacing={1} className="space-y-2">
            <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Username
            </label>
            <input
              className={inputClass}
              type="text"
              placeholder="Enter your name"
              name="memberNick"
              value={memberUpdateInput.memberNick ?? ""}
              onChange={memberNickHandlar}
            />
          </Stack>

          <Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Stack spacing={1} className="space-y-2">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Phone
              </label>
              <input
                className={inputClass}
                type="text"
                placeholder="Enter your phone number"
                name="memberPhone"
                value={memberUpdateInput.memberPhone ?? ""}
                onChange={memberPhoneHandlar}
              />
            </Stack>
            <Stack spacing={1} className="space-y-2">
              <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Address
              </label>
              <input
                className={inputClass}
                type="text"
                placeholder="Enter your Address"
                name="memberAddress"
                value={memberUpdateInput.memberAddress ?? ""}
                onChange={memberAddressHandlar}
              />
            </Stack>
          </Box>

          <Stack spacing={1} className="space-y-2">
            <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Description
            </label>
            <textarea
              className={`${inputClass} min-h-[120px] resize-none`}
              placeholder="Enter Description"
              name="memberDesc"
              value={memberUpdateInput.memberDesc ?? ""}
              onChange={memberDescriptionHandlar}
            />
          </Stack>

          <Box className="pt-4">
            <button
              type="button"
              onClick={() => void handleSubmitButton()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 sm:w-auto"
            >
              <Save size={18} aria-hidden />
              Save Changes
            </button>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}
