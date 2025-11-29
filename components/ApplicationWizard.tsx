import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, AlertCircle, DollarSign, User, Building, FileText, Sparkles } from 'lucide-react';
import { LoanType, ApplicationFormData, AnalyzedDocumentData } from '../types';
import { Button } from './Button';
import { DocumentUploader } from './DocumentUploader';
import { GeminiService } from '../services/gemini';

interface ApplicationWizardProps {
  initialLoanType?: LoanType;
  onClose: () => void;
}

const STEPS = ['Personal Info', 'Financials', 'Loan Details', 'Review'];

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({ initialLoanType, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiRiskAssessment, setAiRiskAssessment] = useState<any>(null);
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: 'Employed',
    employerName: '',
    annualIncome: 0,
    monthlyDebt: 0,
    creditScoreEst: 700,
    loanType: initialLoanType || LoanType.PERSONAL,
    amount: 10000,
    term: 24,
    purpose: ''
  });

  const handleChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentData = (data: AnalyzedDocumentData) => {
    if (data.grossPay) {
      // Very rough annualization
      setFormData(prev => ({
        ...prev,
        employerName: data.employerName || prev.employerName,
        annualIncome: (data.grossPay || 0) * 26 // Assuming bi-weekly
      }));
    }
  };

  const nextStep = async () => {
    if (currentStep === 2) {
      // Before final review, run risk assessment
      setIsSubmitting(true);
      const risk = await GeminiService.assessRisk(formData);
      setAiRiskAssessment(risk);
      setIsSubmitting(false);
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="123 Main St, City, Country"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800">Financial Profile</h2>
            
            {/* AI Document Analysis Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Auto-fill with AI</span>
              </div>
              <DocumentUploader onDataExtracted={handleDocumentData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Income ($)</label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={e => handleChange('annualIncome', parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employer Name</label>
                <input
                  type="text"
                  value={formData.employerName}
                  onChange={e => handleChange('employerName', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Debt Obligations ($)</label>
                <input
                  type="number"
                  value={formData.monthlyDebt}
                  onChange={e => handleChange('monthlyDebt', parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Est. Credit Score</label>
                <input
                  type="range"
                  min="300"
                  max="850"
                  value={formData.creditScoreEst}
                  onChange={e => handleChange('creditScoreEst', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                />
                <div className="text-center text-sm font-bold text-blue-600 mt-1">{formData.creditScoreEst}</div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Loan Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loan Type</label>
              <select
                value={formData.loanType}
                onChange={e => handleChange('loanType', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(LoanType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Requested Amount ($)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => handleChange('amount', parseFloat(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Term (Months)</label>
              <select
                value={formData.term}
                onChange={e => handleChange('term', parseInt(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
                <option value={48}>48 Months</option>
                <option value={60}>60 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Loan</label>
              <textarea
                value={formData.purpose}
                onChange={e => handleChange('purpose', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                placeholder="Describe why you need this loan..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Final Review</h2>
              {aiRiskAssessment && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  aiRiskAssessment.status === 'Pre-Qualified' ? 'bg-emerald-100 text-emerald-700' :
                  aiRiskAssessment.status === 'Unlikely' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  AI Prediction: {aiRiskAssessment.status}
                </span>
              )}
            </div>

            {aiRiskAssessment && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900">AI Insights</h4>
                    <p className="text-sm text-blue-800 mt-1">{aiRiskAssessment.reasoning}</p>
                    {aiRiskAssessment.tips?.length > 0 && (
                      <ul className="list-disc list-inside mt-2 text-xs text-blue-700">
                        {aiRiskAssessment.tips.map((tip: string, idx: number) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Applicant</span>
                <span className="font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Loan Type</span>
                <span className="font-medium">{formData.loanType}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-medium">${formData.amount.toLocaleString()}</span>
              </div>
              <div className="p-4 flex justify-between">
                <span className="text-slate-500">Income</span>
                <span className="font-medium">${formData.annualIncome.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-800">New Application</h1>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Progress */}
        <div className="w-full bg-slate-100 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button variant="secondary" onClick={() => alert("Application Submitted! (Demo)")}>
              Submit Application <Check className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" onClick={nextStep} isLoading={isSubmitting}>
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
