"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Gift, Search, CheckCircle, XCircle, Users } from "lucide-react"

export default function GiftsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("programs")
      .select(`
        *,
        participants:participants(*)
      `)
      .order("created_at", { ascending: false })

    setPrograms(data || [])
  }

  const toggleGiftStatus = async (participantId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("participants")
        .update({ gift_received: !currentStatus })
        .eq("id", participantId)

      if (error) throw error

      // 데이터 새로고침
      await loadPrograms()
    } catch (error) {
      console.error("기념품 상태 업데이트 오류:", error)
      alert("기념품 상태 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 필터링
  const filteredPrograms = programs.map((program) => ({
    ...program,
    participants: program.participants?.filter(
      (p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  // 전체 통계
  const totalParticipants = programs.reduce((sum, program) => sum + (program.participants?.length || 0), 0)
  const giftReceived = programs.reduce(
    (sum, program) => sum + (program.participants?.filter((p: any) => p.gift_received).length || 0),
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">기념품 관리</h1>
                <p className="text-gray-600">참가자별 기념품 수령 현황을 관리하세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 참가자</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalParticipants}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">기념품 수령</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{giftReceived}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">미수령</CardTitle>
              <XCircle className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalParticipants - giftReceived}</div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="참가자 이름 또는 부서로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* 프로그램별 기념품 현황 */}
        <div className="space-y-8">
          {filteredPrograms.map((program) => {
            const participants = program.participants || []
            const receivedCount = participants.filter((p: any) => p.gift_received).length

            return (
              <Card key={program.id} className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                      <CardDescription className="text-base">
                        기념품 수령: {receivedCount}/{participants.length}명
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-sm">
                        <Gift className="w-3 h-3 mr-1" />
                        수령률 {participants.length > 0 ? Math.round((receivedCount / participants.length) * 100) : 0}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {participants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {participants.map((participant: any) => (
                        <Card
                          key={participant.id}
                          className={`border-2 transition-all ${
                            participant.gift_received
                              ? "border-green-200 bg-green-50"
                              : "border-orange-200 bg-orange-50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1">{participant.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {participant.department} · {participant.position}
                                </p>
                                <Badge
                                  variant={participant.gift_received ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {participant.gift_received ? "수령 완료" : "미수령"}
                                </Badge>
                              </div>
                              <div className="ml-3">
                                {participant.gift_received ? (
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-orange-500" />
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => toggleGiftStatus(participant.id, participant.gift_received)}
                              disabled={isLoading}
                              size="sm"
                              variant={participant.gift_received ? "outline" : "default"}
                              className="w-full h-9"
                            >
                              {participant.gift_received ? "수령 취소" : "수령 완료"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        {searchTerm ? "검색 결과가 없습니다" : "이 프로그램에 등록된 참가자가 없습니다"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {programs.length === 0 && (
          <Card className="text-center py-16 bg-white/90 backdrop-blur-sm">
            <CardContent>
              <Gift className="mx-auto w-20 h-20 text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">관리할 프로그램이 없습니다</h3>
              <p className="text-gray-600 mb-8">프로그램을 생성하고 참가자를 등록해주세요</p>
              <Link href="/admin/programs/new">
                <Button size="lg" className="h-12 px-8">
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
