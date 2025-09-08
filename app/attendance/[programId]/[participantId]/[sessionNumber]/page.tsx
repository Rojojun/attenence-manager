"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockData } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, PenTool, RotateCcw, Check } from "lucide-react"

interface Props {
  params: Promise<{ programId: string; participantId: string; sessionNumber: string }>
}

export default function SignaturePage({ params }: Props) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [programId, setProgramId] = useState("")
  const [participantId, setParticipantId] = useState("")
  const [sessionNumber, setSessionNumber] = useState("")
  const [participant, setParticipant] = useState<any>(null)
  const [program, setProgram] = useState<any>(null)

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setProgramId(resolvedParams.programId)
      setParticipantId(resolvedParams.participantId)
      setSessionNumber(resolvedParams.sessionNumber)

      // 참가자와 프로그램 정보 로드
      const participantData = mockData.participants.find((p) => p.id === resolvedParams.participantId)
      const programData = mockData.programs.find((p) => p.id === resolvedParams.programId)

      setParticipant(participantData)
      setProgram(programData)
    }

    loadParams()
  }, [params])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 캔버스 크기 설정 (태블릿 최적화)
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2 // 고해상도를 위한 스케일링
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    // 캔버스 스타일 설정
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // 배경 설정
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [participant])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setHasSignature(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

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

    let clientX: number, clientY: number

    if ("touches" in e) {
      e.preventDefault() // 스크롤 방지
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

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

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const saveAttendance = async () => {
    if (!hasSignature) {
      alert("서명을 해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const canvas = canvasRef.current
      if (!canvas) throw new Error("캔버스를 찾을 수 없습니다.")

      // 서명 데이터를 base64로 변환
      const signatureData = canvas.toDataURL("image/png")

      const attendanceKey = `attendance_${programId}_${participantId}_${sessionNumber}`
      const attendanceData = {
        participant_id: participantId,
        program_id: programId,
        session_number: Number.parseInt(sessionNumber),
        signature_data: signatureData,
        created_at: new Date().toISOString(),
      }

      localStorage.setItem(attendanceKey, JSON.stringify(attendanceData))

      // 전체 출석 기록도 업데이트
      const allAttendanceKey = "all_attendance_records"
      const existingRecords = JSON.parse(localStorage.getItem(allAttendanceKey) || "[]")
      const updatedRecords = [
        ...existingRecords.filter(
          (r: any) =>
            !(
              r.participant_id === participantId &&
              r.program_id === programId &&
              r.session_number === Number.parseInt(sessionNumber)
            ),
        ),
        attendanceData,
      ]
      localStorage.setItem(allAttendanceKey, JSON.stringify(updatedRecords))

      // 성공 페이지로 이동
      router.push(`/attendance/${programId}/${participantId}/success?session=${sessionNumber}`)
    } catch (error) {
      console.error("출석 저장 오류:", error)
      alert("출석 저장 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!participant || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/attendance/${programId}/${participantId}`}>
              <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">출석 서명</h1>
              <p className="text-lg text-gray-700">아래 서명란에 서명해주세요</p>
            </div>
          </div>

          {/* 출석 정보 */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{participant.name}</h3>
                  <p className="text-gray-600">
                    {participant.department} · {participant.position}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{sessionNumber}교시</h3>
                  <p className="text-gray-600">{program.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 서명 영역 */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <PenTool className="w-5 h-5" />
              서명란
            </CardTitle>
            <CardDescription className="text-base">손가락이나 스타일러스로 서명해주세요</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* 캔버스 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-6 bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-64 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {/* 버튼 */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-12 bg-transparent"
                onClick={clearSignature}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                다시 서명
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1 h-12"
                onClick={saveAttendance}
                disabled={!hasSignature || isLoading}
              >
                <Check className="w-5 h-5 mr-2" />
                {isLoading ? "저장 중..." : "출석 완료"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
