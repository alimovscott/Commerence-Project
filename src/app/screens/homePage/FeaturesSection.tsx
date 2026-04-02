import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import FlashOnOutlined from "@mui/icons-material/FlashOnOutlined";

type Feature = {
  Icon: React.ComponentType<SvgIconProps>;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    Icon: LocalShippingOutlined,
    title: "Fast Delivery",
    desc: "Free shipping on all orders over $150",
  },
  {
    Icon: ShieldOutlined,
    title: "Secure Payment",
    desc: "100% secure payment processing",
  },
  {
    Icon: FlashOnOutlined,
    title: "Premium Quality",
    desc: "Crafted with the finest materials",
  },
];

export function FeaturesSection() {
  return (
    <Box component="section" className="bg-white py-20">
      <Container
        maxWidth={false}
        className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8"
      >
        <Box className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center rounded-3xl border border-zinc-100 bg-zinc-50 p-8 text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Icon sx={{ fontSize: 32 }} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500">{feature.desc}</p>
              </motion.div>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturesSection;
