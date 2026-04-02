import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { Search } from "lucide-react";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils/cn";

// We will reduce reliance on this file, keeping only layout specifics
import "../../../css/products.css";

import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { Product, ProductInquery } from "../../../lib/types/product";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { TeamMemberCard } from "./TeamMemberCard";
import { TEAM_MEMBERS } from "./teamMembers";

const actionDispatch = (dispatch: Dispatch) => ({
    setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
    products,
}));

interface ProductsProps {
    onAdd: (item: CartItem) => void;
}

function categoryLabel(collection: ProductCollection): string {
    switch (collection) {
        
        case ProductCollection.ACCESSORIES:
            return "ACCESSORIES";
        case ProductCollection.BAGS:
            return "BAGS";
        case ProductCollection.ELECTIRONICS:
            return "ELECTIRONICS";
        case ProductCollection.HOMEDECOR:
            return "HOMEDECOR";
        default:
            return collection;
    }
}

interface ProductCardProps {
    product: Product;
    index: number;
    onAdd: ProductsProps["onAdd"];
    onCardNavigate: (id: string) => void;
}

function ProductCard({ product, index, onAdd, onCardNavigate }: ProductCardProps) {
    const [imgOk, setImgOk] = useState(true);
    const raw = product.productImages?.[0];
    const imagePath = raw ? `${serverApi}/${raw}` : "";

    const onCardClick = () => onCardNavigate(product._id);

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
                            onAdd({
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

export default function Products(props: ProductsProps) {
    const { onAdd } = props;
    const history = useHistory();
    const { setProducts } = actionDispatch(useDispatch());
    const { products } = useSelector(productsRetriever);

    const [productSearch, setProductSearch] = useState<ProductInquery>({
        page: 1,
        limit: 8,
        order: "createdAt",
        productCollection: ProductCollection.ACCESSORIES,
        search: "",
    });

    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        const product = new ProductService();
        product.getProducts(productSearch)
            .then((data) => setProducts(data))
            .catch((err) => console.log("err"));
    }, [productSearch]);

    useEffect(() => {
        if (searchText === "") {
            productSearch.search = "";
            setProductSearch({ ...productSearch });
        }
    }, [searchText]);

    // Handlers

    const searchCollectionHandler = (collection: ProductCollection) => {
        productSearch.page = 1;
        productSearch.productCollection = collection;
        setProductSearch({ ...productSearch });
    };

    const setSortByOrder = (order: string) => {
        productSearch.page = 1;
        productSearch.order = order;
        setProductSearch({ ...productSearch });
    };

    const searchProductHandler = () => {
        productSearch.search = searchText;
        setProductSearch({ ...productSearch });
    };

    const PaginationHandler = (e: ChangeEvent<any>, value: number) => {
        productSearch.page = value;
        setProductSearch({ ...productSearch });
    };

    const chooseDishHandler = (id: string) => {
        history.push(`/products/${id}`);
    };

    const sortOptions: { label: string; order: string }[] = [
        { label: "New", order: "createdAt" },
        { label: "Price", order: "productPrice" },
        { label: "Popular", order: "productViews" },
    ];

    // Helper for category chips
    const categories = [
        { label: "ACCESSORIES", value: ProductCollection.ACCESSORIES },
        { label: "BAGS", value: ProductCollection.BAGS },
        { label: "ELECTIRONICS", value: ProductCollection.ELECTIRONICS },
        { label: "HOMEDECOR", value: ProductCollection.HOMEDECOR },
        // { label: "OTHER", value: ProductCollection.OTHER },
    ];

    return (
        <div className={"products"}>
            <Container>
                <Stack className="column" alignItems="stretch" spacing={4} width="100%">
                    <Stack
                        direction={{ xs: "column", lg: "row" }}
                        alignItems={{ lg: "center" }}
                        justifyContent="space-between"
                        spacing={3}
                        className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
                    >
                        <Box>
                            <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900">
                                Our Collection
                            </h1>
                            <p className="text-zinc-500">
                                Discover our curated selection of premium goods.
                            </p>
                        </Box>
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            alignItems="center"
                            spacing={2}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <Stack
                                direction="row"
                                className="flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm"
                            >
                                {sortOptions.map(({ label, order }) => (
                                    <button
                                        key={order}
                                        type="button"
                                        onClick={() => setSortByOrder(order)}
                                        className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${
                                            productSearch.order === order
                                                ? "bg-zinc-900 text-white shadow-md"
                                                : "text-zinc-500 hover:text-zinc-900"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                className="flex flex-1 flex-wrap gap-2 md:w-80 md:min-w-[min(100%,20rem)]"
                            >
                                <Box className="relative min-w-[200px] flex-1">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                        size={18}
                                        aria-hidden
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") searchProductHandler();
                                        }}
                                        className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </Box>
                                <button
                                    type="button"
                                    onClick={searchProductHandler}
                                    className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-zinc-800"
                                >
                                    Search
                                </button>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        spacing={1}
                        className="flex flex-wrap gap-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => searchCollectionHandler(cat.value)}
                                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                                    productSearch.productCollection === cat.value
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                                        : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </Stack>

                    {/* MAIN CONTENT: PRODUCT GRID */}
                    <Stack spacing={3} width="100%">
                            {/* PRODUCT GRID */}
                            <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.length !== 0 ? (
                                    products.map((product, index) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            index={index}
                                            onAdd={onAdd}
                                            onCardNavigate={chooseDishHandler}
                                        />
                                    ))
                                ) : (
                                    <Box className="no-data col-span-full text-center text-emerald-700">
                                        No products available
                                    </Box>
                                )}
                            </Box>

                            {/* PAGINATION */}
                            <Stack className={"pagination-section"} alignItems="center">
                                <Pagination
                                    count={products.length !== 0 ? productSearch.page + 1 : productSearch.page}
                                    page={productSearch.page}
                                    renderItem={(item) => (
                                        <PaginationItem
                                            components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                            {...item}
                                            color={"secondary"}
                                            sx={{
                                                '&.Mui-selected': { fontWeight: 'bold' }
                                            }}
                                        />
                                    )}
                                    onChange={PaginationHandler}
                                />
                            </Stack>
                    </Stack>
                </Stack>
            </Container>

            {/* Our Team (replaces Family Brands block) */}
            <Box className="mt-32">
                <Container maxWidth={false} className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
                    <Box className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900">
                            Our Team
                        </h2>
                        <p className="mx-auto max-w-2xl text-zinc-500">
                            Meet the passionate individuals behind our premium
                            collection.
                        </p>
                    </Box>
                    <Box className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {TEAM_MEMBERS.map((member, index) => (
                            <TeamMemberCard
                                key={member.name}
                                member={member}
                                index={index}
                            />
                        ))}
                    </Box>
                </Container>
            </Box>

            <Box className="mt-32 mb-16">
                <Container
                    maxWidth={false}
                    className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8"
                >
                    <Box className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900">
                            Our Address
                        </h2>
                        <p className="mx-auto max-w-2xl text-zinc-500">
                            Visit us at our flagship store or contact us for any
                            inquiries.
                        </p>
                    </Box>
                    <Box className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-4 shadow-sm">
                        <Box className="relative h-[450px] w-full overflow-hidden rounded-[2rem]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215707144122!2d-73.98784368459377!3d40.75797477932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480293%3A0x51174707025994b4!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1652345678901!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Our Location"
                            />
                        </Box>
                        <Box className="grid grid-cols-1 gap-8 p-8 md:grid-cols-3">
                            <Stack
                                alignItems="center"
                                className="flex flex-col items-center text-center"
                            >
                                <Box className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden
                                    >
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </Box>
                                <h3 className="mb-1 font-bold text-zinc-900">
                                    Visit Us
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    South Korea, near Yeungnam University
                                </p>
                            </Stack>
                            <Stack
                                alignItems="center"
                                className="flex flex-col items-center text-center"
                            >
                                <Box className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </Box>
                                <h3 className="mb-1 font-bold text-zinc-900">
                                    Call Us
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    +8210-4364-1330
                                </p>
                            </Stack>
                            <Stack
                                alignItems="center"
                                className="flex flex-col items-center text-center"
                            >
                                <Box className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden
                                    >
                                        <rect
                                            width="20"
                                            height="16"
                                            x="2"
                                            y="4"
                                            rx="2"
                                        />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </Box>
                                <h3 className="mb-1 font-bold text-zinc-900">
                                    Email Us
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    abduqodiralimov23@icloud.com
                                </p>
                            </Stack>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </div>
    );
}