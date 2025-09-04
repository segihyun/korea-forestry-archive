'use client'

import React, { useState } from 'react'
import { Upload, FileText, Search, Calendar } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: string
  uploadDate: string
  publishDate: string
}

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [publishDate, setPublishDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // 파일 드래그 핸들러
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // 파일 드롭 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  // 파일 처리 함수
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
        
        // 성공 알림
        setTimeout(() => {
          alert(`✅ "${file.name}" 업로드 완료!`)
        }, 500)
      } else {
        alert('PDF 파일만 업로드 가능합니다.')
      }
    })
  }

  // 파일 삭제
  const deleteFile = (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setUploadedFiles(prev => prev.filter(file => file.id !== id))
    }
  }

  // 검색 필터링
  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.publishDate.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 헤더 */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🌲 한국임업신문 아카이브
          </h1>
          <p className="text-lg text-green-600">
            구독자를 위한 과거 신문 검색 서비스
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 업로드 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload className="mr-3 text-green-600" />
              신문 업로드
            </h2>

            {/* 발행일 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발행일
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                💡 발행일이 신문 제목이 됩니다
              </p>
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
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
              <p className="text-gray-500 mb-4">또는 클릭하여 파일 선택</p>
              
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
              >
                파일 선택
              </label>
            </div>
          </div>

          {/* 아카이브 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-3 text-green-600" />
              보관된 신문
            </h2>

            {/* 검색창 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="날짜나 파일명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 파일 목록 */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">
                    {uploadedFiles.length === 0 
                      ? '아직 업로드된 신문이 없습니다'
                      : '검색 결과가 없습니다'
                    }
                  </p>
                  {uploadedFiles.length === 0 && (
                    <p className="text-sm mt-2">왼쪽에서 PDF 파일을 업로드해보세요</p>
                  )}
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {file.publishDate} 한국임업신문
                      </div>
                      <div className="text-sm text-gray-600">
                        {file.name} • {file.size} • {file.uploadDate} 업로드
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                        보기
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 통계 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  총 <span className="font-semibold text-green-600">{uploadedFiles.length}</span>개 신문 보관 중
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-gray-500">
          <p>🌲 한국임업신문 아카이브 시스템 v1.0</p>
          <p className="text-sm mt-1">PDF 업로드 및 검색 기능 완료!</p>
        </footer>
      </div>
    </div>
  )
}