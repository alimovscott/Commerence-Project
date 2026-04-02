import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Box, Container } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";

export function VideoAdSection() {
  return (
    <Box
      component="section"
      className="relative overflow-hidden bg-zinc-900 py-24"
    >
      <Container
        maxWidth={false}
        className="relative z-10 mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8"
      >
        <Box className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Exclusive Experience
            </span>
            <h2 className="mb-8 text-5xl font-bold leading-[0.9] tracking-tighter text-white md:text-7xl">
              THE FUTURE OF <br />
              <span className="text-emerald-500">LUXURY FASHION.</span>
            </h2>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-400">
              Experience the new standard of elegance. Our latest collection
              combines timeless craftsmanship with modern innovation.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-black transition-all hover:bg-emerald-500 hover:text-white"
            >
              Explore Collection
              <ArrowForward
                sx={{ fontSize: 20 }}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              whileHover={{
                rotateY: -15,
                rotateX: 10,
                scale: 1.05,
                z: 50,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute -inset-4 rounded-[30px] bg-emerald-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <img
                src="./img/rasm1.avif"
                alt="Luxury Fashion"
                className="relative z-10 h-[500px] w-[400px] rounded-[25px] border border-white/10 object-cover shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="pointer-events-none absolute inset-0 z-20 rounded-[25px] ring-1 ring-inset ring-white/20" />
            </motion.div>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

export default VideoAdSection;
