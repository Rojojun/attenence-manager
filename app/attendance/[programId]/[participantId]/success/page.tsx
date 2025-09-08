import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Home, Users } from "lucide-react"

interface Props {
  params: Promise<{ programId: string; participantId: string }>
  searchParams: Promise<{ session?: string }>
}

export default async function AttendanceSuccessPage({ params, searchParams }: Props) {
  const { programId, participantId } = await params
  const { session } = await searchParams
  const supabase = await createClient()

  // 참가자와 프로그램 정보 조회
  const { data: participant } = await supabase.from("participants").select("*").eq("id", participantId).single()

  const { data: program } = await supabase.from("programs").select("*").eq("id", programId).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6 flex items-center justify-center">
      <div className="mx-auto max-w-2xl w-full">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl text-center">
          <CardContent className="p-12">
            {/* 성공 아이콘 */}
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            {/* 성공 메시지 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">출석 완료!</h1>
            <p className="text-lg text-gray-600 mb-8">
              {participant?.name}님의 {session}교시 출석이 성공적으로 기록되었습니다.
            </p>

            {/* 출석 정보 */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">프로그램</p>
                <p className="font-semibold text-gray-900">{program?.name}</p>
                <p className="text-sm text-gray-600 mt-4">참가자</p>
                <p className="font-semibold text-gray-900">{participant?.name}</p>
                <p className="text-sm text-gray-600 mt-4">출석 교시</p>
                <p className="font-semibold text-gray-900">{session}교시</p>
                <p className="text-sm text-gray-600 mt-4">출석 시간</p>
                <p className="font-semibold text-gray-900">{new Date().toLocaleString("ko-KR")}</p>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col md:flex-row gap-4">
              <Link href={`/attendance/${programId}/${participantId}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full h-12 bg-transparent">
                  <Users className="w-5 h-5 mr-2" />
                  다른 교시 출석
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button size="lg" className="w-full h-12">
                  <Home className="w-5 h-5 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
