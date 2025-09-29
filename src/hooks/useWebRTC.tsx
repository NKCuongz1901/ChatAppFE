import { useEffect, useRef, useState } from 'react'
import { socket } from '@/utils/socket'

const STUN_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }]

type StartCallParams = { selfId: string; peerId: string }

export function useWebRTC() {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [incomingCaller, setIncomingCaller] = useState<string | null>(null)
  const [inCallWith, setInCallWith] = useState<string | null>(null)
  const selfIdRef = useRef<string>('')

  useEffect(() => {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS })
    pcRef.current = pc

    pc.ontrack = (e) => {
      const [stream] = e.streams
      setRemoteStream(stream)
    }

    pc.onicecandidate = (e) => {
      if (!e.candidate || !inCallWith) return
      socket.emit('webrtc:ice-candidate', {
        fromUserId: selfIdRef.current,
        toUserId: inCallWith,
        candidate: e.candidate,
      })
    }

    return () => {
      pc.close()
      pcRef.current = null
    }
  }, [])

  const prepareLocalMedia = async () => {
    if (!localStreamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      localStreamRef.current = stream
      localStreamRef.current.getTracks().forEach((track) => {
        pcRef.current?.addTrack(track, stream)
      })
    }
    return localStreamRef.current
  }

  const startCall = async ({ selfId, peerId }: StartCallParams) => {
    selfIdRef.current = selfId
    setInCallWith(peerId)
    await prepareLocalMedia()
    const offer = await pcRef.current!.createOffer()
    await pcRef.current!.setLocalDescription(offer)
    socket.emit('call:user', { callerId: selfId, calleeId: peerId })
    socket.emit('webrtc:offer', {
      fromUserId: selfId,
      toUserId: peerId,
      sdp: offer,
    })
  }

  const acceptCall = async (selfId: string, callerId: string) => {
    selfIdRef.current = selfId
    setInCallWith(callerId)
    await prepareLocalMedia()
    setIncomingCaller(null)
  }

  const endCall = (selfId: string) => {
    if (inCallWith)
      socket.emit('call:end', { fromUserId: selfId, toUserId: inCallWith })
    cleanup()
  }

  const cleanup = () => {
    pcRef.current?.getSenders().forEach((s) => s.track?.stop())
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setRemoteStream(null)
    setInCallWith(null)
  }

  useEffect(() => {
    const onIncoming = ({ callerId }: { callerId: string }) =>
      setIncomingCaller(callerId)

    const onOffer = async ({
      fromUserId,
      sdp,
    }: {
      fromUserId: string
      sdp: RTCSessionDescriptionInit
    }) => {
      await prepareLocalMedia()
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(sdp))
      const answer = await pcRef.current!.createAnswer()
      await pcRef.current!.setLocalDescription(answer)
      setInCallWith(fromUserId)
      socket.emit('webrtc:answer', {
        fromUserId,
        toUserId: selfIdRef.current,
        sdp: answer,
      })
    }

    const onAnswer = async ({ sdp }: { sdp: RTCSessionDescriptionInit }) => {
      await pcRef.current!.setRemoteDescription(new RTCSessionDescription(sdp))
    }

    const onIce = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      await pcRef.current!.addIceCandidate(new RTCIceCandidate(candidate))
    }

    const onEnded = () => cleanup()

    socket.on('call:incoming', onIncoming)
    socket.on('webrtc:offer', onOffer)
    socket.on('webrtc:answer', onAnswer)
    socket.on('webrtc:ice-candidate', onIce)
    socket.on('call:ended', onEnded)

    return () => {
      socket.off('call:incoming', onIncoming)
      socket.off('webrtc:offer', onOffer)
      socket.off('webrtc:answer', onAnswer)
      socket.off('webrtc:ice-candidate', onIce)
      socket.off('call:ended', onEnded)
    }
  }, [])

  return {
    localStreamRef,
    remoteStream,
    incomingCaller,
    inCallWith,
    startCall,
    acceptCall,
    endCall,
  }
}
