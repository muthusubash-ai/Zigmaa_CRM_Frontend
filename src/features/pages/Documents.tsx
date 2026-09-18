import { useState } from 'react';
import { Upload, Search, Eye, Download, Trash2, FileText, FileSpreadsheet, File } from 'lucide-react';
import { documents as initialDocs } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';

const categories = ['All', 'Company Documents', 'Employee Documents', 'Project Documents', 'Invoices', 'Contracts', 'Reports', 'Other'];

const typeIcons: Record<string, React.ReactNode> = {
  PDF: <FileText size={16} className="text-red-500" />,
  DOCX: <FileText size={16} className="text-blue-500" />,
  XLSX: <FileSpreadsheet size={16} className="text-green-500" />,
};

function DocIcon({ type }: { type: string }) {
  return <span>{typeIcons[type] || <File size={16} className="text-slate-400" />}</span>;
}

export default function Documents() {
  const { toast } = useToast();
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) &&
      (category === 'All' || d.category === category)
    );
  });

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    toast('Document deleted.', 'warning');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-52">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="bg-transparent text-sm outline-none flex-1 text-slate-700 placeholder-slate-400" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => toast('Upload feature coming soon.', 'warning')} className="flex items-center gap-2 px-4 h-10 bg-[#ED0016] hover:bg-[#B80012] text-white text-sm font-medium rounded-xl transition-colors">
          <Upload size={15} /> Upload Document
        </button>
      </div>

      {/* Upload zone */}
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-white hover:border-blue-300 transition-colors cursor-pointer">
        <Upload size={28} className="text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">Drag & drop files here or <span className="text-[#ED0016]">browse</span></p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP — Max 50 MB</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No documents found" description="Upload your first document to get started." action={{ label: '+ Upload Document', onClick: () => toast('Upload feature coming soon.') }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['File Name', 'Category', 'Uploaded By', 'Date', 'Size', 'Access', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <DocIcon type={doc.type} />
                        <div>
                          <p className="text-sm font-medium text-slate-900 max-w-56 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{doc.category}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{doc.uploadedBy}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{doc.date}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{doc.size}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{doc.access}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-[#ED0016] transition-colors" title="Preview"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors" title="Download"><Download size={14} /></button>
                        <button onClick={() => setDeleteId(doc.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
            Showing {filtered.length} of {docs.length} documents
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
}
