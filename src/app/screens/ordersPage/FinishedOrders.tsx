import React from "react";
import { motion } from "framer-motion";
import { X, Pause, CheckCircle2 } from "lucide-react";
import { Box } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";

const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=100";

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value="3">
      <div className="space-y-6">
        {finishedOrders?.map((order: Order, orderIndex: number) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(orderIndex * 0.1, 0.5) }}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
          >
            <div className="max-h-60 overflow-y-auto bg-zinc-50/50 p-6">
              {order?.orderItems?.map((item: OrderItem) => {
                const product = order.productData.find(
                  (ele: Product) => item.productId === ele._id
                );
                if (!product) return null;
                const imagePath = product.productImages?.[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "";
                const lineTotal = item.itemQuantity * item.itemPrice;

                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePath}
                        alt={product.productName}
                        className="h-12 w-12 rounded-full border border-zinc-200 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                      />
                      <p className="font-bold text-zinc-900">
                        {product.productName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                      <p>${item.itemPrice}</p>
                      <X size={14} className="text-zinc-400" aria-hidden />
                      <p>{item.itemQuantity}</p>
                      <Pause size={14} className="text-zinc-400" aria-hidden />
                      <p className="font-bold text-zinc-900">${lineTotal}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-100 bg-white p-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-zinc-500">
                <div className="flex items-center gap-1">
                  <span>Product price</span>
                  <span className="font-bold text-zinc-900">
                    ${order.orderTotal - order.orderDelivery}
                  </span>
                </div>
                <span className="text-zinc-300">+</span>
                <div className="flex items-center gap-1">
                  <span>Delivery cost</span>
                  <span className="font-bold text-zinc-900">
                    ${order.orderDelivery}
                  </span>
                </div>
                <div className="mx-2 h-4 w-px bg-zinc-200" />
                <div className="flex items-center gap-1">
                  <span>Total</span>
                  <span className="text-xl font-bold text-zinc-900">
                    ${order.orderTotal}
                  </span>
                </div>
                <div className="ml-4 flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={16} aria-hidden />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box className="flex flex-row justify-center py-8">
            <img
              src="/icons/noimage-list.svg"
              alt=""
              className="h-[300px] w-[300px]"
            />
          </Box>
        )}
      </div>
    </TabPanel>
  );
}
