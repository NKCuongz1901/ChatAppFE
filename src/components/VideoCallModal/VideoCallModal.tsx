import { FC, useEffect, useRef } from 'react'

type Props = {
  isOpen: boolean
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  onClose: () => void
}

const VideoCallModal: FC<Props> = ({
  isOpen,
  localStream,
  remoteStream,
  onClose,
}) => {
  const localRef = useRef<HTMLVideoElement>(null)
  const remoteRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localRef.current) localRef.current.srcObject = localStream || null
  }, [localStream])

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream || null
  }, [remoteStream])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-4 w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-2">
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded"
          />
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="w-full rounded"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Kết thúc
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCallModal
