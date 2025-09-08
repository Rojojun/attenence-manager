import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Calendar, Users, Edit, ArrowLeft } from "lucide-react"

export default async function ProgramsPage() {
  const supabase = await createClient()

  const { data: programs } = await supabase
    .from("programs")
    .select(`
      *,
      participants:participants(count),
      attendance:attendance(count)
    `)
    .order("created_at", { ascending: false })

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
                          참가자 {program.participants?.[0]?.count || 0}명
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          출석 {program.attendance?.[0]?.count || 0}회
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
