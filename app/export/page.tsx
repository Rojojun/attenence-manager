"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, FileText, Users, Calendar } from "lucide-react"

// 타입 정의
interface Attendance {
    id: string
    date: string
    session: number
}

interface Participant {
    id: string
    name: string
    department?: string
    position?: string
    email?: string
    phone?: string
    gift_received?: boolean
    attendance: Attendance[]
}

interface Program {
    id: string
    name: string
    description: string
    total_sessions: number
    participants: Participant[]
    created_at?: string
}

export default function ExportPage() {
    const [programs, setPrograms] = useState<Program[]>([])
    const [selectedProgram, setSelectedProgram] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPrograms()
    }, [])

    const loadPrograms = () => {
        try {
            const savedPrograms = localStorage.getItem('attendance-programs')
            if (savedPrograms) {
                const parsedPrograms = JSON.parse(savedPrograms)
                setPrograms(parsedPrograms)
            }
        } catch (error) {
            console.error('프로그램 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportToExcel = async (programId?: string) => {
        setIsLoading(true)
        try {
            // ExcelJS 사용 (xlsx 대신 더 안전한 라이브러리)
            const ExcelJS = await import("exceljs")

            let exportData = programs
            if (programId) {
                exportData = programs.filter(p => p.id === programId)
            }

            if (!exportData || exportData.length === 0) {
                alert("출력할 데이터가 없습니다.")
                return
            }

            // 워크북 생성
            const workbook = new ExcelJS.Workbook()

            exportData.forEach((program) => {
                // 각 프로그램별로 시트 생성
                const worksheet = workbook.addWorksheet(program.name.substring(0, 30))

                // 헤더 추가
                const headers = [
                    "이름",
                    "부서",
                    "직급",
                    "이메일",
                    "전화번호",
                    "기념품 수령",
                    ...Array.from({ length: program.total_sessions }, (_, i) => `${i + 1}교시 출석`),
                    "총 출석",
                    "출석률",
                ]

                worksheet.addRow(headers)

                // 헤더 스타일링
                worksheet.getRow(1).font = { bold: true }
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE6F3FF' }
                }

                // 참가자 데이터 추가
                program.participants?.forEach((participant) => {
                    const attendanceBySession: { [key: number]: boolean } = {}
                    participant.attendance?.forEach((att) => {
                        attendanceBySession[att.session] = true
                    })

                    const totalAttended = participant.attendance?.length || 0
                    const attendanceRate = ((totalAttended / program.total_sessions) * 100).toFixed(1)

                    const row = [
                        participant.name,
                        participant.department || "",
                        participant.position || "",
                        participant.email || "",
                        participant.phone || "",
                        participant.gift_received ? "수령" : "미수령",
                        ...Array.from({ length: program.total_sessions }, (_, i) =>
                            attendanceBySession[i + 1] ? "출석" : "결석"
                        ),
                        totalAttended,
                        `${attendanceRate}%`,
                    ]
                    worksheet.addRow(row)
                })

                // 컬럼 너비 자동 조정
                worksheet.columns.forEach((column) => {
                    if (column && column.eachCell) {
                        let maxLength = 0
                        column.eachCell({ includeEmpty: true }, (cell) => {
                            const cellValue = cell.value ? cell.value.toString() : ''
                            if (cellValue.length > maxLength) {
                                maxLength = cellValue.length
                            }
                        })
                        column.width = Math.min(Math.max(maxLength + 2, 10), 50)
                    }
                })
            })

            // 파일 다운로드
            const fileName = programId
                ? `${exportData[0].name}_출석부_${new Date().toISOString().split("T")[0]}.xlsx`
                : `전체_출석부_${new Date().toISOString().split("T")[0]}.xlsx`

            const buffer = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            a.click()
            window.URL.revokeObjectURL(url)

        } catch (error) {
            console.error("엑셀 출력 오류:", error)
            alert("엑셀 출력 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const exportToPDF = async (programId?: string) => {
        setIsLoading(true)
        try {
            // 동적 import로 jsPDF 라이브러리 로드
            const { jsPDF } = await import("jspdf")

            let exportData = programs
            if (programId) {
                exportData = programs.filter(p => p.id === programId)
            }

            if (!exportData || exportData.length === 0) {
                alert("출력할 데이터가 없습니다.")
                return
            }

            const doc = new jsPDF()

            // 기본 폰트 설정
            doc.setFont("helvetica")

            let yPosition = 20

            exportData.forEach((program, programIndex) => {
                if (programIndex > 0) {
                    doc.addPage()
                    yPosition = 20
                }

                // 프로그램 제목
                doc.setFontSize(16)
                doc.text(program.name, 20, yPosition)
                yPosition += 10

                doc.setFontSize(12)
                doc.text(`Total Sessions: ${program.total_sessions}`, 20, yPosition)
                yPosition += 10

                doc.text(`Participants: ${program.participants?.length || 0}`, 20, yPosition)
                yPosition += 15

                // 참가자 목록
                doc.setFontSize(10)
                program.participants?.forEach((participant, index) => {
                    if (yPosition > 270) {
                        doc.addPage()
                        yPosition = 20
                    }

                    const totalAttended = participant.attendance?.length || 0
                    const attendanceRate = ((totalAttended / program.total_sessions) * 100).toFixed(1)

                    doc.text(`${index + 1}. ${participant.name}`, 20, yPosition)
                    doc.text(`${participant.department || ''} - ${participant.position || ''}`, 60, yPosition)
                    doc.text(`Attendance: ${totalAttended}/${program.total_sessions} (${attendanceRate}%)`, 120, yPosition)
                    doc.text(`Gift: ${participant.gift_received ? "Received" : "Not Received"}`, 170, yPosition)

                    yPosition += 7
                })

                yPosition += 10
            })

            // 파일 다운로드
            const fileName = programId
                ? `${exportData[0].name}_attendance_${new Date().toISOString().split("T")[0]}.pdf`
                : `all_attendance_${new Date().toISOString().split("T")[0]}.pdf`

            doc.save(fileName)
        } catch (error) {
            console.error("PDF 출력 오류:", error)
            alert("PDF 출력 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const selectedProgramData = programs.find((p) => p.id === selectedProgram)

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">데이터를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4 md:p-6">
            <div className="mx-auto max-w-4xl">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/reports">
                            <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-white/80">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">데이터 출력</h1>
                            <p className="text-gray-600">출석 데이터를 엑셀 또는 PDF 형식으로 출력하세요</p>
                        </div>
                    </div>
                </div>

                {/* 전체 출력 */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            전체 데이터 출력
                        </CardTitle>
                        <CardDescription>모든 프로그램의 출석 데이터를 한 번에 출력합니다</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button
                                onClick={() => exportToExcel()}
                                disabled={isLoading || programs.length === 0}
                                size="lg"
                                className="flex-1 h-12"
                            >
                                <FileSpreadsheet className="w-5 h-5 mr-2" />
                                {isLoading ? "출력 중..." : "엑셀로 출력"}
                            </Button>
                            <Button
                                onClick={() => exportToPDF()}
                                disabled={isLoading || programs.length === 0}
                                variant="outline"
                                size="lg"
                                className="flex-1 h-12 bg-transparent"
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                {isLoading ? "출력 중..." : "PDF로 출력"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 프로그램별 출력 */}
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            프로그램별 출력
                        </CardTitle>
                        <CardDescription>특정 프로그램의 출석 데이터만 출력합니다</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* 프로그램 선택 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">프로그램 선택</label>
                            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="출력할 프로그램을 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((program) => (
                                        <SelectItem key={program.id} value={program.id}>
                                            {program.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 선택된 프로그램 정보 */}
                        {selectedProgramData && (
                            <Card className="border-2 border-blue-200 bg-blue-50">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{selectedProgramData.name}</h4>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="outline">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {selectedProgramData.total_sessions}교시
                                        </Badge>
                                        <Badge variant="outline">
                                            <Users className="w-3 h-3 mr-1" />
                                            {selectedProgramData.participants?.length || 0}명
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{selectedProgramData.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* 출력 버튼 */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button
                                onClick={() => exportToExcel(selectedProgram)}
                                disabled={isLoading || !selectedProgram}
                                size="lg"
                                className="flex-1 h-12"
                            >
                                <FileSpreadsheet className="w-5 h-5 mr-2" />
                                {isLoading ? "출력 중..." : "엑셀로 출력"}
                            </Button>
                            <Button
                                onClick={() => exportToPDF(selectedProgram)}
                                disabled={isLoading || !selectedProgram}
                                variant="outline"
                                size="lg"
                                className="flex-1 h-12 bg-transparent"
                            >
                                <FileText className="w-5 h-5 mr-2" />
                                {isLoading ? "출력 중..." : "PDF로 출력"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {programs.length === 0 && (
                    <Card className="mt-8 text-center py-12 bg-white/90 backdrop-blur-sm">
                        <CardContent>
                            <FileSpreadsheet className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">출력할 데이터가 없습니다</h3>
                            <p className="text-gray-600 mb-6">프로그램을 생성하고 참가자를 등록해주세요</p>
                            <Link href="/admin">
                                <Button size="lg">관리자 대시보드로 이동</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}