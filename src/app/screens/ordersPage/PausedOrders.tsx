import React from "react";
import { motion } from "framer-motion";
import { X, Pause } from "lucide-react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrdersService";

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrderProps {
  setValue: (input: string) => void;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=100";

export default function PausedOrders(props: PausedOrderProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  const deleteOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const input: OrderUpdateInput = {
        orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete order?");

      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (orderId: string) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const input: OrderUpdateInput = {
        orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirmation = window.confirm(
        "Do you want to proced with payment?"
      );

      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value="1">
      <Stack spacing={3} className="space-y-6">
        {pausedOrders?.map((order: Order, orderIndex: number) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(orderIndex * 0.1, 0.5) }}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
          >
            <Box className="max-h-60 overflow-y-auto bg-zinc-50/50 p-6">
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
                  <Stack
                    key={item._id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    className="flex items-center justify-between border-b border-zinc-100 py-3 last:border-0"
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      className="flex items-center gap-4"
                    >
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
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      className="flex items-center gap-3 text-sm font-medium text-zinc-600"
                    >
                      <p>${item.itemPrice}</p>
                      <X size={14} className="text-zinc-400" aria-hidden />
                      <p>{item.itemQuantity}</p>
                      <Pause size={14} className="text-zinc-400" aria-hidden />
                      <p className="font-bold text-zinc-900">${lineTotal}</p>
                    </Stack>
                  </Stack>
                );
              })}
            </Box>

            <Box className="border-t border-zinc-100 bg-white p-6">
              <Stack
                direction="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500"
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    className="flex items-center gap-1"
                  >
                    <span>Product price</span>
                    <span className="font-bold text-zinc-900">
                      ${order.orderTotal - order.orderDelivery}
                    </span>
                  </Stack>
                  <span className="text-zinc-300">+</span>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    className="flex items-center gap-1"
                  >
                    <span>Delivery cost</span>
                    <span className="font-bold text-zinc-900">
                      ${order.orderDelivery}
                    </span>
                  </Stack>
                  <Box className="mx-2 hidden h-4 w-px bg-zinc-200 sm:block" />
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    className="flex items-center gap-1"
                  >
                    <span>Total</span>
                    <span className="text-xl font-bold text-zinc-900">
                      ${order.orderTotal}
                    </span>
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  className="flex items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={() => void deleteOrderHandler(order._id)}
                    className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 transition-colors hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void processOrderHandler(order._id)}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
                  >
                    Payment
                  </button>
                </Stack>
              </Stack>
            </Box>
          </motion.div>
        ))}

        {(!pausedOrders || pausedOrders.length === 0) && (
          <Box className="flex flex-row justify-center py-8">
            <img
              src="/icons/noimage-list.svg"
              alt=""
              className="h-[300px] w-[300px]"
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}
