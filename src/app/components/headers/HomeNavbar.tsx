import { Logout } from "@mui/icons-material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import {
  Container,
  Stack,
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import Basket from "./Basket";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  const navItems: Array<{ to: string; label: string; exact?: boolean }> = [
    { to: "/", label: "Home", exact: true },
    { to: "/products", label: "Products" },
    ...(authMember
      ? [
          { to: "/orders", label: "Orders" },
          { to: "/member-page", label: "My Page" },
        ]
      : []),
    { to: "/help", label: "Help" },
  ];

  const navLinkBase =
    "m-[10px] inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide text-zinc-600 no-underline transition-all duration-200 hover:bg-white/70 hover:text-zinc-900 active:scale-[0.98]";
  const navLinkActive =
    "!text-emerald-700 bg-emerald-500/[0.12] ring-1 ring-emerald-500/25 shadow-sm";

  return (
    <Box
      component="div"
      className="home-navbar home-navbar--luxury relative flex min-h-[85vh] flex-col bg-zinc-50"
    >
      <Box className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Box
          component="img"
          src="./img/rasm7.avif"
          alt=""
          className="h-full w-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <Box className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent" />
      </Box>

      <Container
        maxWidth={false}
        className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1300px] flex-col px-4 sm:px-6 lg:px-8"
      >
        <Stack
          direction="row"
          className="menu shrink-0 items-center justify-between pt-6 md:pt-8"
        >
          <Box>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tighter text-black no-underline"
            >
              <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-white">
                L
              </span>
              LUXE
              <span className="text-emerald-600">COMMERCE</span>
            </Link>
          </Box>
          <Stack
            direction="row"
            className="links items-center"
            flexWrap="wrap"
            useFlexGap
            sx={{ gap: { xs: 0.5, sm: 0.75 } }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                exact={item.exact}
                className={navLinkBase}
                activeClassName={navLinkActive}
              >
                {item.label}
              </NavLink>
            ))}
            <Box sx={{ ml: "10px", mr: "15px" }}>
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />
            </Box>
            {!authMember ? (
              <Box>
                              <Button
                                type="button"
                                onClick={() => setLoginOpen(true)}
                                variant="contained"
                                className="login-button"
                                sx={{
                                  bgcolor: "#18181b",
                                  color: "#fff",
                                  "&:hover": { bgcolor: "#059669" },
                                }}
                              >
                                Login
                              </Button>
                            </Box>
            ) : (
              <img
                alt="Account"
                className="user-avatar h-[50px] w-[50px] max-h-[50px] max-w-[50px] shrink-0 cursor-pointer rounded-[24px] object-cover"
                src={
                  authMember.memberImage
                    ? `${serverApi}/${authMember.memberImage}`
                    : "/icons/default-user.svg"
                }
                onClick={handleLogoutClick}
              />
            )}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>

        <Box className="flex flex-1 flex-col justify-center py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="mb-6 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
              New Collection 2026
            </span>
            <h1 className="mb-8 text-5xl font-bold leading-[0.9] tracking-tighter text-zinc-900 sm:text-6xl md:text-7xl lg:text-8xl">
              ELEVATE YOUR <br />
              <span className="text-emerald-600">LIFESTYLE.</span>
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-600">
              Discover our curated selection of premium products designed for
              those who appreciate the finer details in life.
            </p>
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={2}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 font-semibold text-white shadow-xl shadow-zinc-900/20 transition-all hover:bg-emerald-600"
              >
                Shop Now
                <ArrowForward
                  sx={{ fontSize: 20 }}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              {!authMember ? (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setSignupOpen(true)}
                  className="rounded-2xl border-zinc-300 px-8 py-4 font-semibold capitalize text-zinc-900"
                  sx={{
                    borderRadius: "1rem",
                    borderWidth: 2,
                    py: 2,
                    px: 4,
                    "&:hover": {
                      borderColor: "#059669",
                      color: "#059669",
                    },
                  }}
                >
                  Sign up
                </Button>
              ) : null}
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
