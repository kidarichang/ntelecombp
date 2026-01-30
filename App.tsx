
import React, { useState, useMemo, useEffect } from 'react';
import { BP_CENTERS_DATA } from './constants';
import BPCard from './components/BPCard';
import { searchExternalBP } from './services/geminiService';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [externalResults, setExternalResults] = useState<{ ids: number[]; reason: string } | null>(null);

  // 로컬 필터링: 입력값이 이름이나 주소에 포함된 모든 항목을 실시간으로 보여줌
  const filteredCenters = useMemo(() => {
    const rawInput = searchTerm.trim().toLowerCase();
    if (!rawInput) return BP_CENTERS_DATA;

    const lowerTerm = rawInput.replace(/\s/g, '');
    
    // 1차: 단순 포함 검색
    let results = BP_CENTERS_DATA.filter(center => {
      const combined = (center.name + center.address).toLowerCase().replace(/\s/g, '');
      return combined.includes(lowerTerm);
    });

    // 2차: 검색어가 여러 단어일 경우 각 단어가 모두 포함된 항목 검색
    if (results.length === 0) {
      const tokens = rawInput.split(/\s+/).filter(t => t.length > 0);
      if (tokens.length > 1) {
        results = BP_CENTERS_DATA.filter(center => {
          const combined = (center.name + center.address).toLowerCase();
          return tokens.every(token => combined.includes(token));
        });
      }
    }

    return results;
  }, [searchTerm]);

  // 검색어가 변경될 때마다 외부 결과 초기화
  useEffect(() => {
    setExternalResults(null);
  }, [searchTerm]);

  const handleExternalSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setExternalResults(null);
    try {
      const result = await searchExternalBP(searchTerm, BP_CENTERS_DATA);
      setExternalResults(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setExternalResults(null);
  };

  const aiRecommendedCenters = useMemo(() => {
    if (!externalResults) return [];
    return externalResults.ids
      .map(id => BP_CENTERS_DATA.find(c => c.id === id))
      .filter((c): c is typeof BP_CENTERS_DATA[0] => c !== undefined);
  }, [externalResults]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <header className="glass-header sticky top-0 z-50 border-b border-slate-200/50 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-200 flex items-center justify-center text-white transform hover:rotate-6 transition-transform cursor-pointer">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">N-Telecom</h1>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.4em] mt-2">Smart BP Locator</p>
            </div>
          </div>

          <div className="w-full max-w-3xl relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-16 pr-16 py-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all text-xl text-slate-800 placeholder-slate-300 font-medium"
              placeholder="전국 시, 군, 구, 동을 입력하세요 (예: 봉래동, 둔산동)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExternalSearch()}
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-indigo-500 transition-colors"
              >
                <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && filteredCenters.length === 0 && !isLoading && !externalResults && (
             <p className="mt-4 text-slate-400 text-sm animate-pulse">엔터를 누르거나 아래 버튼을 클릭하여 지능형 검색을 실행하세요.</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Local Results Section */}
        {filteredCenters.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              <h2 className="text-xl font-bold text-slate-800">지점 리스트 ({filteredCenters.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCenters.map((center, index) => (
                <BPCard key={center.id} center={center} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Not Found State & Trigger */}
        {filteredCenters.length === 0 && !externalResults && (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-[3rem] bg-white shadow-2xl shadow-slate-200/60 text-slate-100 mb-12 border border-slate-50">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">"{searchTerm}"의 직접 검색 결과가 없습니다</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-12 text-lg leading-relaxed font-medium">
              입력하신 <span className="text-indigo-600 font-bold">"{searchTerm}"</span> 지역의 행정구역을 분석하여<br/>
              가까운 모든 BP센터를 찾아드릴까요?
            </p>
            <button
              onClick={handleExternalSearch}
              disabled={isLoading}
              className={`group inline-flex items-center px-14 py-6 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-3xl shadow-2xl shadow-slate-300 transition-all active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  전국 지리 분석 중...
                </>
              ) : (
                <>
                  전국 지능형 검색 실행
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* AI Analysis Results */}
        {externalResults && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-indigo-50/50 rounded-[3rem] border border-indigo-100/60 p-10 md:p-16 shadow-inner relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                  </span>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">AI Geographic Analysis</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                  "{searchTerm}" 지역 지능형 분석 결과
                </h3>
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 shadow-sm inline-block max-w-3xl">
                  <p className="text-slate-700 font-semibold leading-relaxed text-lg italic">
                    " {externalResults.reason} "
                  </p>
                </div>
              </div>

              {aiRecommendedCenters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                  {aiRecommendedCenters.map((center, index) => (
                    <BPCard key={center.id} center={center} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/40 rounded-[2rem] border border-dashed border-indigo-200">
                  <p className="text-slate-400 font-bold">인접한 유효 센터를 찾지 못했습니다.</p>
                </div>
              )}
              
              <div className="mt-16 text-center relative z-10">
                 <button 
                  onClick={handleClear}
                  className="bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 px-8 py-3 rounded-full text-sm font-bold shadow-sm border border-slate-100 transition-all flex items-center gap-2 mx-auto"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                   다른 지역 검색하기
                 </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-20 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 opacity-30 mb-8">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white font-black text-xs">N</div>
            <span className="text-sm font-black tracking-[0.4em] text-white uppercase">BP Locator</span>
          </div>
          <p className="text-slate-500 text-center text-xs opacity-60 leading-loose max-w-lg mb-12">
            본 서비스는 전국 앤텔레콤 BP센터 데이터를 바탕으로 제공되며,<br/>
            지능형 위치 매칭 기술을 통해 사용자에게 가장 적합한 방문 지점을 제안합니다.
          </p>
          <div className="h-px w-20 bg-slate-800 mb-8"></div>
          <p className="text-[10px] font-bold opacity-30 tracking-[0.2em] text-slate-500 uppercase">© 2024 N-Telecom. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
