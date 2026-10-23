'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Loader2,
  Phone,
  User,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface CustomForm {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  submitButtonText: string;
  successMessage: string;
  notifyPhone?: string | null;
  isActive: boolean;
  submissionsCount?: number;
  fields: FormField[];
}

interface FormSubmission {
  id: string;
  formId: string;
  userPhone?: string | null;
  userName?: string | null;
  data: Record<string, any>;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

interface CustomFormManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function CustomFormManagerModal({
  isOpen,
  onClose,
  projectId,
}: CustomFormManagerModalProps) {
  const [activeTab, setActiveTab] = useState<'forms' | 'editor' | 'submissions'>('forms');
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  // Editor State
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [editingSubmitBtn, setEditingSubmitBtn] = useState('ثبت و ارسال اطلاعات');
  const [editingSuccessMsg, setEditingSuccessMsg] = useState('اطلاعات شما با موفقیت ثبت شد.');
  const [editingFields, setEditingFields] = useState<FormField[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchForms();
    }
  }, [isOpen, projectId]);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/forms`);
      const data = await res.json();
      if (data.success) {
        setForms(data.forms || []);
        if (data.forms?.length > 0 && !selectedForm) {
          setSelectedForm(data.forms[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (formId: string) => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}/forms/${formId}/submissions`
      );
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const openEditor = (form?: CustomForm) => {
    if (form) {
      setSelectedForm(form);
      setEditingTitle(form.title);
      setEditingDesc(form.description || '');
      setEditingSubmitBtn(form.submitButtonText || 'ثبت و ارسال');
      setEditingSuccessMsg(form.successMessage || 'اطلاعات شما با موفقیت ثبت شد.');
      setEditingFields(form.fields || []);
    } else {
      setSelectedForm(null);
      setEditingTitle('فرم جدید سفارشی');
      setEditingDesc('توضیحات کوتاه برای راهنمایی کاربران');
      setEditingSubmitBtn('ثبت درخواست');
      setEditingSuccessMsg('اطلاعات با موفقیت ثبت شد.');
      setEditingFields([
        { id: 'f_name', label: 'نام و نام خانوادگی', type: 'text', required: true, placeholder: 'مثال: رضا کمالی' },
        { id: 'f_phone', label: 'شماره تماس همراه', type: 'tel', required: true, placeholder: '09123456789' },
      ]);
    }
    setActiveTab('editor');
  };

  const addField = (type: FormField['type']) => {
    const id = `f_${Date.now().toString(36)}`;
    const newField: FormField = {
      id,
      label: type === 'select' ? 'انتخاب از لیست' : (type === 'textarea' ? 'توضیحات تکمیلی' : 'عنوان فیلد'),
      type,
      required: false,
      placeholder: '',
      options: type === 'select' ? ['گزینه اول', 'گزینه دوم', 'گزینه سوم'] : undefined,
    };
    setEditingFields([...editingFields, newField]);
  };

  const removeField = (index: number) => {
    setEditingFields(editingFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updated = [...editingFields];
    updated[index] = { ...updated[index], ...updates };
    setEditingFields(updated);
  };

  const saveForm = async () => {
    if (!editingTitle.trim()) {
      alert('عنوان فرم الزامی است.');
      return;
    }
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedForm?.id,
          title: editingTitle,
          description: editingDesc,
          submitButtonText: editingSubmitBtn,
          successMessage: editingSuccessMsg,
          fields: editingFields,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('فرم با موفقیت ذخیره گردید!');
        await fetchForms();
        setTimeout(() => setActiveTab('forms'), 1000);
      }
    } catch (err) {
      console.error('Failed to save form:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: string, adminNotes?: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}/forms/submissions/${submissionId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, adminNotes }),
        }
      );
      const data = await res.json();
      if (data.success && selectedForm) {
        fetchSubmissions(selectedForm.id);
      }
    } catch (err) {
      console.error('Failed to update submission status:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">فرم‌ساز تعاملی اختصاصی و مدیریت پاسخ‌ها</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  مشابه پازلی و اپ‌ساز
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                طراحی بی‌نهایت فرم سفارشی (گارانتی، پذیرش، استخدام، استعلام قیمت) با ذخیره پاسخ‌ها در سرور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setActiveTab('forms')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'forms' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                فرم‌های من ({forms.length})
              </button>
              <button
                onClick={() => openEditor()}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'editor' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                + ساخت فرم جدید
              </button>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: FORMS LIST */}
          {activeTab === 'forms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">لیست فرم‌های ساخته‌شده برای این اپلیکیشن</h3>
                <button
                  onClick={() => openEditor()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>طراحی فرم جدید</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span>در حال دریافت لیست فرم‌ها...</span>
                </div>
              ) : forms.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">هنوز هیچ فرمی ساخته نشده است.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-sm text-white">{form.title}</h4>
                          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/30">
                            {form.fields.length} فیلد ورودی
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {form.description || 'بدون توضیحات'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            {form.submissionsCount || 0} پاسخ ثبت‌شده
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            دکمه: «{form.submitButtonText}»
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedForm(form);
                              fetchSubmissions(form.id);
                              setActiveTab('submissions');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>مشاهده پاسخ‌ها ({form.submissionsCount || 0})</span>
                          </button>
                        </div>
                        <button
                          onClick={() => openEditor(form)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition"
                        >
                          ویرایش فیلدها
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FORM BUILDER EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-6 animate-fadeIn">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* Form Metadata Settings */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-300">مشخصات و عنوان فرم</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">عنوان فرم:</label>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="مثال: فرم درخواست گارانتی"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">متن دکمه ارسال:</label>
                    <input
                      type="text"
                      value={editingSubmitBtn}
                      onChange={(e) => setEditingSubmitBtn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="ثبت و ارسال"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">توضیحات راهنمای کاربر:</label>
                  <textarea
                    rows={2}
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="توضیحات مربوط به نحوه تکمیل فیلدها..."
                  />
                </div>
              </div>

              {/* Fields Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300">
                    فیلدهای ورودی فرم ({editingFields.length} فیلد)
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 ml-1">+ افزودن فیلد:</span>
                    <button
                      onClick={() => addField('text')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold"
                    >
                      متن کوتاه
                    </button>
                    <button
                      onClick={() => addField('tel')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold"
                    >
                      شماره تماس
                    </button>
                    <button
                      onClick={() => addField('select')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold"
                    >
                      منوی کشویی
                    </button>
                    <button
                      onClick={() => addField('textarea')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold"
                    >
                      پاراگراف متن
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {editingFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">عنوان فیلد (Label):</label>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(idx, { label: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">راهنمای ورودی (Placeholder):</label>
                          <input
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => updateField(idx, { required: e.target.checked })}
                              className="rounded border-slate-700 text-blue-600 focus:ring-0"
                            />
                            <span>تکمیل الزامی</span>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={() => removeField(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition"
                        title="حذف فیلد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setActiveTab('forms')}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  انصراف
                </button>
                <button
                  onClick={saveForm}
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>ذخیره فرم و انتشار</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSIONS VIEWER */}
          {activeTab === 'submissions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    پاسخ‌های ثبت‌شده برای فرم «{selectedForm?.title}»
                  </h3>
                  <span className="text-xs text-slate-400">تعداد کل: {submissions.length} مورد</span>
                </div>
                <button
                  onClick={() => selectedForm && fetchSubmissions(selectedForm.id)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>تازه‌سازی</span>
                </button>
              </div>

              {loadingSubmissions ? (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span>در حال دریافت پاسخ‌ها...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">هنوز پاسخی برای این فرم ثبت نشده است.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-white">
                            {sub.userName || 'کاربر موبایل'}
                          </span>
                          {sub.userPhone && (
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {sub.userPhone}
                            </span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              sub.status === 'REVIEWED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {sub.status === 'REVIEWED' ? 'بررسی‌شده ✓' : 'در انتظار بررسی'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.status !== 'REVIEWED' && (
                            <button
                              onClick={() => updateSubmissionStatus(sub.id, 'REVIEWED')}
                              className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/30 transition"
                            >
                              تایید و بررسی شد
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submitted Payload Details */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-850 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(sub.data || {}).map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b border-slate-800/40 pb-1">
                            <span className="text-slate-400">{key}:</span>
                            <span className="text-white font-medium">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
