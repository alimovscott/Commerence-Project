import React, { useEffect, useState } from "react";
import { Container, Stack, Box, Skeleton, Alert } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { motion } from "framer-motion";

import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
// Removed unnecessary Dispatch import from toolkit
import { setChosenProduct, setAdmin } from "./slice";
import { retrieveChosenProduct, retrieveAdmin } from "./selector";
import { useParams } from "react-router-dom";

import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
// Removed unused Member import
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { cn } from "../../../lib/utils/cn";

// Removed obsolete actionDispatch pattern that caused infinite loops

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

const adminRetriever = createSelector(retrieveAdmin, (admin) => ({ admin }));

function categoryLabel(collection: ProductCollection): string {
  switch (collection) {
    case ProductCollection.ACCESSORIES:
      return "ACCESSORIES";
    case ProductCollection.BAGS:
      return "BAGS";
    case ProductCollection.ELECTIRONICS: // Fixed typo from ELECTIRONICS
      return "ELECTRONICS";
    case ProductCollection.HOMEDECOR:
      return "HOMEDECOR";
    default:
      return collection || "GENERAL";
  }
}

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch(); // Get stable dispatch

  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { admin } = useSelector(adminRetriever);

  // Local state for UI handling
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Product ID missing");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const productService = new ProductService();
      const memberService = new MemberService();

      try {
        // Fetch both in parallel for performance
        const [productData, adminData] = await Promise.all([
          productService.getProduct(productId),
          memberService.getAdmin(),
        ]);

        dispatch(setChosenProduct(productData));
        dispatch(setAdmin(adminData));
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Something went wrong fetching product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Only depend on productId and dispatch. Dispatch is stable.
  }, [productId, dispatch]);

  // 1. Error State
  if (error) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // 2. Loading State (Skeleton UI)
  if (isLoading || !chosenProduct) {
    return (
      <Container maxWidth="lg" className="!px-0 mt-8" sx={{ maxWidth: "1100px !important" }}>
        <Skeleton variant="text" height={60} width="40%" className="mx-auto mb-2" />
        <Skeleton variant="text" height={30} width="20%" className="mx-auto mb-10" />
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4} className="gap-8 lg:gap-10">
           <Skeleton variant="rectangular" height={400} className="w-full lg:w-[52%] rounded-2xl" />
           <Box className="w-full lg:w-[48%]">
             <Skeleton variant="text" height={40} width="80%" />
             <Skeleton variant="text" height={30} width="60%" className="mt-4" />
             <Skeleton variant="rectangular" height={150} className="mt-6 rounded-xl" />
             <Skeleton variant="rectangular" height={60} className="mt-8 rounded-xl" />
           </Box>
        </Stack>
      </Container>
    );
  }

  // 3. Loaded State
  const hasMultipleImages = (chosenProduct.productImages?.length || 0) > 1;
  const label = categoryLabel(chosenProduct.productCollection);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "chosen-product w-full bg-zinc-50/80 px-4 pb-20 pt-8 sm:px-6 lg:px-8"
      )}
    >
      <Container
        maxWidth="lg"
        className="!px-0"
        sx={{ maxWidth: "1100px !important" }}
      >
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Product detail
        </h1>
        <p className="mb-10 text-center text-sm text-zinc-500 sm:text-base">
          {label} · Premium selection
        </p>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={4}
          className="items-stretch justify-between gap-8 lg:gap-10"
        >
          {/* Gallery */}
          <Box
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm",
              "lg:max-w-[52%] lg:flex-1"
            )}
          >
            <Box className="aspect-square w-full min-h-[280px] bg-zinc-100 lg:min-h-[420px]">
              {chosenProduct.productImages?.length ? (
                <Swiper
                  loop={hasMultipleImages}
                  spaceBetween={0}
                  navigation={hasMultipleImages}
                  modules={[Navigation]}
                  className={cn(
                    "h-full w-full [&_.swiper-button-next]:text-zinc-700 [&_.swiper-button-prev]:text-zinc-700",
                    "[&_.swiper-button-next]:drop-shadow [&_.swiper-button-prev]:drop-shadow"
                  )}
                >
                  {chosenProduct.productImages.map((ele: string, index: number) => {
                    const imagePath = `${serverApi}/${ele}`;
                    return (
                      <SwiperSlide
                        // Use the image string as key if unique, otherwise fallback to index
                        key={ele || index}
                        className="!flex h-full items-center justify-center bg-zinc-100"
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={imagePath}
                          alt={`${chosenProduct.productName} ${index + 1}`}
                          referrerPolicy="no-referrer"
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-zinc-400 lg:min-h-[420px]">
                  No image
                </div>
              )}
            </Box>
          </Box>

          {/* Info */}
          <Stack
            className={cn(
              "w-full flex-1 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8",
              "lg:max-w-[48%]"
            )}
            spacing={2}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {label}
            </span>

            <h2 className="text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
              {chosenProduct.productName}
            </h2>

            {(admin?.memberNick || admin?.memberPhone) && (
              <Stack spacing={1} className="text-sm text-zinc-600">
                {admin.memberNick && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonOutlineOutlined sx={{ fontSize: 18, color: "#71717a" }} />
                    <span>{admin.memberNick}</span>
                  </Stack>
                )}
                {admin.memberPhone && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PhoneOutlined sx={{ fontSize: 18, color: "#71717a" }} />
                    <span>{admin.memberPhone}</span>
                  </Stack>
                )}
              </Stack>
            )}


            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
              className="mt-2"
            >
              <Rating
                name="product-rating"
                defaultValue={2.5}
                precision={0.5}
                readOnly /* Added readOnly as users probably shouldn't vote here */
                sx={{
                  "& .MuiRating-iconFilled": { color: "#059669" },
                  "& .MuiRating-iconHover": { color: "#047857" },
                }}
              />
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600"
              >
                <VisibilityOutlined sx={{ fontSize: 14 }} />
                <span>{(chosenProduct.productViews ?? 0).toLocaleString()} views</span>
              </Stack>
            </Stack>

            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              {chosenProduct.productDesc?.trim()
                ? chosenProduct.productDesc
                : "No description available for this product."}
            </p>

            <div className="my-6 h-px w-full bg-zinc-200" />

            <Stack
              direction="row"
              alignItems="baseline"
              justifyContent="space-between"
              className="gap-4"
            >
              <span className="text-sm font-medium text-zinc-500">Price</span>
              <span className="text-2xl font-bold tabular-nums text-zinc-900">
                ${chosenProduct.productPrice?.toLocaleString()}
              </span>
            </Stack>

            <Box className="mt-4">
              <button
                type="button"
                // Disable if no price defined
                disabled={!chosenProduct.productPrice}
                className={cn(
                  "w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-sm",
                  "transition-colors hover:bg-emerald-600 active:scale-[0.99]",
                  // Add disabled styles
                  "disabled:bg-zinc-300 disabled:cursor-not-allowed disabled:active:scale-100"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  // Safety check
                  if (!chosenProduct.productPrice) return;

                  onAdd({
                    _id: chosenProduct._id,
                    quantity: 1,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: chosenProduct.productImages?.[0] ?? "",
                  });
                }}
              >
                Add to basket
              </button>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </motion.div>
  );
}