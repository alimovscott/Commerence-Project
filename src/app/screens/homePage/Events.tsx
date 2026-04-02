import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/free-mode";
import { Box, Container, Stack } from "@mui/material";

const MEDIA_FEATURES = [
  {
    author: "VOGUE",
    title: "The Future of Sustainable Luxury",
    desc: "Exploring how heritage brands are pivoting towards eco-conscious craftsmanship without compromising on elegance.",
    img: "./img/rasm2.avif",
    date: "March 2024",
    location: "Paris, France",
  },
  {
    author: "GQ",
    title: "Redefining Modern Elegance",
    desc: "A deep dive into the shifting paradigms of masculine style in the digital age of high fashion.",
    img: "./img/rasm3.avif",
    date: "Feb 2024",
    location: "Milan, Italy",
  },
  {
    author: "ELLE",
    title: "Top 10 Brands to Watch This Year",
    desc: "Our editors curate the definitive list of rising stars in the luxury retail space for the upcoming season.",
    img: "./img/rasm4.avif",
    date: "Jan 2024",
    location: "New York, USA",
  },
  {
    author: "FORBES",
    title: "Innovation in Premium Retail",
    desc: "How technology is bridging the gap between physical boutiques and digital luxury experiences.",
    img: "./img/rasm5.avif",
    date: "Dec 2023",
    location: "London, UK",
  },
  {
    author: "BAZAAR",
    title: "The Art of Minimalist Design",
    desc: "Celebrating the beauty of simplicity through the lens of contemporary architectural fashion.",
    img: "./img/rasm6.avif",
    date: "Nov 2023",
    location: "Tokyo, Japan",
  },
] as const;

export default function Events() {
  return (
    <Box component="section" className="overflow-hidden bg-zinc-50 py-24">
      <Container
        maxWidth={false}
        className="mx-auto mb-16 max-w-[1300px] px-4"
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ md: "flex-end" }}
          justifyContent="space-between"
          spacing={3}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <Box>
            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-emerald-600">
              Press & Media
            </span>
            <h2 className="text-4xl font-bold tracking-tighter text-zinc-900 md:text-5xl">
              GLOBAL FEATURES
            </h2>
          </Box>
          <p className="max-w-md text-zinc-500">
            Our collections have been recognized by the world&apos;s leading
            fashion and lifestyle publications.
          </p>
        </Stack>
      </Container>
      <Box className="w-full px-4">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={30}
          slidesPerView={1.2}
          loop
          speed={8000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          freeMode={{ enabled: true, momentum: false }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.5 },
          }}
          className="media-swiper !overflow-visible"
        >
          {MEDIA_FEATURES.map((item, i) => (
            <SwiperSlide key={item.title}>
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
                className="group relative h-[500px] overflow-hidden rounded-[32px] bg-white shadow-lg transition-all duration-500 hover:shadow-2xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <Box className="absolute bottom-0 left-0 right-0 p-8">
                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems="center"
                    spacing={1.5}
                    className="mb-4 flex flex-wrap items-center gap-3"
                  >
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white">
                      {item.author}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/60">
                      {item.date}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
                      {item.location}
                    </span>
                  </Stack>
                  <h3 className="mb-3 text-2xl font-bold leading-tight text-white transition-colors group-hover:text-emerald-400">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 translate-y-4 transform text-sm text-zinc-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.desc}
                  </p>
                </Box>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
