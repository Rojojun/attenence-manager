"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Save, Calendar } from "lucide-react"

export default function NewProgramPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    total_sessions: 1,
    start_date: "",
    end_date: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

      router.push("/admin/programs")
    } catch (error) {
      console.error("프로그램 생성 오류:", error)
      alert("프로그램 생성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total_sessions" ? Number.parseInt(value) || 1 : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/programs">
              <Button variant="outline" size="lg" className="h-12 w-12 p-0 bg-transparent">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">새 프로그램 생성</h1>
              <p className="text-gray-600">새로운 교육 프로그램을 생성하세요</p>
            </div>
          </div>
        </div>

        {/* 폼 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              프로그램 정보
            </CardTitle>
            <CardDescription>프로그램의 기본 정보를 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  프로그램명 *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="예: 웹 개발 기초 과정"
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  프로그램 설명
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="프로그램에 대한 간단한 설명을 입력하세요"
                  rows={4}
                  className="text-base resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_sessions" className="text-base font-medium">
                  총 교시 수 *
                </Label>
                <Input
                  id="total_sessions"
                  name="total_sessions"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.total_sessions}
                  onChange={handleChange}
                  required
                  className="h-12 text-base"
                />
                <p className="text-sm text-gray-500">참가자가 출석해야 하는 총 교시 수입니다</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-base font-medium">
                    시작일
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date" className="text-base font-medium">
                    종료일
                  </Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Link href="/admin/programs" className="flex-1">
                  <Button type="button" variant="outline" size="lg" className="w-full h-12 bg-transparent">
                    취소
                  </Button>
                </Link>
                <Button type="submit" size="lg" className="flex-1 h-12" disabled={isLoading}>
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? "생성 중..." : "프로그램 생성"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
