'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaChartLine, FaTrophy, FaDollarSign, FaCog, FaBell, FaCrown, FaSignOutAlt, FaTimes, FaGamepad, FaTachometerAlt } from 'react-icons/fa';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vipPlans, setVipPlans] = useState([
    { id: 1, name: 'VIP 1', status: 'Sold Out', canToggle: true },
    { id: 2, name: 'VIP 2', status: 'Available', canToggle: true },
    { id: 3, name: 'VIP 3', status: 'Available', canToggle: true },
    ]);

  // Initialize VIP plan statuses in localStorage
  useEffect(() => {
    const vipPlanStatuses = {
      'VIP 1': true,  // Available
      'VIP 2': true,  // Available
      'VIP 3': true,  // Available
    };
    localStorage.setItem('vipPlanStatuses', JSON.stringify(vipPlanStatuses));
  }, []);

  const [smsRecipients, setSmsRecipients] = useState('all');
  const [smsMessage, setSmsMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Free');
  const [bookingCodes, setBookingCodes] = useState({
    Slips: '',
    Free: '',
    VIP1: '',
    VIP2: '',
    VIP3: ''
  });
  const [loadedGames, setLoadedGames] = useState({
    Slips: [],
    Free: [],
    VIP1: [],
    VIP2: [],
    VIP3: []
  });
  const [loadedBookings, setLoadedBookings] = useState({
    Slips: [],
    Free: [],
    VIP1: [],
    VIP2: [],
    VIP3: []
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [sportyCode, setSportyCode] = useState('');
  const [msportCode, setMsportCode] = useState('');
  const [gamePrice, setGamePrice] = useState('');
  // Price management states - separate prices for each category
  const [categoryPrices, setCategoryPrices] = useState({
    Free: '',
    VIP1: '',
    VIP2: '',
    VIP3: ''
  });
  const [gameResult, setGameResult] = useState('');
  const [editingGame, setEditingGame] = useState(null);
  const [selectedSlips, setSelectedSlips] = useState([]);
  const [expandedSlips, setExpandedSlips] = useState([]);
  const [archivedSlips, setArchivedSlips] = useState<string[]>([]);
  
  // Admin management states
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'limited'
  });
  const [admins, setAdmins] = useState([
    { id: 1, username: 'admin', email: 'admin@a1tips.com', role: 'full', status: 'active', createdDate: '2024-01-01' },
    { id: 2, username: 'moderator1', email: 'mod1@a1tips.com', role: 'limited', status: 'active', createdDate: '2024-01-15' }
  ]);
  
  const router = useRouter();

  // Check admin authentication
  useEffect(() => {
    const checkAuth = () => {
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      if (adminLoggedIn === 'true') {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  const toggleVipPlanStatus = (planId: number) => {
    setVipPlans(prev => {
      const updatedPlans = prev.map(plan => 
        plan.id === planId 
          ? { ...plan, status: plan.status === 'Available' ? 'Sold Out' : 'Available' }
          : plan
      );
      
      // Save VIP plan statuses to localStorage for user pages to access
      const vipPlanStatuses = updatedPlans.reduce((acc, plan) => {
        acc[plan.name] = plan.status === 'Available';
        return acc;
      }, {} as Record<string, boolean>);
      
      localStorage.setItem('vipPlanStatuses', JSON.stringify(vipPlanStatuses));
      
      return updatedPlans;
    });
  };

  const loadGames = () => {
    const currentBookingCode = bookingCodes[selectedCategory];
    if (!currentBookingCode.trim()) return;
    
    // Mock games data - we'll implement real SportyBet integration later
    const mockGames = [
      { id: 1, match: 'Bodoe/Glimt vs Kristiansund BK', type: '1X2', odds: 1.11 },
      { id: 2, match: 'Paderborn vs Bochum', type: '1X2', odds: 1.97 },
      { id: 3, match: 'Arminia Bielefeld vs 1. FC Magdeburg', type: '1X2', odds: 2.15 },
      { id: 4, match: 'Bayer Leverkusen vs Eintracht Frankfurt', type: '1X2', odds: 2.36 },
    ];
    
    // Load games only to the selected category
    setLoadedGames(prev => ({
      ...prev,
      [selectedCategory]: mockGames
    }));
    
    // Track the booking code as one entry
    setLoadedBookings(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], { code: currentBookingCode, games: mockGames }]
    }));
    
    // Clear the booking code for this category only
    setBookingCodes(prev => ({
      ...prev,
      [selectedCategory]: ''
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const removeGame = (category: string, gameId: number) => {
    setLoadedGames(prev => ({
      ...prev,
      [category]: prev[category].filter((game: any) => game.id !== gameId)
    }));
  };

  const clearAllGames = () => {
    setLoadedGames({
      Slips: [],
      Free: [],
      VIP1: [],
      VIP2: [],
      VIP3: []
    });
    setLoadedBookings({
      Slips: [],
      Free: [],
      VIP1: [],
      VIP2: [],
      VIP3: []
    });
  };

  const handleAddBooking = () => {
    setSelectedGame({ category: selectedCategory, games: loadedGames[selectedCategory] });
    // Pre-populate with existing codes if they exist
    setSportyCode(loadedGames[selectedCategory]?.[0]?.sportyCode || '');
    setMsportCode(loadedGames[selectedCategory]?.[0]?.msportCode || '');
    setShowBookingModal(true);
  };

  const handleAttachBooking = () => {
    if (sportyCode.trim() && msportCode.trim()) {
      // Save booking codes to the games in the category
      const updatedGames = loadedGames[selectedCategory].map(game => ({
        ...game,
        sportyCode: sportyCode.trim(),
        msportCode: msportCode.trim()
      }));
      
      setLoadedGames(prev => ({
        ...prev,
        [selectedCategory]: updatedGames
      }));
      
      console.log('Booking codes saved:', { sportyCode, msportCode, category: selectedCategory });
      setShowBookingModal(false);
      setSelectedGame(null);
      setSportyCode('');
      setMsportCode('');
    }
  };

  const handleCancelBooking = () => {
    setShowBookingModal(false);
    setSelectedGame(null);
    setSportyCode('');
    setMsportCode('');
  };

  const handleSetPrice = () => {
    console.log('Set Price clicked for category:', selectedCategory);
    setSelectedGame({ category: selectedCategory, games: loadedGames[selectedCategory] });
    // Pre-populate with existing price if it exists
    setGamePrice(categoryPrices[selectedCategory] || '');
    setShowPriceModal(true);
    console.log('Price modal should be visible now');
  };

  const handleSavePrice = () => {
    console.log('Save Price clicked, gamePrice:', gamePrice, 'selectedCategory:', selectedCategory);
    if (gamePrice.trim()) {
      // Save price to the specific category only
      setCategoryPrices(prev => ({
        ...prev,
        [selectedCategory]: gamePrice.trim()
      }));
      
      console.log('Price saved for category:', { 
        price: gamePrice.trim(), 
        category: selectedCategory,
        gamesCount: loadedGames[selectedCategory].length
      });
      
      setShowPriceModal(false);
      setSelectedGame(null);
      setGamePrice('');
    } else {
      console.log('Game price is empty, not saving');
    }
  };

  const handleCancelPrice = () => {
    setShowPriceModal(false);
    setSelectedGame(null);
    setGamePrice('');
  };

  const handleUpload = () => {
    // Directly upload games to users and move to Slips
    const categoryPrice = categoryPrices[selectedCategory] || '';
    const gamesToMove = loadedGames[selectedCategory].map((game, index) => ({
      ...game,
      id: `slip_${Date.now()}_${index}`, // Unique ID for each slip
      originalCategory: selectedCategory,
      uploadDate: new Date().toISOString(),
      status: 'Active',
      result: null, // Will be set after match
      editable: true, // Can be edited after match
      categoryPrice: categoryPrice // Include the category-specific price
    }));
    
    // Add to Slips
    setLoadedGames(prev => ({
      ...prev,
      Slips: [...prev.Slips, ...gamesToMove]
    }));
    
    // Clear current category
    setLoadedGames(prev => ({
      ...prev,
      [selectedCategory]: []
    }));
    
    setLoadedBookings(prev => ({
      ...prev,
      [selectedCategory]: []
    }));
    
    console.log('Games uploaded directly to users and moved to Slips:', {
      games: gamesToMove,
      category: selectedCategory,
      price: categoryPrice
    });
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameResult(game.result || '');
    setShowEditModal(true);
  };

  const handleSaveResult = (result) => {
    if (result && editingGame) {
      // Update the game result in Slips
      setLoadedGames(prev => ({
        ...prev,
        Slips: prev.Slips.map(game => 
          game.id === editingGame.id 
            ? { ...game, result: result, status: 'Completed' }
            : game
        )
      }));
      
      console.log('Game result saved:', { game: editingGame, result: result });
      setShowEditModal(false);
      setEditingGame(null);
      setGameResult('');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingGame(null);
    setGameResult('');
  };

  const handleSlipSelection = (slipId) => {
    setSelectedSlips(prev => 
      prev.includes(slipId) 
        ? prev.filter(id => id !== slipId)
        : [...prev, slipId]
    );
  };

  const handleSelectAllSlips = () => {
    const allSlipIds = groupGamesIntoSlips().map(slip => slip.id);
    setSelectedSlips(allSlipIds);
  };

  const handleClearSlipSelection = () => {
    setSelectedSlips([]);
  };

  const handleToggleSlipExpansion = (slipId) => {
    setExpandedSlips(prev => 
      prev.includes(slipId) 
        ? prev.filter(id => id !== slipId)
        : [...prev, slipId]
    );
  };

  const handleArchiveSelectedSlips = () => {
    if (selectedSlips.length === 0) return;
    
    // Add selected slips to archived list
    setArchivedSlips(prev => [...prev, ...selectedSlips]);
    
    // Clear selection
    setSelectedSlips([]);
    
    console.log('Archived slips:', selectedSlips);
  };

  const handleSendSMS = () => {
    if (!smsMessage.trim()) {
      alert('Please enter a message before sending SMS');
      return;
    }

    // Simulate SMS sending
    console.log('Sending SMS:', {
      recipients: smsRecipients,
      message: smsMessage
    });

    // Show success message
    alert(`SMS sent successfully to ${smsRecipients === 'all' ? 'all users' : 'custom numbers'}!`);
    
    // Clear the message
    setSmsMessage('');
  };

  const handleAddAdmin = () => {
    if (!newAdmin.username.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Check if username or email already exists
    const existingAdmin = admins.find(admin => 
      admin.username === newAdmin.username || admin.email === newAdmin.email
    );

    if (existingAdmin) {
      alert('Username or email already exists');
      return;
    }

    // Add new admin
    const adminToAdd = {
      id: admins.length + 1,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setAdmins(prev => [...prev, adminToAdd]);
    
    // Save to localStorage (in real app, this would be API call)
    localStorage.setItem('admins', JSON.stringify([...admins, adminToAdd]));
    
    alert(`Admin ${newAdmin.username} added successfully with ${newAdmin.role} access!`);
    
    // Reset form and close modal
    setNewAdmin({ username: '', email: '', password: '', role: 'limited' });
    setShowAddAdminModal(false);
  };

  const handleToggleAdminStatus = (adminId: number) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ));
  };

  const handleChangeAdminRole = (adminId: number, newRole: string) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, role: newRole }
        : admin
    ));
  };

  const groupGamesIntoSlips = () => {
    // Group games by upload date to create slip batches
    const slipGroups = {};
    loadedGames.Slips.forEach(game => {
      const slipKey = game.uploadDate || 'default';
      if (!slipGroups[slipKey]) {
        slipGroups[slipKey] = [];
      }
      slipGroups[slipKey].push(game);
    });
    
    const allSlips = Object.entries(slipGroups).map(([date, games], index) => ({
      id: `slip_${index + 1}`,
      slipNumber: index + 1,
      games: games,
      uploadDate: date,
      originalCategory: games[0]?.originalCategory || 'Free',
      totalOdds: games.reduce((total, game) => total * game.odds, 1).toFixed(2),
      sportyCode: games[0]?.sportyCode || 'N/A',
      msportCode: games[0]?.msportCode || 'N/A'
    }));

    // Filter out archived slips
    return allSlips.filter(slip => !archivedSlips.includes(slip.id));
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { title: 'Total Users', value: '1,234', icon: FaUsers, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Games', value: '45', icon: FaGamepad, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'VIP Subscriptions', value: '89', icon: FaCrown, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  const recentActivity = [
    { action: 'New user registered: john_doe', time: '2 minutes ago' },
    { action: 'VIP package sold: Daily Plan', time: '5 minutes ago' },
    { action: 'Game result updated: Team A vs Team B', time: '10 minutes ago' },
  ];

  const users = [
    {
      id: 1,
      name: 'John Doe',
      username: 'john_doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'Active'
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">A1Tips Admin</h1>
              <p className="mt-2 text-blue-100">Control Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-blue-100">Admin User</span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen relative">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaTachometerAlt className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'games'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaGamepad className="w-5 h-5 mr-3" />
                Games
              </button>
              <button
                onClick={() => setActiveTab('gamesControl')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'gamesControl'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaGamepad className="w-5 h-5 mr-3" />
                Games Control
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaUsers className="w-5 h-5 mr-3" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaBell className="w-5 h-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('sms')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'sms'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                SMS
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaCog className="w-5 h-5 mr-3" />
                Settings
              </button>
            </div>
          </nav>
          
          {/* Issue Notification */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-600 text-white px-3 py-2 rounded-md flex items-center justify-between text-sm">
              <span>N 1 Issue X</span>
              <button className="text-white hover:text-red-200">
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="ml-4">
                        <div className={`text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="px-6 py-4 flex justify-between items-center">
                      <span className="text-gray-700">{activity.action}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Games Management</h2>
              
              {/* Filter Games by Category */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Games by Category</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      setSelectedCategory('Slips');
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === 'Slips' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    Slips ({groupGamesIntoSlips().length})
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('Free')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === 'Free' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    Free ({loadedBookings.Free.length})
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('VIP1')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === 'VIP1' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    VIP1 ({loadedBookings.VIP1.length})
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('VIP2')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === 'VIP2' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    VIP2 ({loadedBookings.VIP2.length})
                  </button>
                  <button 
                    onClick={() => setSelectedCategory('VIP3')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedCategory === 'VIP3' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    VIP3 ({loadedBookings.VIP3.length})
                  </button>
                </div>
              </div>

              {/* Load Games Section - Only show if no games loaded for this category and not Slips */}
              {loadedGames[selectedCategory].length === 0 && selectedCategory !== 'Slips' && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Load Games - {selectedCategory}</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={bookingCodes[selectedCategory] || loadedGames[selectedCategory]?.[0]?.sportyCode || ''}
                      onChange={(e) => setBookingCodes(prev => ({
                        ...prev,
                        [selectedCategory]: e.target.value
                      }))}
                      placeholder={`Enter SportyBet booking code for ${selectedCategory}...`}
                      className="flex-1 px-4 py-2 border-2 border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button 
                      onClick={loadGames}
                      disabled={!bookingCodes[selectedCategory]?.trim() && !loadedGames[selectedCategory]?.[0]?.sportyCode}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>
              )}

              {/* Show Saved Booking Codes and Prices */}
              {selectedCategory !== 'Slips' && loadedGames[selectedCategory] && loadedGames[selectedCategory].length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Saved Information for {selectedCategory}</h4>
                  
                  {/* Saved Booking Codes */}
                  {loadedGames[selectedCategory][0]?.sportyCode && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="text-sm text-blue-800 font-medium mb-1">Saved Booking Codes:</div>
                      <div className="text-sm text-blue-700">
                        <div>SportyBet: {loadedGames[selectedCategory][0].sportyCode}</div>
                        <div>MSport: {loadedGames[selectedCategory][0].msportCode}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Saved Price */}
                  {categoryPrices[selectedCategory] && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="text-sm text-green-800 font-medium mb-1">Saved Price:</div>
                      <div className="text-sm text-green-700">
                        ${categoryPrices[selectedCategory]}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty Slips Message */}
              {selectedCategory === 'Slips' && loadedGames.Slips.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Uploaded Slips</h3>
                    <p className="text-gray-600">Uploaded games from Free, VIP1, VIP2, and VIP3 categories will appear here.</p>
                  </div>
                </div>
              )}

              {/* Loaded Games Display */}
              {loadedGames[selectedCategory].length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  {selectedCategory === 'Slips' ? (
                    // Slips Display - Card Layout
                    <>
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Uploaded Slips ({groupGamesIntoSlips().length})
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSelectAllSlips}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium"
                          >
                            Select All
                          </button>
                          <button
                            onClick={handleClearSlipSelection}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium"
                          >
                            Clear Selection
                          </button>
                          <button
                            onClick={handleArchiveSelectedSlips}
                            disabled={selectedSlips.length === 0}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                          >
                            Archive Selected ({selectedSlips.length})
                          </button>
                        </div>
                      </div>

                      {/* Slip Cards */}
                      <div className="space-y-4">
                        {groupGamesIntoSlips().map((slip) => (
                          <div key={slip.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            {/* Slip Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={selectedSlips.includes(slip.id)}
                                  onChange={() => handleSlipSelection(slip.id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <h4 className="text-lg font-bold text-gray-900">
                                  Slip({slip.slipNumber}) - {slip.originalCategory} Predictions
                                </h4>
                                <button
                                  onClick={() => handleToggleSlipExpansion(slip.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <svg className={`w-4 h-4 transform transition-transform ${expandedSlips.includes(slip.id) ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Slip Summary */}
                            <div className="mb-4 text-sm text-gray-600">
                              <p>{slip.games.length} games • Total Odds: {slip.totalOdds} • {new Date(slip.uploadDate).toLocaleDateString()}, {new Date(slip.uploadDate).toLocaleTimeString()}</p>
                              <p>SportyBet: {slip.sportyCode} MSport: {slip.msportCode}</p>
                            </div>

                            {/* Individual Games */}
                            {expandedSlips.includes(slip.id) && (
                              <div className="space-y-2">
                                {slip.games.map((game, index) => (
                                  <div key={game.id} className="bg-white rounded border border-gray-200 p-2">
                                    {/* Game Header */}
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center">
                                          <div className="text-sm font-medium text-gray-900">{game.match}</div>
                                          {/* Result Status Icon */}
                                          <div className="ml-1">
                                            {game.result === 'Won' && (
                                              <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            )}
                                            {game.result === 'Lost' && (
                                              <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            )}
                                            {game.result === 'Pending' && (
                                              <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            )}
                                            {!game.result && (
                                              <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          <div>{game.type === '1X2' ? 'Home' : game.type}</div>
                                          <div>{new Date(game.uploadDate).toLocaleDateString()}</div>
                                          <div>1X2</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">{game.odds}</span>
                                        <button
                                          onClick={() => handleEditGame(game)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </div>

                                    {/* Edit Result Section - Shows when editing this game */}
                                    {showEditModal && editingGame && editingGame.id === game.id && (
                                      <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex items-center justify-between">
                                          <div className="text-xs font-medium text-gray-700">Update Result:</div>
                                          
                                          {/* Result Action Buttons */}
                                          <div className="flex gap-1">
                                            {/* Won Button */}
                                            <button
                                              onClick={() => handleSaveResult('Won')}
                                              className="flex items-center justify-center px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold h-6"
                                            >
                                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                              <span className="text-xs font-bold">Won</span>
                                            </button>

                                            {/* Lost Button */}
                                            <button
                                              onClick={() => handleSaveResult('Lost')}
                                              className="flex items-center justify-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold h-6"
                                            >
                                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                              </svg>
                                              <span className="text-xs font-bold">Lost</span>
                                            </button>

                                            {/* Pending Button */}
                                            <button
                                              onClick={() => handleSaveResult('Pending')}
                                              className="flex items-center justify-center px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs font-bold h-6"
                                            >
                                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                              </svg>
                                              <span className="text-xs font-bold">Pending</span>
                                            </button>

                                            {/* Cancel Button */}
                                            <button
                                              onClick={handleCancelEdit}
                                              className="flex items-center justify-center px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs font-bold h-6"
                                            >
                                              <span className="text-xs font-bold">Cancel</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Other Categories Display
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Loaded Games from SportyBet</h3>
                        <button
                          onClick={() => setLoadedGames(prev => ({ ...prev, [selectedCategory]: [] }))}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Booking Code: {loadedBookings[selectedCategory].length > 0 ? loadedBookings[selectedCategory][loadedBookings[selectedCategory].length - 1].code : 'hjkk'}</span>
                      </div>
                      
                      <div className="space-y-0">
                        {loadedGames[selectedCategory].map((game: any, index: number) => (
                          <div key={game.id} className="py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-start">
                              <button 
                                onClick={() => removeGame(selectedCategory, game.id)}
                                className="text-gray-600 hover:text-red-600 mr-3 mt-1"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <div className="flex-1">
                                <div className="text-gray-400 text-sm mb-1">Home</div>
                                <div className="text-gray-900 font-semibold mb-1">{game.match}</div>
                                <div className="text-gray-500 text-sm">{game.type}</div>
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-gray-900">{game.odds}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Only show buttons section for non-Slips categories */}
                  {selectedCategory !== 'Slips' && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {loadedGames[selectedCategory].length} selections loaded
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        Total Odds: {loadedGames[selectedCategory].reduce((total: number, game: any) => total * game.odds, 1).toFixed(2)}
                      </span>
                      <div className="flex space-x-3 mt-2 relative">
                        <button 
                          onClick={handleAddBooking}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Add Booking
                        </button>
                        
                        <button 
                          onClick={handleSetPrice}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Set Price
                        </button>
                        
                        <button 
                          onClick={handleUpload}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Upload
                        </button>
                        
                        {/* Attach Booking Modal - Positioned above the button */}
                        {showBookingModal && selectedGame?.category === selectedCategory && (
                          <div className="absolute bottom-full right-0 mb-2 z-50">
                            <div className="bg-white rounded-lg p-4 w-80 shadow-lg border border-gray-200">
                              {/* Header */}
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-gray-900">Attach Booking</h3>
                                <button
                                  onClick={handleCancelBooking}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Form */}
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    SportyBet Code
                                  </label>
                                  <input
                                    type="text"
                                    value={sportyCode}
                                    onChange={(e) => setSportyCode(e.target.value)}
                                    placeholder="e.g. abcd"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    MSport Code
                                  </label>
                                  <input
                                    type="text"
                                    value={msportCode}
                                    onChange={(e) => setMsportCode(e.target.value)}
                                    placeholder="e.g. efgh"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex justify-end space-x-2 mt-4">
                                <button
                                  onClick={handleCancelBooking}
                                  className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleAttachBooking}
                                  className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                                >
                                  Attach
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Set Price Modal - Positioned above the button */}
                        {showPriceModal && (
                          <div className="absolute bottom-full right-0 mb-2 z-50">
                            <div className="bg-white rounded-lg p-4 w-80 shadow-lg border border-gray-200">
                              {/* Header */}
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-bold text-gray-900">Set Price</h3>
                                <button
                                  onClick={handleCancelPrice}
                                  className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                  <FaTimes className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Form */}
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Game Price
                                  </label>
                                  <input
                                    type="text"
                                    value={gamePrice}
                                    onChange={(e) => setGamePrice(e.target.value)}
                                    placeholder="e.g. GHS 20"
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex justify-end space-x-2 mt-4">
                                <button
                                  onClick={handleCancelPrice}
                                  className="px-3 py-1.5 text-xs text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSavePrice}
                                  className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
                                >
                                  Save Price
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gamesControl' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">VIP Games Control</h2>
              
              {/* VIP Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {vipPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{plan.name}</h3>
                      
                      {/* Status Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-medium text-white ${
                            plan.status === 'Available'
                              ? 'bg-green-600'
                              : 'bg-orange-600'
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>
                      
                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleVipPlanStatus(plan.id)}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                          plan.status === 'Available'
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {plan.status === 'Available' ? 'Sold Out' : 'Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              
              {/* User Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          USER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMAIL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PHONE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {getInitials(user.name)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
              <p className="text-gray-600">Notifications interface will go here.</p>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">SMS Broadcasting</h2>
              
              {/* Send SMS Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Send SMS</h3>
                
                {/* Recipients Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Recipients
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recipients"
                        value="all"
                        checked={smsRecipients === 'all'}
                        onChange={(e) => setSmsRecipients(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        All Users (1,234 recipients)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="recipients"
                        value="custom"
                        checked={smsRecipients === 'custom'}
                        onChange={(e) => setSmsRecipients(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Custom Numbers
                      </span>
                    </label>
                  </div>
                </div>

                {/* Message Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Message
                  </label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Type your message here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  />
                </div>

                {/* Send SMS Button */}
                <button 
                  onClick={handleSendSMS}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Send SMS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Settings & Admin Management</h2>
                <button 
                  onClick={() => setShowAddAdminModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Admin
                </button>
              </div>
              
              {/* Current Admins Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Current Admins</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ADMIN
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ROLE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          LAST ACTIVE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-sm font-medium text-white">
                                    {getInitials(admin.username)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {admin.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {admin.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={admin.role}
                              onChange={(e) => handleChangeAdminRole(admin.id, e.target.value)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                                admin.role === 'full' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              <option value="limited">Limited</option>
                              <option value="full">Full Access</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.createdDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleAdminStatus(admin.id)}
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                admin.status === 'active' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {admin.status}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Add New Admin Modal */}
              {showAddAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Add New Admin</h3>
                      <button
                        onClick={() => setShowAddAdminModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          value={newAdmin.username}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={newAdmin.role}
                          onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="limited">Limited Access</option>
                          <option value="full">Full Access</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Limited: Can manage games and users. Full: Can manage everything including other admins.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowAddAdminModal(false)}
                        className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddAdmin}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      >
                        Add Admin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}