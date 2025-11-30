"use client"

import { motion } from "framer-motion"

export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-white">
      <motion.div
        className="h-48 w-full bg-gray-200"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <motion.div
          className="h-6 w-32 rounded bg-gray-200"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-12 rounded bg-gray-200"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          ))}
        </div>

        <motion.div
          className="h-10 w-full rounded bg-gray-200"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.div
          className="h-8 w-24 rounded bg-gray-200"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.div
          className="mt-auto h-10 w-full rounded bg-gray-200"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </div>
  )
}
