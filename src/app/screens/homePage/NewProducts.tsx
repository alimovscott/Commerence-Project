import React, { useState } from "react";
import { Container, Box, Stack } from "@mui/material";
import { motion } from "framer-motion";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { cn } from "../../../lib/utils/cn";

const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({ newProducts })
);

function categoryLabel(collection: Product["productCollection"]): string {
  return String(collection)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface NewProductCardProps {
  product: Product;
  index: number;
  onAdd?: (item: CartItem) => void;
  onCardClick: () => void;
}

/** Mahsulot kartochkasi — `PopularDishes` ham shu komponentni import qiladi. */
export function NewProductCard({
  product,
  index,
  onAdd,
  onCardClick,
}: NewProductCardProps) {
  const [imgOk, setImgOk] = useState(true);
  const base = serverApi?.replace(/\/$/, "") ?? "";
  const imagePath =
    product.productImages?.[0] && base
      ? `${base}/${product.productImages[0]}`
      : product.productImages?.[0] ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
        delay: Math.min(index * 0.06, 0.3),
      }}
      whileHover={{ y: -5 }}
      onClick={onCardClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md"
      )}
    >
      <Box className="relative block aspect-square overflow-hidden bg-zinc-100">
        {imagePath && imgOk ? (
          <img
            src={imagePath}
            alt={product.productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
        <Stack
          className="absolute left-3 top-3 flex flex-col gap-2"
          spacing={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            className="flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-bold text-zinc-600 shadow-sm backdrop-blur-sm"
          >
            <VisibilityOutlined sx={{ fontSize: 10 }} />
            {(product.productViews ?? 0).toLocaleString()}
          </Stack>
        </Stack>
      </Box>
      <Box className="p-4">
        <Box className="mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {categoryLabel(product.productCollection)}
          </span>
        </Box>
        <h3 className="mb-1 font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600">
          {product.productName}
        </h3>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          className="mt-4 flex items-center justify-between"
        >
          <span className="text-lg font-bold text-zinc-900">
            ${product.productPrice}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.({
                _id: product._id,
                quantity: 1,
                name: product.productName,
                price: product.productPrice,
                image: product.productImages?.[0] ?? "",
              });
            }}
            className="rounded-xl bg-zinc-900 p-2 text-white shadow-sm transition-colors hover:bg-emerald-600 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCartOutlined sx={{ fontSize: 18 }} />
          </button>
        </Stack>
      </Box>
    </motion.div>
  );
}

export interface NewProductProps {
  onAdd?: (item: CartItem) => void;
}

export default function NewProduct({ onAdd }: NewProductProps) {
  const history = useHistory();
  const { newProducts } = useSelector(newProductsRetriever);

  return (
    <Box
      component="section"
      className="w-full bg-white py-20 md:py-24"
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
            Just dropped
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            New Products
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 md:mx-0">
            New arrivals — explore what recently joined the catalog.
          </p>
        </motion.div>

        <Box className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {newProducts.length !== 0 ? (
            newProducts.map((product: Product, index: number) => (
              <NewProductCard
                key={product._id}
                product={product}
                index={index}
                onAdd={onAdd}
                onCardClick={() => history.push(`/products/${product._id}`)}
              />
            ))
          ) : (
            <Box className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center text-zinc-500">
              New product are not available
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
