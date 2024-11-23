import { cn } from '@/utils/utils'
import { motion } from 'framer-motion'
import { FC, memo } from 'react'
import { Skeleton } from '../ui/skeleton'
type MessageItemSkeletonProp = {
  duration: number
}
const MessageItemSkeleton: FC<MessageItemSkeletonProp> = memo(
  ({ duration }) => {
    const isLeft = Math.random() >= 0.5

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
        transition={{
          opacity: { duration: 0.1 },
          layout: {
            type: 'spring',
            bounce: 0.3,
            duration: duration,
          },
        }}
        style={{
          originX: 0.5,
          originY: 0.5,
        }}
        className={cn(
          'flex flex-col gap-2 p-4 whitespace-pre-wrap',
          !isLeft ? 'items-end' : 'items-start'
        )}
      >
        <div className="flex gap-3 items-center">
          {isLeft && <Skeleton className="h-12 w-12 rounded-full" />}
          <span className="bg-accent p-3 rounded-md max-w-xs">
            <Skeleton className="h-4 w-[250px] max-w-full" />
          </span>
          {!isLeft && <Skeleton className="h-12 w-12 rounded-full" />}
        </div>
      </motion.div>
    )
  }
)

export default MessageItemSkeleton
