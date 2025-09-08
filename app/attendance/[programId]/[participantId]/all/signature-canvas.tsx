"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Trash2, Check } from "lucide-react"

interface SignatureCanvasProps {
  programId: string
  participantId: string
  totalSessions: number
}

export default function SignatureCanvas({ programId, participantId, totalSessions }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 캔버스 크기 설정
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    // 캔버스 스타일 설정
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setHasSignature(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const submitSignature = () => {
    if (!hasSignature) return

    const canvas = canvasRef.current
    if (!canvas) return

    // 서명 데이터를 base64로 변환
    const signatureData = canvas.toDataURL()

    // 모든 교시에 대해 출석 기록 생성
    const existingRecords = JSON.parse(localStorage.getItem("attendance_records") || "[]")

    // 기존 출석 기록 제거 (중복 방지)
    const filteredRecords = existingRecords.filter(
      (record: any) => !(record.participant_id === participantId && record.program_id === programId),
    )

    // 모든 교시에 대한 새로운 출석 기록 생성
    const newRecords = Array.from({ length: totalSessions }, (_, i) => ({
      id: `${participantId}-${programId}-${i + 1}-${Date.now()}`,
      participant_id: participantId,
      program_id: programId,
      session_number: i + 1,
      signature_data: signatureData,
      created_at: new Date().toISOString(),
    }))

    // 로컬 스토리지에 저장
    localStorage.setItem("attendance_records", JSON.stringify([...filteredRecords, ...newRecords]))

    // 성공 페이지로 이동
    router.push(`/attendance/${programId}/${participantId}/success?sessions=all`)
  }

  return (
    <div className="space-y-6">
      {/* 서명 캔버스 */}
      <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-48 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={clearSignature}
          className="flex items-center gap-2 h-14 px-8 text-base bg-transparent"
        >
          <Trash2 className="w-5 h-5" />
          다시 쓰기
        </Button>
        <Button
          size="lg"
          onClick={submitSignature}
          disabled={!hasSignature}
          className="flex items-center gap-2 h-14 px-8 text-base bg-purple-600 hover:bg-purple-700"
        >
          <Check className="w-5 h-5" />
          전체 출석 완료
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">서명 후 "전체 출석 완료" 버튼을 눌러주세요</p>
    </div>
  )
}
