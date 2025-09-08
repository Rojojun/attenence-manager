"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Users, AlertTriangle, CheckCircle, Calendar, FileSpreadsheet, Download } from "lucide-react"
import { useEffect, useState } from "react"

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
    attendance: Attendance[]
}

interface Program {
    id: string
    name: string
    description: string
    total_sessions: number
    participants: Participant[]
}

export default function ReportsPage() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [loading, setLoading] = useState(true)

    // 로컬 스토리지에서 데이터 불러오기
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

    // 로딩 상태
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    // 전체 통계 계산
    const totalPrograms = programs?.length || 0
    const totalParticipants = programs?.reduce((sum, program) => sum + (program.participants?.length || 0), 0) || 0
    const totalAttendance =
        programs?.reduce(
            (sum, program) => sum + (program.participants?.reduce((pSum, p) => pSum + (p.attendance?.length || 0), 0) || 0),
            0,
        ) || 0

    // 미출석자 계산
    const incompleteAttendees =
        programs?.reduce((acc, program) => {
            const incomplete = program.participants?.filter((p) => (p.attendance?.length || 0) < program.total_sessions) || []
            return acc.concat(
                incomplete.map((p) => ({
                    ...p,
                    programName: program.name,
                    attendedSessions: p.attendance?.length || 0,
                    totalSessions: program.total_sessions,
                })),
            )
        }, [] as any[]) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">출석 현황 분석</h1>
                                <p className="text-gray-600">프로그램별 출석 현황과 미출석자를 확인하세요</p>
                            </div>
                        </div>
                        <Link href="/export">
                            <Button size="lg" className="h-12 px-6">
                                <Download className="w-5 h-5 mr-2" />
                                데이터 출력
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* 전체 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">총 프로그램</CardTitle>
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{totalPrograms}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">총 참가자</CardTitle>
                            <Users className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{totalParticipants}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">총 출석</CardTitle>
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{totalAttendance}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">미완료자</CardTitle>
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{incompleteAttendees.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* 미출석자 목록 */}
                {incompleteAttendees.length > 0 && (
                    <Card className="mb-8 bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-800">
                                <AlertTriangle className="w-5 h-5" />
                                미완료 출석자 ({incompleteAttendees.length}명)
                            </CardTitle>
                            <CardDescription>1회 이상 출석하지 않은 참가자 목록입니다</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {incompleteAttendees.map((participant) => (
                                    <Card key={`${participant.id}-${participant.programName}`} className="border-2 border-orange-100">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{participant.name}</h4>
                                                    <p className="text-sm text-gray-600">{participant.department}</p>
                                                </div>
                                                <Badge variant="destructive" className="text-xs">
                                                    미완료
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{participant.programName}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-orange-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${(participant.attendedSessions / participant.totalSessions) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600">
                          {participant.attendedSessions}/{participant.totalSessions}
                        </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 프로그램별 출석 현황 */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">프로그램별 출석 현황</h2>

                    {programs && programs.length > 0 ? (
                        <div className="space-y-6">
                            {programs.map((program) => {
                                const participants = program.participants || []
                                const totalSessions = program.total_sessions
                                const completedParticipants = participants.filter(
                                    (p) => (p.attendance?.length || 0) >= totalSessions,
                                ).length
                                const completionRate = participants.length > 0 ? (completedParticipants / participants.length) * 100 : 0

                                return (
                                    <Card key={program.id} className="bg-white/90 backdrop-blur-sm">
                                        <CardHeader>
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                                                    <CardDescription className="text-base">{program.description}</CardDescription>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-sm">
                                                        {totalSessions}교시
                                                    </Badge>
                                                    <Badge variant="outline" className="text-sm">
                                                        참가자 {participants.length}명
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            completionRate >= 80 ? "default" : completionRate >= 50 ? "secondary" : "destructive"
                                                        }
                                                        className="text-sm"
                                                    >
                                                        완료율 {Math.round(completionRate)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {participants.length > 0 ? (
                                                <div className="space-y-4">
                                                    {/* 완료율 바 */}
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span>출석 완료율</span>
                                                            <span>{Math.round(completionRate)}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className={`h-3 rounded-full transition-all duration-300 ${
                                                                    completionRate >= 80
                                                                        ? "bg-green-500"
                                                                        : completionRate >= 50
                                                                            ? "bg-blue-500"
                                                                            : "bg-red-500"
                                                                }`}
                                                                style={{ width: `${completionRate}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* 참가자 목록 */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {participants.map((participant) => {
                                                            const attendedSessions = participant.attendance?.length || 0
                                                            const isComplete = attendedSessions >= totalSessions

                                                            return (
                                                                <div
                                                                    key={participant.id}
                                                                    className={`p-3 rounded-lg border-2 ${
                                                                        isComplete ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="font-medium text-sm">{participant.name}</span>
                                                                        {isComplete ? (
                                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                                        ) : (
                                                                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                                            <div
                                                                                className={`h-1.5 rounded-full ${
                                                                                    isComplete ? "bg-green-500" : "bg-orange-500"
                                                                                }`}
                                                                                style={{ width: `${(attendedSessions / totalSessions) * 100}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs text-gray-600">
                                      {attendedSessions}/{totalSessions}
                                    </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">등록된 참가자가 없습니다</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <Card className="text-center py-16 bg-white/90 backdrop-blur-sm">
                            <CardContent>
                                <FileSpreadsheet className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">분석할 데이터가 없습니다</h3>
                                <p className="text-gray-600">프로그램을 생성하고 참가자를 등록해주세요</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}