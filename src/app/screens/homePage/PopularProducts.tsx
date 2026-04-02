import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import {  NewProductCard } from "./NewProducts";

const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts })
);

export interface PopularProductProps {
  onAdd?: (item: CartItem) => void;
}

export default function PopularProduct({ onAdd }: PopularProductProps) {
  const history = useHistory();
  const { popularProducts } = useSelector(popularProductsRetriever);

  return (
    <Box
      component="section"
      className="w-full bg-zinc-50 py-20 md:py-24"
    >
      <Container
        maxWidth={false}
        className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-12 text-center md:mb-14 md:text-left"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-emerald-600">
            Trending
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Popular Products
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 md:mx-0">
            Community favorites — most viewed picks from our collection.
          </p>
        </motion.div>

        <Box className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {popularProducts.length !== 0 ? (
            popularProducts.map((product: Product, index: number) => (
              <NewProductCard
                key={product._id}
                product={product}
                index={index}
                onAdd={onAdd}
                onCardClick={() => history.push(`/products/${product._id}`)}
              />
            ))
          ) : (
            <Box className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-white py-16 text-center text-zinc-500">
              Popular products are not available
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
