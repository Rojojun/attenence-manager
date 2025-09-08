import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, CheckCircle, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import { mockPrograms, mockParticipants, getStoredAttendance } from "@/lib/mock-data"

interface Props {
    params: Promise<{ programId: string }>
}

export default async function ProgramAttendancePage({ params }: Props) {
    const { programId } = await params

    const program = mockPrograms.find((p) => p.id === programId)

    if (!program) {
        notFound()
    }

    const participants = mockParticipants
        .filter((p) => p.program_id === programId)
        .map((participant) => {
            const attendanceRecords = getStoredAttendance().filter(
                (a) => a.participant_id === participant.id && a.program_id === programId,
            )
            return {
                ...participant,
                attendance: attendanceRecords,
            }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6">
            <div className="mx-auto max-w-5xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/attendance">
                            <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.name}</h1>
                            <p className="text-lg text-gray-700">출석할 참가자를 선택해주세요</p>
                        </div>
                    </div>

                    {/* 프로그램 정보 */}
                    <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-3 justify-center">
                                <Badge variant="secondary" className="text-base px-4 py-2">
                                    총 {program.total_sessions}교시
                                </Badge>
                                <Badge variant="secondary" className="text-base px-4 py-2">
                                    참가자 {participants?.length || 0}명
                                </Badge>
                                {program.start_date && (
                                    <Badge variant="outline" className="text-base px-4 py-2">
                                        {new Date(program.start_date).toLocaleDateString("ko-KR")}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 참가자 목록 */}
                {participants && participants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participants.map((participant) => {
                            const attendedSessions = participant.attendance?.length || 0
                            const attendanceRate = (attendedSessions / program.total_sessions) * 100

                            return (
                                <Link key={participant.id} href={`/attendance/${programId}/${participant.id}`}>
                                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-300 bg-white/90 backdrop-blur-sm h-full">
                                        <CardHeader className="text-center pb-4">
                                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                                                <User className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <CardTitle className="text-xl mb-2">{participant.name}</CardTitle>
                                            <CardDescription className="text-base mb-3">{participant.email}</CardDescription>

                                            {/* 출석 현황 */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    {attendanceRate === 100 ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <Clock className="w-5 h-5 text-orange-500" />
                                                    )}
                                                    <span className="text-sm font-medium">
                            출석 {attendedSessions}/{program.total_sessions}
                          </span>
                                                </div>

                                                {/* 출석률 바 */}
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            attendanceRate === 100
                                                                ? "bg-green-500"
                                                                : attendanceRate >= 50
                                                                    ? "bg-blue-500"
                                                                    : "bg-orange-500"
                                                        }`}
                                                        style={{ width: `${attendanceRate}%` }}
                                                    />
                                                </div>

                                                <Badge variant={attendanceRate === 100 ? "default" : "secondary"} className="text-sm">
                                                    {attendanceRate === 100 ? "완료" : `${Math.round(attendanceRate)}%`}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="text-center py-16 bg-white/90 backdrop-blur-sm">
                        <CardContent>
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <User className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">등록된 참가자가 없습니다</h3>
                            <p className="text-gray-600 mb-8">관리자에게 문의하여 참가자를 등록해주세요</p>
                            <Link href="/attendance">
                                <Button size="lg" className="h-12 px-8">
                                    프로그램 목록으로
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
