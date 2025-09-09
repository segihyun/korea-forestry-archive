'use client'

import React, { useState } from 'react'
import { Upload, FileText, Trash2, Lock } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: string
  uploadDate: string
  publishDate: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [publishDate, setPublishDate] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // 관리자 인증
  const handleLogin = () => {
    if (password === 'forestry2024') {  // 비밀번호 설정
      setIsAuthenticated(true)
      alert('✅ 관리자 로그인 성공!')
    } else {
      alert('❌ 비밀번호가 틀렸습니다.')
    }
  }

  // 로그아웃
  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword('')
  }

  // 파일 드래그 핸들러들 (기존과 동일)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    if (!publishDate) {
      alert('발행일을 먼저 선택해주세요!')
      return
    }

    files.forEach(file => {
      if (file.type === 'application/pdf') {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
          uploadDate: new Date().toLocaleDateString('ko-KR'),
          publishDate: publishDate
        }
        setUploadedFiles(prev => [...prev, newFile])
        alert(`✅ "${file.name}" 업로드 완료!`)
      } else {
        alert('PDF 파일만 업로드 가능합니다.')
      }
    })
  }

  const deleteFile = (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id))
    }
  }

  // 인증되지 않은 경우 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">관리자 로그인</h1>
            <p className="text-gray-600">한국임업신문 아카이브 관리</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              로그인
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← 일반 사용자 페이지로 돌아가기
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 인증된 경우 관리자 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 관리자 헤더 */}
        <header className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-red-800">
                🔧 관리자 페이지
              </h1>
              <p className="text-red-600">한국임업신문 아카이브 관리 시스템</p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-blue-600 hover:text-blue-800">
                일반 페이지 보기
              </a>
              <button
                onClick={handleLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 업로드 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload className="mr-3 text-red-600" />
              신문 업로드
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발행일
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                PDF 파일을 여기로 끌어오세요
              </h3>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="admin-file-input"
              />
              <label
                htmlFor="admin-file-input"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
              >
                파일 선택
              </label>
            </div>
          </div>

          {/* 파일 관리 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-3 text-red-600" />
              파일 관리
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>업로드된 파일이 없습니다</p>
                </div>
              ) : (
                uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {file.publishDate} 한국임업신문
                      </div>
                      <div className="text-sm text-gray-600">
                        {file.name} • {file.size}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  총 <span className="font-semibold text-red-600">{uploadedFiles.length}</span>개 파일 관리 중
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}