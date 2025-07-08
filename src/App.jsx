import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronRight, Briefcase, Globe, DollarSign, Calendar, CheckCircle, Clock, BarChart2, HelpCircle, Mail, Phone } from 'lucide-react';

// --- Live-Sourced Mock Data (Updated July 2025) ---
// This data is based on real programs found on the EU's official websites.
// It simulates what a live AI scraping tool would provide to the front-end.
const fundingOpportunities = [
    {
        id: 1,
        title: "Global Gateway: Africa-EU Green Energy Initiative",
        country: "Multiple",
        region: "Pan-African",
        thematicPriority: "Green Deal",
        fundingType: "Development",
        fundingAmount: "€3.4 Billion (Team Europe)",
        deadline: "2027-12-31", // Indicative deadline for the framework
        status: "Open",
        description: "A flagship initiative under the Global Gateway strategy to support Africa's green transition by increasing renewable energy capacity, promoting energy efficiency, and ensuring a just transition.",
        eligibility: "African partner countries, regional organizations, public and private sector entities. Specific calls for proposals are released periodically.",
        applicationLink: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/stronger-europe-world/global-gateway_en",
        impactMetrics: {
            funded: "€3.4 Billion",
            usage: "€450,000,000 (13%)",
            milestones: [
                { name: "Strategic Partnerships Formed", completed: true },
                { name: "First Round of Projects Selected", completed: false },
                { name: "Mid-term Framework Review", completed: false },
            ],
            kpis: [
                { name: "Renewable Energy Capacity (GW)", value: "5 / 50" },
                { name: "People with Energy Access", value: "1M / 100M" },
            ]
        }
    },
    {
        id: 2,
        title: "NDICI-Global Europe: Support for Health Systems in Sub-Saharan Africa",
        country: "Multiple",
        region: "Sub-Saharan Africa",
        thematicPriority: "Health",
        fundingType: "Development",
        fundingAmount: "€29.18 Billion (Budget for Africa)",
        deadline: "2027-12-31", // Overall program deadline
        status: "Open",
        description: "Strengthening health systems, promoting universal health coverage, and boosting local manufacturing of vaccines, medicines, and health technologies in Africa.",
        eligibility: "Governments, civil society organizations (CSOs), and research institutions in Sub-Saharan African countries.",
        applicationLink: "https://international-partnerships.ec.europa.eu/funding/funding-instruments/ndici-global-europe_en",
        impactMetrics: {
            funded: "€29.18 Billion",
            usage: "€3.1 Billion (11%)",
            milestones: [
                { name: "Country-level Needs Assessments", completed: true },
                { name: "Launch of Vaccine Production Hubs", completed: false },
                { name: "Healthcare Worker Training Programs", completed: false },
            ],
            kpis: [
                { name: "Health Facilities Upgraded", value: "25 / 500" },
                { name: "People with Improved Healthcare", value: "5M / 50M" },
            ]
        }
    },
    {
        id: 3,
        title: "Humanitarian Aid for the Horn of Africa Crisis",
        country: "Ethiopia, Somalia, Kenya",
        region: "East Africa",
        thematicPriority: "Humanitarian Aid",
        fundingType: "Humanitarian",
        fundingAmount: "€81.5 Million (2025 Allocation)",
        deadline: "2025-12-31", // Annual allocation deadline
        status: "Open",
        description: "Providing life-saving assistance to people affected by conflict, climate change (droughts and floods), and food insecurity in the Horn of Africa.",
        eligibility: "Certified humanitarian partners of the EU (e.g., UN agencies, international NGOs) with operational presence in the region.",
        applicationLink: "https://civil-protection-humanitarian-aid.ec.europa.eu/where/africa/horn-africa_en",
        impactMetrics: {
            funded: "€81.5 Million",
            usage: "€20 Million (25%)",
            milestones: [
                { name: "Rapid Response Mechanism Activated", completed: true },
                { name: "Food & Nutrition Aid Distribution", completed: false },
                { name: "Water & Sanitation Projects", completed: false },
            ],
            kpis: [
                { name: "People Receiving Food Aid", value: "500,000 / 2,000,000" },
                { name: "Children Treated for Malnutrition", value: "50,000 / 250,000" },
            ]
        }
    },
    {
        id: 4,
        title: "Erasmus+ Intra-Africa Academic Mobility Scheme",
        country: "Multiple",
        region: "Pan-African",
        thematicPriority: "Education",
        fundingType: "Development",
        fundingAmount: "Varies per project",
        deadline: "2026-04-28", // Example call deadline
        status: "Open",
        description: "Enhancing human capital development in Africa by providing opportunities for students and staff of higher education institutions to undertake study, training, or research in another African country.",
        eligibility: "Consortia of higher education institutions from different African countries.",
        applicationLink: "https://eacea.ec.europa.eu/erasmus-plus/intra-africa-academic-mobility-scheme_en",
        impactMetrics: {
            funded: "N/A",
            usage: "N/A",
            milestones: [
                { name: "Call for Proposals Published", completed: true },
                { name: "Application Period", completed: false },
                { name: "Selection Results", completed: false },
            ],
            kpis: [
                { name: "Student Mobilities Funded", value: "0 / 1,500" },
                { name: "Staff Mobilities Funded", value: "0 / 500" },
            ]
        }
    }
];

// --- Helper Data ---
const countries = [...new Set(fundingOpportunities.map(op => op.country))].sort();
const thematicPriorities = [...new Set(fundingOpportunities.map(op => op.thematicPriority))].sort();
const fundingTypes = [...new Set(fundingOpportunities.map(op => op.fundingType))].sort();

// --- Components ---

const Header = () => (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-900 p-2 rounded-md">
                <svg className="w-8 h-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM11 6H13V11H11V6ZM11 13H13V18H11V13Z" transform="rotate(90 12 12)"/>
                    <path d="M11 6H13V11H11V6ZM11 13H13V18H11V13Z" transform="rotate(180 12 12)"/>
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-900">EU-Africa Funding Gateway</h1>
        </div>
    </header>
);

const FilterSection = ({ filters, setFilters, onReset }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" /> Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Search Term */}
                <div className="relative col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <label htmlFor="searchTerm" className="text-sm font-medium text-gray-600 block mb-1">Search</label>
                    <input
                        type="text"
                        name="searchTerm"
                        id="searchTerm"
                        placeholder="e.g., 'Global Gateway' or 'Kenya'"
                        value={filters.searchTerm}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                </div>

                {/* Country */}
                <div>
                    <label htmlFor="country" className="text-sm font-medium text-gray-600 block mb-1">Country</label>
                    <select name="country" id="country" value={filters.country} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Thematic Priority */}
                <div>
                    <label htmlFor="thematicPriority" className="text-sm font-medium text-gray-600 block mb-1">Thematic Priority</label>
                    <select name="thematicPriority" id="thematicPriority" value={filters.thematicPriority} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">All Priorities</option>
                        {thematicPriorities.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Funding Type */}
                <div>
                    <label htmlFor="fundingType" className="text-sm font-medium text-gray-600 block mb-1">Funding Type</label>
                    <select name="fundingType" id="fundingType" value={filters.fundingType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">All Types</option>
                        {fundingTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="text-sm font-medium text-gray-600 block mb-1">Status</label>
                    <select name="status" id="status" value={filters.status} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>
             <button onClick={onReset} className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                Reset Filters
            </button>
        </div>
    );
};

const FundingCard = ({ opportunity, onSelect }) => {
    const { title, country, fundingAmount, deadline, status } = opportunity;
    const isPastDeadline = new Date(deadline) < new Date();
    const effectiveStatus = status === 'Closed' || isPastDeadline ? 'Closed' : 'Open';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="p-5 flex-grow">
                <h4 className="text-lg font-bold text-blue-800 mb-2">{title}</h4>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{country}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-semibold">{fundingAmount}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Deadline: {new Date(deadline).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-between items-center rounded-b-lg">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${effectiveStatus === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {effectiveStatus}
                </span>
                <button onClick={() => onSelect(opportunity)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View Details
                </button>
            </div>
        </div>
    );
};

const FundingModal = ({ opportunity, onClose }) => {
    if (!opportunity) return null;
    
    const [activeTab, setActiveTab] = useState('details');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-900">{opportunity.title}</h2>
                        <div className="flex items-center text-gray-500 mt-2 space-x-4 text-sm">
                            <span className="flex items-center"><Globe className="w-4 h-4 mr-1.5"/>{opportunity.country}</span>
                            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/>{opportunity.thematicPriority}</span>
                            <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1.5"/>{opportunity.fundingAmount}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 px-5">
                        <button onClick={() => setActiveTab('details')} className={`py-3 px-1 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Details
                        </button>
                        <button onClick={() => setActiveTab('impact')} className={`py-3 px-1 font-medium ${activeTab === 'impact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Impact Tracking
                        </button>
                    </nav>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility</h3>
                                <p className="text-gray-600 leading-relaxed">{opportunity.eligibility}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600"/>Application Deadline</h4>
                                    <p className="text-gray-800 text-base font-medium">{new Date(opportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        {opportunity.status === 'Open' ? <CheckCircle className="w-5 h-5 mr-2 text-green-600"/> : <Clock className="w-5 h-5 mr-2 text-red-600"/>}
                                        Status
                                    </h4>
                                    <p className={`text-base font-medium ${opportunity.status === 'Open' ? 'text-green-700' : 'text-red-700'}`}>{opportunity.status}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'impact' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Funding Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-700">Total Funding</p>
                                        <p className="text-2xl font-bold text-blue-900">{opportunity.impactMetrics.funded}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-700">Funds Utilized</p>
                                        <p className="text-2xl font-bold text-green-900">{opportunity.impactMetrics.usage}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Milestones</h3>
                                <ul className="space-y-2">
                                    {opportunity.impactMetrics.milestones.map((milestone, index) => (
                                        <li key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                                            {milestone.completed ? <CheckCircle className="w-5 h-5 text-green-500 mr-3"/> : <Clock className="w-5 h-5 text-yellow-500 mr-3"/>}
                                            <span className={`flex-grow ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{milestone.name}</span>
                                            <span className={`text-sm font-semibold ${milestone.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {milestone.completed ? 'Completed' : 'In Progress'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Performance Indicators (KPIs)</h3>
                                <div className="space-y-3">
                                    {opportunity.impactMetrics.kpis.map((kpi, index) => {
                                        const parts = kpi.value.split(' / ');
                                        const current = parseFloat(parts[0].replace(/,/g, '').replace(/[A-Za-z]/g, ''));
                                        const total = parseFloat(parts[1].replace(/,/g, '').replace(/[A-Za-z]/g, ''));
                                        const percentage = total > 0 ? (current / total) * 100 : 0;
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                                                    <span className="text-sm text-gray-500">{kpi.value}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end items-center space-x-4">
                    <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                        Close
                    </button>
                    <a href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 inline-flex items-center">
                        Go to Application <ChevronRight className="w-4 h-4 ml-1"/>
                    </a>
                </div>
            </div>
        </div>
    );
};

const SupportSection = () => (
    <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><HelpCircle className="w-7 h-7 mr-3 text-blue-600"/>Support & Contacts</h2>
        <p className="text-gray-600 mb-6">For questions about specific funding opportunities or the application process, please use the contacts below.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">General Inquiries</h3>
                <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-5 h-5 text-gray-500"/>
                    <a href="mailto:funding-support@africa-gateway.eu" className="hover:text-blue-600">funding-support@africa-gateway.eu</a>
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Technical Support</h3>
                <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-500"/>
                    <a href="tel:+1234567890" className="hover:text-blue-600">+1 (234) 567-890</a>
                </div>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-6">For specific questions related to an EU Delegation in a particular country, please refer to the official EU websites.</p>
    </div>
);


// --- Main App Component ---
export default function App() {
    const [activeTab, setActiveTab] = useState('opportunities');
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const initialFilters = {
        searchTerm: '',
        country: '',
        thematicPriority: '',
        fundingType: '',
        status: 'Open',
    };
    const [filters, setFilters] = useState(initialFilters);

    const filteredOpportunities = useMemo(() => {
        return fundingOpportunities.filter(op => {
            const searchTermLower = filters.searchTerm.toLowerCase();
            const isPastDeadline = new Date(op.deadline) < new Date();
            const effectiveStatus = op.status === 'Closed' || isPastDeadline ? 'Closed' : 'Open';

            return (
                (filters.country ? op.country === filters.country : true) &&
                (filters.thematicPriority ? op.thematicPriority === filters.thematicPriority : true) &&
                (filters.fundingType ? op.fundingType === filters.fundingType : true) &&
                (filters.status ? effectiveStatus === filters.status : true) &&
                (op.title.toLowerCase().includes(searchTermLower) || op.description.toLowerCase().includes(searchTermLower))
            );
        });
    }, [filters]);

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Header />
            <main className="p-4 md:p-8">
                <div className="mb-6 border-b border-gray-300">
                    <nav className="flex space-x-6">
                        <button onClick={() => setActiveTab('opportunities')} className={`py-3 px-2 text-lg font-medium ${activeTab === 'opportunities' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Funding Opportunities
                        </button>
                        <button onClick={() => setActiveTab('support')} className={`py-3 px-2 text-lg font-medium ${activeTab === 'support' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Support
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'opportunities' && (
                    <>
                        <FilterSection filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} />
                        
                        <div className="mt-6">
                            <p className="text-gray-600 mb-4">{filteredOpportunities.length} opportunities found.</p>
                            {filteredOpportunities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredOpportunities.map(op => (
                                        <FundingCard key={op.id} opportunity={op} onSelect={setSelectedOpportunity} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-700">No matching opportunities found</h3>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'support' && <SupportSection />}
            </main>
            
            <FundingModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} />
        </div>
    );
}
