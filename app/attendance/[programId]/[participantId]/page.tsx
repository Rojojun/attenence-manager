"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, User, Clock, CheckCircle } from "lucide-react"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// 타입 정의
interface Attendance {
    id: string
    date: string
    session: number
}

interface Participant {
    id: string
    name: string
    department: string
    position: string
    attendance: Attendance[]
}

interface Program {
    id: string
    name: string
    description: string
    total_sessions: number
    participants: Participant[]
}

interface Props {
    params: { programId: string; participantId: string }
}

export default function SessionSelectionPage({ params }: Props) {
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)
    const { programId, participantId } = params

    // 로컬 스토리지에서 프로그램 데이터 불러오기
    useEffect(() => {
        try {
            const savedPrograms = localStorage.getItem('attendance-programs')
            if (savedPrograms) {
                setPrograms(JSON.parse(savedPrograms))
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        )
    }
    const program = programs.find((p) => p.id === programId)
    const participant = program?.participants.find((p) => p.id === participantId)

    if (!program || !participant) {
        notFound()
    }

    const sessions = Array.from({ length: program.total_sessions }, (_, i) => i + 1)

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6">
            <div className="mx-auto max-w-4xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href={`/attendance/${programId}`}>
                            <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">교시 선택</h1>
                            <p className="text-lg text-gray-700">출석할 교시를 선택해주세요</p>
                        </div>
                    </div>

                    {/* 참가자 정보 */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900">{participant.name}</h3>
                                    <p className="text-gray-600">
                                        {participant.department} · {participant.position}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <SessionGrid sessions={sessions} programId={programId} participantId={participantId} program={program} />
            </div>
        </div>
    )
}

function SessionGrid({
                         sessions,
                         programId,
                         participantId,
                         program,
                     }: {
    sessions: number[]
    programId: string
    participantId: string
    program: Program
}) {
    const [attendedSessions, setAttendedSessions] = useState<number[]>([])
    const [selectedSessions, setSelectedSessions] = useState<number[]>([])
    const router = useRouter()

    useEffect(() => {
        const loadAttendanceRecords = () => {
            try {
                const stored = localStorage.getItem("attendance_records")
                if (stored) {
                    const records = JSON.parse(stored)
                    const filteredRecords = records.filter(
                        (record: any) => record.participant_id === participantId && record.program_id === programId,
                    )
                    setAttendedSessions(filteredRecords.map((record: any) => record.session_number))
                }
            } catch (error) {
                console.error('출석 기록 로드 실패:', error)
            }
        }

        loadAttendanceRecords()

        // 스토리지 변경 감지하여 실시간 업데이트
        const handleStorageChange = () => {
            loadAttendanceRecords()
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [participantId, programId])

    const handleSessionToggle = (sessionNumber: number, checked: boolean) => {
        if (attendedSessions.includes(sessionNumber)) return

        if (checked) {
            setSelectedSessions((prev) => [...prev, sessionNumber])
        } else {
            setSelectedSessions((prev) => prev.filter((s) => s !== sessionNumber))
        }
    }

    const handleSelectedAttendance = () => {
        if (selectedSessions.length === 0) return

        const sessionsParam = selectedSessions.join(",")
        router.push(`/attendance/${programId}/${participantId}/selected?sessions=${sessionsParam}`)
    }

    const availableSessions = sessions.filter((session) => !attendedSessions.includes(session))

    return (
        <>
            {selectedSessions.length > 0 && (
                <Card className="mb-6 bg-blue-50/90 backdrop-blur-sm border-2 border-blue-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900">{selectedSessions.length}개 교시 선택됨</h3>
                                <p className="text-blue-700">선택한 교시: {selectedSessions.sort((a, b) => a - b).join(", ")}교시</p>
                            </div>
                            <Button
                                onClick={handleSelectedAttendance}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                            >
                                선택한 교시 출석하기
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 교시 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSessions.length > 0 && (
                    <Link href={`/attendance/${programId}/${participantId}/all`}>
                        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm hover:border-purple-400">
                            <CardHeader className="text-center py-8">
                                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-purple-600" />
                                </div>
                                <CardTitle className="text-xl text-purple-900">모든 교시</CardTitle>
                                <CardDescription className="text-purple-700 text-base font-medium">한 번에 출석하기</CardDescription>
                                <Badge variant="outline" className="mt-2 border-purple-300 text-purple-700">
                                    전체 출석
                                </Badge>
                            </CardHeader>
                        </Card>
                    </Link>
                )}

                {sessions.map((sessionNumber) => {
                    const isAttended = attendedSessions.includes(sessionNumber)
                    const isSelected = selectedSessions.includes(sessionNumber)

                    return (
                        <div key={sessionNumber}>
                            {isAttended ? (
                                <Card className="border-2 border-green-300 bg-green-50/90 backdrop-blur-sm opacity-90">
                                    <CardHeader className="text-center py-8">
                                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <CardTitle className="text-2xl text-green-800">{sessionNumber}교시</CardTitle>
                                        <CardDescription className="text-green-600 text-base font-semibold">출석 완료</CardDescription>
                                        <Badge variant="default" className="mt-2 bg-green-600 text-white">
                                            출석 완료
                                        </Badge>
                                        <Button variant="outline" size="sm" className="mt-2 text-xs bg-transparent" disabled>
                                            출석 완료됨
                                        </Button>
                                    </CardHeader>
                                </Card>
                            ) : (
                                <Card
                                    className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 bg-white/90 backdrop-blur-sm ${
                                        isSelected ? "border-blue-400 bg-blue-50/90" : "hover:border-blue-300"
                                    }`}
                                >
                                    <CardHeader className="text-center py-6">
                                        <div className="flex justify-center mb-4">
                                            <Checkbox
                                                id={`session-${sessionNumber}`}
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleSessionToggle(sessionNumber, checked as boolean)}
                                                className="w-6 h-6"
                                                disabled={isAttended}
                                            />
                                        </div>
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                            <Clock className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-2xl text-gray-900">{sessionNumber}교시</CardTitle>
                                        <CardDescription className="text-gray-600 text-base">
                                            {isSelected ? "선택됨" : "출석하기"}
                                        </CardDescription>
                                        <Badge variant="outline" className={`mt-2 ${isSelected ? "border-blue-400 text-blue-700" : ""}`}>
                                            {isSelected ? "선택됨" : "출석 대기"}
                                        </Badge>
                                        <Link href={`/attendance/${programId}/${participantId}/${sessionNumber}`} className="mt-2">
                                            <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                                개별 출석
                                            </Button>
                                        </Link>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* 출석 현황 요약 */}
            <Card className="mt-8 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">출석 현황</h3>
                    <p className="text-gray-600">
                        총 {program.total_sessions}교시 중 {attendedSessions.length}교시 출석 완료
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(attendedSessions.length / program.total_sessions) * 100}%` }}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}