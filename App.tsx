import React, { useState } from 'react';
import { 
  CreditCard, 
  Home, 
  Car, 
  Briefcase, 
  ChevronRight, 
  Menu, 
  X,
  PieChart,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { LoanType } from './types';
import { Button } from './components/Button';
import { ChatAssistant } from './components/ChatAssistant';
import { ApplicationWizard } from './components/ApplicationWizard';
import { LoanCalculator } from './components/LoanCalculator';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLoanType, setActiveLoanType] = useState<LoanType | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const loanProducts = [
    { 
      type: LoanType.PERSONAL, 
      icon: <CreditCard className="w-6 h-6 text-purple-600" />, 
      color: 'bg-purple-50 text-purple-700',
      desc: "Unsecured loans for your personal needs.",
      rate: "From 6.99%"
    },
    { 
      type: LoanType.MORTGAGE, 
      icon: <Home className="w-6 h-6 text-blue-600" />, 
      color: 'bg-blue-50 text-blue-700',
      desc: "Buy your dream home with flexible terms.",
      rate: "From 5.50%"
    },
    { 
      type: LoanType.AUTO, 
      icon: <Car className="w-6 h-6 text-emerald-600" />, 
      color: 'bg-emerald-50 text-emerald-700',
      desc: "Drive away today with our auto financing.",
      rate: "From 4.25%"
    },
    { 
      type: LoanType.BUSINESS, 
      icon: <Briefcase className="w-6 h-6 text-orange-600" />, 
      color: 'bg-orange-50 text-orange-700',
      desc: "Capital to help your business grow.",
      rate: "From 8.00%"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">LendFlow AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-blue-700 bg-blue-50 rounded-lg font-medium">
            <PieChart className="w-5 h-5" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <FileText className="w-5 h-5" /> My Applications
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
            <ShieldCheck className="w-5 h-5" /> Documents
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-sm">Pro Tip</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Upload your income documents for instant pre-qualification.
            </p>
            <button className="text-xs bg-white/10 hover:bg-white/20 w-full py-2 rounded transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed w-full bg-white z-20 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-slate-800">LendFlow</span>
        </div>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
        
        {/* Hero Section */}
        <section className="mb-12">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Finance your future, <span className="text-blue-600">intelligently.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl">
              Experience the fastest loan approval process powered by Gemini AI. 
              Get pre-qualified in minutes with smart document analysis.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowWizard(true)} className="shadow-lg shadow-blue-500/20">
                Start New Application
              </Button>
              <Button variant="outline">
                View Rates
              </Button>
            </div>
          </div>
        </section>

        {/* Loan Products Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {loanProducts.map((loan) => (
            <div 
              key={loan.type} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                setActiveLoanType(loan.type);
                setShowWizard(true);
              }}
            >
              <div className={`w-12 h-12 ${loan.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {loan.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{loan.type}</h3>
              <p className="text-sm text-slate-500 mb-4 h-10">{loan.desc}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">{loan.rate}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </section>

        {/* Calculator Section */}
        <section className="max-w-5xl mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Payment Calculator</h2>
          </div>
          <LoanCalculator />
        </section>

      </main>

      {/* Floating Chat Assistant */}
      <ChatAssistant />

      {/* Application Wizard Modal */}
      {showWizard && (
        <ApplicationWizard 
          initialLoanType={activeLoanType || undefined} 
          onClose={() => setShowWizard(false)} 
        />
      )}
    </div>
  );
}

export default App;

function FileText(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}
