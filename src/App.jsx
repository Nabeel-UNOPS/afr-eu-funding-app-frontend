 import React, { useState, useMemo, useEffect } from 'react';
    import { Search, Globe, DollarSign, ChevronRight, Loader2, LayoutDashboard, Building, Settings, LogOut, FileText, X } from 'lucide-react';
    import { Card, CardHeader, CardContent, CardFooter } from './components/ui/card';
    
    const Button = ({ children, className = '', ...props }) => (
        <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`} {...props}>
            {children}
        </button>
    );

    const Sidebar = () => (
        <aside className="w-64 bg-white border-r flex-col hidden lg:flex">
            <div className="p-4 border-b h-16 flex items-center">
                 <img src="/UNOPS_logo_2016_website_blue_304x53.png" alt="UNOPS Logo" className="h-8" />
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <a href="#" className="flex items-center p-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    Dashboard
                </a>
                <a href="#" className="flex items-center p-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent">
                    <Building className="w-5 h-5 mr-3" />
                    Organizations
                </a>
                 <a href="#" className="flex items-center p-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent">
                    <FileText className="w-5 h-5 mr-3" />
                    Reports
                </a>
            </nav>
            <div className="p-4 border-t">
                <a href="#" className="flex items-center p-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                </a>
                <a href="#" className="flex items-center p-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </a>
            </div>
        </aside>
    );

    const AppHeader = () => (
        <header className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-30">
            <h1 className="font-headline text-2xl font-bold text-primary">AFR EU Funds Navigator</h1>
        </header>
    );

    const FilterSection = ({ filters, setFilters, onReset, allOpportunities }) => {
        const countries = [...new Set(allOpportunities.map(op => op.country).filter(Boolean).filter(c => c !== 'Not specified'))].sort();
        
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFilters(prev => ({ ...prev, [name]: value }));
        };

        return (
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Filter Opportunities</h3>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="searchTerm" className="text-sm font-medium text-muted-foreground block mb-2">Keyword</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="searchTerm"
                                    id="searchTerm"
                                    placeholder="Search by title, country..."
                                    value={filters.searchTerm}
                                    onChange={handleInputChange}
                                    className="w-full p-2 pl-10 border border-input rounded-md bg-background"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="country" className="text-sm font-medium text-muted-foreground block mb-2">Country</label>
                            <select name="country" id="country" value={filters.country} onChange={handleInputChange} className="w-full p-2 border border-input rounded-md bg-background">
                                <option value="">All Countries</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={onReset} className="mt-4 text-sm text-primary hover:underline">
                        Reset filters
                    </button>
                </CardContent>
            </Card>
        );
    };

    const FundingCard = ({ opportunity, onSelect }) => {
        const { title, country, fundingAmount } = opportunity;
        return (
            <Card className="hover:border-primary transition-colors">
                <CardHeader>
                    <h4 className="font-headline text-lg font-semibold text-primary">{title}</h4>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>{country || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{fundingAmount || 'Not specified'}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => onSelect(opportunity)} className="w-full">
                        View Details <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        );
    };

    const FundingModal = ({ opportunity, onClose }) => {
        if (!opportunity) return null;
        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
                    <CardHeader className="flex-row justify-between items-center">
                        <h2 className="font-headline text-2xl font-bold text-primary">{opportunity.title}</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary"><X className="w-5 h-5"/></button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                        <div>
                            <h3 className="font-semibold mb-1">Description</h3>
                            <p className="text-muted-foreground text-sm">{opportunity.description}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-1">Eligibility</h3>
                            <p className="text-muted-foreground text-sm">{opportunity.eligibility}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between bg-secondary/50">
                        <div className="text-sm">
                            <span className="font-semibold">Deadline:</span> {opportunity.deadline || 'Not specified'}
                        </div>
                        <a href={opportunity.source_url || '#'} target="_blank" rel="noopener noreferrer">
                            <Button>Go to Source</Button>
                        </a>
                    </CardFooter>
                </Card>
            </div>
        );
    };

    const Dashboard = () => {
        const [selectedOpportunity, setSelectedOpportunity] = useState(null);
        const [allOpportunities, setAllOpportunities] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const initialFilters = { searchTerm: '', country: '' };
        const [filters, setFilters] = useState(initialFilters);

        useEffect(() => {
            const API_URL = "https://us-central1-unops-cameron.cloudfunctions.net/api-function";
            fetch(API_URL)
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    setAllOpportunities(Array.isArray(data) ? data : []);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching data:", err);
                    setError(err.message);
                    setIsLoading(false);
                });
        }, []);

        const filteredOpportunities = useMemo(() => {
            if (!allOpportunities) return [];
            return allOpportunities.filter(op => {
                if (!op || typeof op.title !== 'string') return false;
                const searchTermLower = filters.searchTerm.toLowerCase();
                const titleMatch = op.title.toLowerCase().includes(searchTermLower);
                const countryMatch = op.country && op.country.toLowerCase().includes(searchTermLower);
                return (filters.country ? op.country === filters.country : true) && (searchTermLower === '' || titleMatch || countryMatch);
            });
        }, [filters, allOpportunities]);

        return (
            <div className="p-6 bg-background">
                <FilterSection filters={filters} setFilters={setFilters} onReset={() => setFilters(initialFilters)} allOpportunities={allOpportunities} />
                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin mr-3" />
                            <span>Loading opportunities...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 text-destructive">Failed to load data.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredOpportunities.map((op, index) => (
                                <FundingCard key={op.source_url || index} opportunity={op} onSelect={setSelectedOpportunity} />
                            ))}
                        </div>
                    )}
                </div>
                <FundingModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} />
            </div>
        );
    };

    export default function App() {
      return (
        <div className="flex h-screen bg-background font-body text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto">
                    <Dashboard />
                </main>
            </div>
        </div>
      );
    }
    
