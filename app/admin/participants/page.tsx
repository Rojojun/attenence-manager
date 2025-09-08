"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Users, Upload, ArrowLeft, Gift, CheckCircle, XCircle } from "lucide-react"
import { useState, useEffect } from "react"

// 타입 정의
interface AttendanceRecord {
    id: string
    participant_id: string
    program_id: string
    session_number: number
    signature_data: string
    attended_at: string
}

interface Participant {
    id: string
    program_id: string
    name: string
    email: string
    phone: string
    gift_received: boolean
    created_at: string
    department?: string
    position?: string
    attendanceCount?: number
}

interface Program {
    id: string
    name: string
    description: string
    total_sessions: number
    start_date: string
    end_date: string
    created_at: string
    participants?: Participant[]
}

export default function ParticipantsPage() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                // 저장된 프로그램 데이터 불러오기
                const savedPrograms = localStorage.getItem('attendance-programs')
                let programsData: Program[] = []

                if (savedPrograms) {
                    programsData = JSON.parse(savedPrograms)
                } else {
                    // mockData를 사용할 때 중첩 구조로 변환
                    const { mockPrograms, mockParticipants, mockAttendance } = await import('@/lib/mock-data')
                    programsData = mockPrograms.map(program => ({
                        ...program,
                        participants: mockParticipants
                            .filter(p => p.program_id === program.id)
                            .map(participant => {
                                // 각 참가자의 출석 횟수 계산
                                const attendanceCount = mockAttendance.filter(
                                    a => a.participant_id === participant.id && a.program_id === program.id
                                ).length

                                return {
                                    ...participant,
                                    attendanceCount,
                                    department: participant.email, // mockData에는 department가 없으므로 email로 대체
                                    position: participant.phone // position도 phone으로 대체
                                }
                            })
                    }))
                    localStorage.setItem('attendance-programs', JSON.stringify(programsData))
                }

                // 출석 기록도 별도로 저장
                const savedAttendance = localStorage.getItem('attendance_records')
                if (!savedAttendance) {
                    const { mockAttendance } = await import('@/lib/mock-data')
                    localStorage.setItem('attendance_records', JSON.stringify(mockAttendance))
                }

                setPrograms(programsData)
            } catch (error) {
                console.error('데이터 로드 실패:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-transparent">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">참가자 관리</h1>
                                <p className="text-gray-600">프로그램별 참가자를 관리하고 기념품 수령을 체크하세요</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin/participants/upload">
                                <Button variant="outline" size="lg" className="h-12 px-6 bg-transparent">
                                    <Upload className="w-5 h-5 mr-2" />
                                    엑셀 업로드
                                </Button>
                            </Link>
                            <Link href="/admin/participants/new">
                                <Button size="lg" className="h-12 px-6">
                                    <Plus className="w-5 h-5 mr-2" />
                                    참가자 추가
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 프로그램별 참가자 목록 */}
                {programs && programs.length > 0 ? (
                    <div className="space-y-8">
                        {programs.map((program) => (
                            <Card key={program.id} className="shadow-lg">
                                <CardHeader>
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                                            <CardDescription className="text-base">
                                                총 {program.participants?.length || 0}명의 참가자
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link href={`/admin/programs/${program.id}/participants/new`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    참가자 추가
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/programs/${program.id}/participants/upload`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    엑셀 업로드
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {program.participants && program.participants.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {program.participants.map((participant) => (
                                                <Card key={participant.id} className="border-2 hover:shadow-md transition-all">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-lg mb-1">{participant.name}</h4>
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {participant.department || participant.email} · {participant.position || participant.phone}
                                                                </p>
                                                                <div className="flex flex-wrap gap-1 mb-3">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        출석 {participant.attendanceCount || 0}/{program.total_sessions}
                                                                    </Badge>
                                                                    {participant.gift_received ? (
                                                                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                                                            <Gift className="w-3 h-3 mr-1" />
                                                                            기념품 수령
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            <Gift className="w-3 h-3 mr-1" />
                                                                            미수령
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                {participant.gift_received ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                                ) : (
                                                                    <XCircle className="w-5 h-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link href={`/admin/participants/${participant.id}/edit`} className="flex-1">
                                                                <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-transparent">
                                                                    수정
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/admin/participants/${participant.id}/gift`} className="flex-1">
                                                                <Button
                                                                    variant={participant.gift_received ? "secondary" : "default"}
                                                                    size="sm"
                                                                    className="w-full h-8 text-xs"
                                                                >
                                                                    {participant.gift_received ? "수령완료" : "기념품"}
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-4">이 프로그램에 등록된 참가자가 없습니다</p>
                                            <Link href={`/admin/programs/${program.id}/participants/new`}>
                                                <Button size="sm">
                                                    <Plus className="w-4 h-4 mr-2" />첫 참가자 추가
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Users className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">프로그램이 없습니다</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">참가자를 관리하려면 먼저 프로그램을 생성해야 합니다</p>
                            <Link href="/admin/programs/new">
                                <Button size="lg" className="h-12 px-8">
                                    <Plus className="w-5 h-5 mr-2" />
                                    프로그램 생성하기
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}