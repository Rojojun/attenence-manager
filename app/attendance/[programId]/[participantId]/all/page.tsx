import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, CheckCircle, Pen } from "lucide-react"
import { notFound } from "next/navigation"
import { mockData } from "@/lib/mock-data"
import SignatureCanvas from "./signature-canvas"

interface Props {
  params: Promise<{ programId: string; participantId: string }>
}

export default async function AllSessionsSignaturePage({ params }: Props) {
  const { programId, participantId } = await params

  const program = mockData.programs.find((p) => p.id === programId)
  const participant = mockData.participants.find((p) => p.id === participantId)

  if (!program || !participant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 교시 출석</h1>
              <p className="text-lg text-gray-700">모든 교시에 한 번에 출석하기</p>
            </div>
          </div>

          {/* 참가자 및 프로그램 정보 */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{participant.name}</h3>
                  <p className="text-gray-600">
                      {participant.name}
                    {/*{participant.department} · {participant.position}*/}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 font-medium">총 {program.total_sessions}교시 전체 출석</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 서명 영역 */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Pen className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">서명해주세요</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              아래 영역에 서명하시면 모든 교시 출석이 완료됩니다
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <SignatureCanvas
              programId={programId}
              participantId={participantId}
              totalSessions={program.total_sessions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
