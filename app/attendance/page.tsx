import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Calendar, CheckSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockPrograms, mockParticipants } from "@/lib/mock-data"

export default function AttendancePage() {
  const programs = mockPrograms.map((program) => ({
    ...program,
    participantCount: mockParticipants.filter((p) => p.program_id === program.id).length,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">출석 체크</h1>
              <p className="text-lg text-gray-700">참가할 프로그램을 선택해주세요</p>
            </div>
          </div>
        </div>

        {/* 프로그램 선택 */}
        {programs && programs.length > 0 ? (
          <div className="space-y-4">
            {programs.map((program) => (
              <Link key={program.id} href={`/attendance/${program.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 text-gray-900">{program.name}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 mb-4">{program.description}</CardDescription>
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="secondary" className="text-base px-4 py-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            {program.total_sessions}교시
                          </Badge>
                          <Badge variant="secondary" className="text-base px-4 py-2">
                            <Users className="w-4 h-4 mr-2" />
                            {program.participantCount}명 참가
                          </Badge>
                          {program.start_date && (
                            <Badge variant="outline" className="text-base px-4 py-2">
                              {new Date(program.start_date).toLocaleDateString("ko-KR")}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckSquare className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-white/90 backdrop-blur-sm">
            <CardContent>
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">진행 중인 프로그램이 없습니다</h3>
              <p className="text-gray-600 mb-8">관리자에게 문의하여 프로그램을 확인해주세요</p>
              <Link href="/">
                <Button size="lg" className="h-12 px-8">
                  홈으로 돌아가기
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
