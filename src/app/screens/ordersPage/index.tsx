import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Stack, Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import { BadgeCheck, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";

import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrdersService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/orders.css";
import { useHistory } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

type OrderTab = "paused" | "process" | "finished";

const tabToContextValue = (tab: OrderTab): "1" | "2" | "3" => {
  if (tab === "paused") return "1";
  if (tab === "process") return "2";
  return "3";
};

const contextValueToTab = (v: string): OrderTab => {
  if (v === "2") return "process";
  if (v === "3") return "finished";
  return "paused";
};

export default function OrdersPage() {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());

  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<OrderTab>("paused");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  const tabs = [
    { id: "paused" as const, label: "PAUSED ORDERS" },
    { id: "process" as const, label: "PROCESS ORDERS" },
    { id: "finished" as const, label: "FINISHED ORDERS" },
  ];

  const setValueFromChild = (v: string) => {
    setActiveTab(contextValueToTab(v));
  };

  useEffect(() => {
    const order = new OrderService();
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]);

  if (!authMember) history.push("/");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen overflow-hidden bg-zinc-50"
    >
      <Container
        maxWidth={false}
        className="mx-auto mb-16 max-w-[1200px] px-4 sm:px-6 lg:px-8"
      >
        <Box component="header" className="mb-12">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900">
            My Orders
          </h1>
          <p className="text-zinc-500">
            Track and manage your recent purchases.
          </p>
        </Box>

        <Box className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[70%_30%]">
          <Stack spacing={3} className="space-y-6">
            <Box className="mb-8 overflow-x-auto rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                className="flex min-w-[500px] items-center justify-center"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 rounded-2xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </Stack>
            </Box>

            <Box className="order-main-content min-h-[400px]">
              <TabContext value={tabToContextValue(activeTab)}>
                <PausedOrders setValue={setValueFromChild} />
                <ProcessOrders setValue={setValueFromChild} />
                <FinishedOrders />
              </TabContext>
            </Box>
          </Stack>

          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-emerald-50 shadow-inner">
                    <img
                      src={
                        authMember?.memberImage
                          ? `${serverApi}/${authMember.memberImage}`
                          : "/icons/default-user.svg"
                      }
                      alt={authMember?.memberNick ?? ""}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/icons/default-user.svg";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full border border-zinc-100 bg-white p-1.5 shadow-md">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-bold text-zinc-900">
                  {authMember?.memberNick ?? "—"}
                </h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
                  {authMember?.memberType === MemberType.ADMIN
                    ? "ADMIN"
                    : "USER"}
                </span>

                <div className="mt-6 w-full border-t border-zinc-100 pt-6">
                  <div className="flex items-center justify-center gap-2 text-zinc-500">
                    <MapPin size={18} className="text-zinc-400" />
                    <span className="text-sm">
                      {authMember?.memberAddress
                        ? authMember.memberAddress
                        : "No address on file"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm"
            >
              <h3 className="mb-6 text-lg font-bold text-zinc-900">
                Payment Method
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="Card number : 5243 4090 2002 7495"
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="07 / 24"
                      className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-center text-sm text-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="CVV : 010"
                      className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-center text-sm text-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Card Holder
                  </label>
                  <input
                    type="text"
                    placeholder="Justin Robertson"
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-2">
                <div className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-3"
                  />
                </div>
                <div className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="MasterCard"
                    className="h-5"
                  />
                </div>
                <div className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    className="h-2"
                  />
                </div>
                <div className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg border border-zinc-100 bg-zinc-50 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                    alt="Apple Pay"
                    className="h-4"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Box>
      </Container>
    </motion.div>
  );
}
