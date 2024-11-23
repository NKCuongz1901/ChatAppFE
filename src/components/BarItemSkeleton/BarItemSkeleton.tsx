import { Skeleton } from '../ui/skeleton'

const BarItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 px-4 p-2">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px] max-w-full" />
        <Skeleton className="h-4 w-[180px] max-w-11/12" />
      </div>
    </div>
  )
}

export default BarItemSkeleton
