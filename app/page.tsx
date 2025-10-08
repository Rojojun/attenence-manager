'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, Calendar, CheckSquare, FileSpreadsheet } from "lucide-react"
import { useEffect, useState } from "react"
import { programsService, participantsService } from "@/lib/services"

export default function HomePage() {
  const [programCount, setProgramCount] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)
  const [todayAttendanceCount, setTodayAttendanceCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // 프로그램 목록 조회
        const programsResponse = await programsService.getAll({ page: 1, limit: 100 })
        if (programsResponse.success && programsResponse.data) {
          setProgramCount(programsResponse.meta?.total || programsResponse.data.length)
        }

        // 참가자 목록 조회
        const participantsResponse = await participantsService.getAll({ page: 1, limit: 100 })
        if (participantsResponse.success && participantsResponse.data) {
          setParticipantCount(participantsResponse.meta?.total || participantsResponse.data.length)
        }

        // 오늘 출석 수는 임시로 0으로 설정 (추후 API 추가 가능)
        setTodayAttendanceCount(0)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">출석 관리 시스템</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            태블릿 최적화된 직관적인 출석 관리로 교육 프로그램을 효율적으로 운영하세요
          </p>
          {loading && (
            <div className="mt-4 text-sm text-blue-600">데이터 로딩 중...</div>
          )}
          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
          )}
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 프로그램</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{programCount}</div>
              <p className="text-xs text-gray-500 mt-1">운영 중인 교육 프로그램</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 참가자</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{participantCount}</div>
              <p className="text-xs text-gray-500 mt-1">등록된 참가자 수</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">오늘 출석</CardTitle>
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{todayAttendanceCount}</div>
              <p className="text-xs text-gray-500 mt-1">오늘 출석한 참가자</p>
            </CardContent>
          </Card>
        </div>

        {/* 메인 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin" className="group">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">관리자 대시보드</CardTitle>
                <CardDescription className="text-gray-600">프로그램 및 참가자 관리</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/attendance" className="group">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">출석 체크</CardTitle>
                <CardDescription className="text-gray-600">참가자 출석 및 서명</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/reports" className="group">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileSpreadsheet className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">출석 현황</CardTitle>
                <CardDescription className="text-gray-600">출석 분석 및 보고서</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/export" className="group">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <FileSpreadsheet className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">데이터 출력</CardTitle>
                <CardDescription className="text-gray-600">엑셀 및 PDF 출력</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* 푸터 */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>태블릿 최적화 출석 관리 시스템 v1.0</p>
        </div>
      </div>
    </div>
  )
}
