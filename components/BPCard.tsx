
import React from 'react';
import { BPCenter } from '../types';

interface BPCardProps {
  center: BPCenter;
  index: number;
}

const BPCard: React.FC<BPCardProps> = ({ center, index }) => {
  return (
    <div 
      className="card-animate bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider mb-2">
            N-Telecom BP
          </span>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {center.name}
          </h3>
        </div>
        <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-slate-400 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-sm text-slate-600 leading-snug">{center.address}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-slate-400 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <a href={`tel:${center.phone}`} className="text-sm font-semibold text-slate-700 hover:text-indigo-600">
            {center.phone}
          </a>
        </div>

        {center.fax && center.fax !== '-' && (
          <div className="flex items-center gap-3">
            <div className="text-slate-400 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500">FAX: {center.fax}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(center.address)}`, '_blank')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          네이버 지도
        </button>
        <button 
          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.address)}`, '_blank')}
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          구글 지도
        </button>
      </div>
    </div>
  );
};

export default BPCard;
