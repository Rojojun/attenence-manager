"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Users, Calendar, Settings, FileSpreadsheet, Gift } from "lucide-react"
import { useState, useEffect } from "react"

// 타입 정의
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
}

export default function AdminPage() {
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
                    const { mockPrograms, mockParticipants } = await import('@/lib/mock-data')
                    programsData = mockPrograms.map(program => ({
                        ...program,
                        participants: mockParticipants.filter(p => p.program_id === program.id),
                        participantCount: mockParticipants.filter(p => p.program_id === program.id).length
                    }))
                    localStorage.setItem('attendance-programs', JSON.stringify(programsData))
                }

                // 참가자 수 계산 (저장된 데이터에 participantCount가 없는 경우)
                programsData = programsData.map(program => ({
                    ...program,
                    participantCount: program.participants?.length || 0
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
            <div className="mx-auto max-w-7xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
                            <p className="text-gray-600">프로그램과 참가자를 관리하고 출석 현황을 확인하세요</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/">
                                <Button variant="outline" size="lg" className="h-12 px-6 bg-transparent">
                                    홈으로
                                </Button>
                            </Link>
                            <Link href="/admin/programs/new">
                                <Button size="lg" className="h-12 px-6">
                                    <Plus className="w-5 h-5 mr-2" />새 프로그램
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 빠른 액션 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link href="/admin/programs">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-200">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg">프로그램 관리</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/admin/participants">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-200">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-lg">참가자 관리</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/admin/gifts">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                    <Gift className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-lg">기념품 관리</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/reports">
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-orange-200">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                                    <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-lg">출석 현황</CardTitle>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>

                {/* 프로그램 목록 */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">운영 중인 프로그램</h2>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            총 {programs?.length || 0}개
                        </Badge>
                    </div>

                    {programs && programs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {programs.map((program) => (
                                <Card key={program.id} className="hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                                                <CardDescription className="text-base mb-3">{program.description}</CardDescription>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <Badge variant="outline" className="text-sm">
                                                        {program.total_sessions}교시
                                                    </Badge>
                                                    <Badge variant="outline" className="text-sm">
                                                        참가자 {program.participantCount || 0}명
                                                    </Badge>
                                                    {program.start_date && (
                                                        <Badge variant="outline" className="text-sm">
                                                            {new Date(program.start_date).toLocaleDateString("ko-KR")}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-3">
                                            <Link href={`/admin/programs/${program.id}`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    관리
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/programs/${program.id}/participants`}>
                                                <Button variant="outline" size="sm" className="h-10 px-4 bg-transparent">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    참가자
                                                </Button>
                                            </Link>
                                            <Link href={`/attendance?program=${program.id}`}>
                                                <Button size="sm" className="h-10 px-4">
                                                    출석 체크
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="text-center py-12">
                            <CardContent>
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">프로그램이 없습니다</h3>
                                <p className="text-gray-600 mb-6">첫 번째 교육 프로그램을 생성해보세요</p>
                                <Link href="/admin/programs/new">
                                    <Button size="lg" className="h-12 px-8">
                                        <Plus className="w-5 h-5 mr-2" />
                                        프로그램 생성
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}