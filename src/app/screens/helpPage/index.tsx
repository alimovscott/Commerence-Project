import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Send,
  Mail,
  User,
  FileText,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { terms } from "../../../lib/data/terms";
import { faq } from "../../../lib/data/faq";

type TabType = "terms" | "faq" | "contact";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<TabType>("terms");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const tabs = [
    { id: "terms" as const, label: "Terms", icon: FileText },
    { id: "faq" as const, label: "FAQ", icon: HelpCircle },
    { id: "contact" as const, label: "Contact", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 mb-4"
          >
            How can we help?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg"
          >
            Find answers to common questions or get in touch with our team.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-zinc-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }
                  `}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content — key remounts panel so tab change re-runs enter animation (avoids AnimatePresence + old TS types) */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "terms" && (
              <div className="p-8 md:p-12">
                <div className="max-w-none">
                  <h2 className="text-2xl font-semibold mb-6 text-zinc-900">
                    Terms of Service
                  </h2>
                  <div className="space-y-6">
                    {terms.map((term, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-zinc-600 leading-relaxed">{term}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-semibold mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faq.map((item, i) => (
                    <div
                      key={i}
                      className="border border-zinc-100 rounded-xl overflow-hidden transition-all duration-200 hover:border-zinc-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-zinc-50/50 transition-colors"
                      >
                        <span className="font-medium text-zinc-900 pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`flex-shrink-0 text-zinc-400 transition-transform duration-300 ${
                            openFaq === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: openFaq === i ? "auto" : 0,
                          opacity: openFaq === i ? 1 : 0,
                        }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-zinc-600 leading-relaxed border-t border-zinc-50">
                          {item.answer}
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="p-8 md:p-12">
                <div className="max-w-xl mx-auto">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-semibold mb-2">Get in touch</h2>
                    <p className="text-zinc-500">
                      We&apos;ll get back to you as soon as possible.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-100 rounded-2xl p-12 text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-emerald-700">
                        Thank you for reaching out. We&apos;ll be in touch soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                          <User size={16} className="text-zinc-400" />
                          Full Name
                        </label>
                        <input
                          required
                          type="text"
                          name="memberNick"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                          <Mail size={16} className="text-zinc-400" />
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          name="memberEmail"
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                          <MessageSquare size={16} className="text-zinc-400" />
                          Message
                        </label>
                        <textarea
                          required
                          rows={5}
                          name="memberMsg"
                          placeholder="How can we help you?"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-zinc-900 text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 group"
                      >
                        Send Message
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
