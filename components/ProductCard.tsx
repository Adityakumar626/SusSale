"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronDown,
  ExternalLink,
  Trash2,
  TrendingDown,
  Loader2,
} from "lucide-react";

import { deleteProduct } from "@/app/actions";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import PriceChart from "./PriceChart";
import { ProductProps } from "@/types/type";

export default function ProductCard({ product }: ProductProps) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.message || "Product deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:border-blue-500/30 dark:hover:border-blue-400/30 hover:shadow-md dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {product.image_url && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
                className="relative shrink-0 overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-1"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="object-cover rounded-lg aspect-square"
                  unoptimized
                />
              </motion.div>
            )}

            <div className="flex-1 min-w-0 space-y-1.5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-sm leading-snug tracking-tight">
                {product.name}
              </h3>

              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                  {product.currency} {product.current_price}
                </span>

                <Badge
                  variant="secondary"
                  className="gap-1 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50"
                >
                  <TrendingDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Tracking
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant={showChart ? "default" : "outline"}
                size="sm"
                onClick={() => setShowChart((prev) => !prev)}
                className="gap-1.5 text-xs h-8 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                <motion.div
                  animate={{ rotate: showChart ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
                {showChart ? "Hide Chart" : "Show Chart"}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </Button>
              </Link>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }} className="ml-auto">
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={deleting}
                size="sm"
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-700 dark:hover:text-red-300 gap-1.5 text-xs h-8 px-2.5 transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{deleting ? "Removing..." : "Remove"}</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>

        <AnimatePresence initial={false}>
          {showChart && (
            <motion.div
              key="chart-wrapper"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 p-4">
                <PriceChart productId={product.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
