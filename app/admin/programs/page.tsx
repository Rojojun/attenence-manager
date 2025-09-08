"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Calendar, Users, Edit, ArrowLeft } from "lucide-react"
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
    participantCount?: number
    attendanceCount?: number
}

export default function ProgramsPage() {
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
                        participants: mockParticipants.filter(p => p.program_id === program.id)
                    }))
                    localStorage.setItem('attendance-programs', JSON.stringify(programsData))
                    // 출석 기록도 저장
                    localStorage.setItem('attendance_records', JSON.stringify(mockAttendance))
                }

                // 출석 기록 불러오기
                const savedAttendance = localStorage.getItem('attendance_records')
                const attendanceData: AttendanceRecord[] = savedAttendance ? JSON.parse(savedAttendance) : []

                // 참가자 수와 출석 횟수 계산
                programsData = programsData.map(program => ({
                    ...program,
                    participantCount: program.participants?.length || 0,
                    attendanceCount: attendanceData.filter(a => a.program_id === program.id).length
                }))

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
            <div className="mx-auto max-w-6xl">
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
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">프로그램 관리</h1>
                                <p className="text-gray-600">교육 프로그램을 생성하고 관리하세요</p>
                            </div>
                        </div>
                        <Link href="/admin/programs/new">
                            <Button size="lg" className="h-12 px-6">
                                <Plus className="w-5 h-5 mr-2" />새 프로그램
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 프로그램 목록 */}
                {programs && programs.length > 0 ? (
                    <div className="space-y-4">
                        {programs.map((program) => (
                            <Card key={program.id} className="hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                                            <CardDescription className="text-base mb-3">{program.description}</CardDescription>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline" className="text-sm">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {program.total_sessions}교시
                                                </Badge>
                                                <Badge variant="outline" className="text-sm">
                                                    <Users className="w-3 h-3 mr-1" />
                                                    참가자 {program.participantCount || 0}명
                                                </Badge>
                                                <Badge variant="outline" className="text-sm">
                                                    출석 {program.attendanceCount || 0}회
                                                </Badge>
                                                {program.start_date && (
                                                    <Badge variant="secondary" className="text-sm">
                                                        {new Date(program.start_date).toLocaleDateString("ko-KR")} ~{" "}
                                                        {program.end_date ? new Date(program.end_date).toLocaleDateString("ko-KR") : ""}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <Link href={`/admin/programs/${program.id}/edit`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    수정
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/programs/${program.id}/participants`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    참가자 관리
                                                </Button>
                                            </Link>
                                            <Link href={`/attendance?program=${program.id}`}>
                                                <Button size="sm" className="h-10 px-4">
                                                    출석 체크
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Calendar className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">프로그램이 없습니다</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                첫 번째 교육 프로그램을 생성하여 참가자 관리와 출석 체크를 시작해보세요
                            </p>
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