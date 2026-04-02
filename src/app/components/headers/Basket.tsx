import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrdersService";
import { cn } from "../../../lib/utils/cn";

function cartImageSrc(image: string): string {
  if (!image?.trim()) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${serverApi}/${image.replace(/^\//, "")}`;
}

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost = itemsPrice > 0 && itemsPrice < 500 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(2);
  const totalPieces = cartItems.reduce((a, c) => a + c.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const proceedOrderHandlar = async () => {
    try {
      setIsOpen(false);
      if (!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      await order.createOrder(cartItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      history.push("/orders");
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Shopping cart"
        className={cn(
          "group relative rounded-full p-2.5 text-zinc-600 transition-all",
          "hover:bg-white/80 hover:text-zinc-900",
          "ring-1 ring-transparent hover:ring-zinc-200/90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        )}
      >
        <ShoppingBag
          size={22}
          strokeWidth={1.75}
          className="transition-transform group-hover:scale-105"
        />
        {totalPieces > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {totalPieces > 99 ? "99+" : totalPieces}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "absolute right-0 z-[1000] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl sm:w-96"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2">
              <ShoppingCart size={18} className="shrink-0 text-zinc-800" strokeWidth={1.75} />
              <span className="truncate font-semibold text-zinc-900">Your cart</span>
              <span className="shrink-0 rounded-full bg-zinc-200/90 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={() => onDeleteAll()}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>

          <div className="max-h-[min(400px,70vh)] space-y-3 overflow-y-auto overscroll-contain p-4">
            {cartItems.length === 0 ? (
              <div className="space-y-4 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                  <ShoppingBag size={28} strokeWidth={1.5} />
                </div>
                <p className="text-sm text-zinc-500">Your cart is empty</p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartRow
                  key={item._id}
                  item={item}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="space-y-4 border-t border-zinc-100 bg-zinc-50/60 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="font-semibold tabular-nums text-zinc-900">
                    ${itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="font-semibold text-emerald-600">
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-200/80 pt-3">
                  <span className="font-semibold text-zinc-900">Total</span>
                  <span className="text-xl font-bold tabular-nums text-emerald-600">
                    ${totalPrice}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={proceedOrderHandlar}
                className={cn(
                  "group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white shadow-sm",
                  "transition-colors hover:bg-emerald-600 active:scale-[0.99]"
                )}
              >
                Place order
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function CartRow({
  item,
  onAdd,
  onRemove,
  onDelete,
}: {
  item: CartItem;
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  const src = cartImageSrc(item.image);

  return (
    <div className="flex gap-3 rounded-xl border border-zinc-100 bg-white p-2 transition-shadow hover:border-zinc-200 hover:shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-100">
        {src && imgOk ? (
          <img
            src={src}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
            No image
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
            {item.name}
          </h4>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="shrink-0 rounded-lg p-1 text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Remove item"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-medium tabular-nums text-zinc-600">
            ${item.price}{" "}
            <span className="text-zinc-400">× {item.quantity}</span>
          </span>
          <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-white hover:text-emerald-600"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[1.75rem] text-center text-xs font-bold text-zinc-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-white hover:text-emerald-600"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
