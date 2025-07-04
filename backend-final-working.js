const http = require('http');
const url = require('url');

// Mock data
const mockResearch = [
  {
    _id: '1',
    title: 'Revolutionary Brain-Computer Interface Breakthrough',
    authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez'],
    abstract: 'This groundbreaking study demonstrates a 96% accuracy rate in brain-computer interface technology for paralyzed patients, representing a major leap forward in neurotech applications.',
    publicationDate: '2024-01-15',
    category: 'neurotech',
    citationCount: 145,
    doi: '10.1038/s41586-024-07123-4',
    journal: 'Nature',
    keywords: ['brain-computer interface', 'neural prosthetics', 'paralysis', 'neurotech'],
    status: 'published',
    impactScore: 9.2
  },
  {
    _id: '2',
    title: 'CRISPR 3.0: Precision Gene Editing with 99.7% Accuracy',
    authors: ['Dr. Lisa Wang', 'Dr. James Thompson'],
    abstract: 'New precision gene editing technique achieves unprecedented accuracy in treating genetic disorders, opening new possibilities for therapeutic applications.',
    publicationDate: '2024-02-20',
    category: 'gene-therapy',
    citationCount: 87,
    doi: '10.1126/science.abcd1234',
    journal: 'Science',
    keywords: ['CRISPR', 'gene editing', 'genetic disorders', 'precision medicine'],
    status: 'published',
    impactScore: 8.9
  },
  {
    _id: '3',
    title: 'AI Detects Alzheimer\'s Disease 15 Years Before Symptoms',
    authors: ['Dr. Emma Foster', 'Dr. Robert Kim'],
    abstract: 'Machine learning algorithm identifies early biomarkers of Alzheimer\'s disease with 94% accuracy, enabling unprecedented early intervention strategies.',
    publicationDate: '2024-03-10',
    category: 'ai-healthcare',
    citationCount: 203,
    doi: '10.1016/j.cell.2024.03.001',
    journal: 'Cell',
    keywords: ['Alzheimer\'s', 'early detection', 'machine learning', 'biomarkers'],
    status: 'published',
    impactScore: 9.5
  }
];

const mockUsers = [
  {
    _id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@stanford.edu',
    role: 'expert',
    expertise: ['neurotech', 'brain-computer interfaces'],
    institution: 'Stanford University',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '2',
    name: 'Prof. Michael Rodriguez',
    email: 'mrodriguez@jhu.edu',
    role: 'expert',
    expertise: ['gene therapy', 'CRISPR technology'],
    institution: 'Johns Hopkins University',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Mock admin users for user management
const mockAdminUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'researcher',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-01-20',
    researchCount: 12
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '2024-01-19',
    researchCount: 3
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@neuronova.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-12-01',
    lastActive: '2024-01-20',
    researchCount: 0
  },
  {
    id: '4',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@research.org',
    role: 'researcher',
    status: 'suspended',
    joinDate: '2023-11-20',
    lastActive: '2024-01-15',
    researchCount: 8
  },
  {
    id: '5',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@institute.edu',
    role: 'researcher',
    status: 'active',
    joinDate: '2023-12-15',
    lastActive: '2024-01-18',
    researchCount: 15
  },
  {
    id: '6',
    name: 'Mark Wilson',
    email: 'mark.wilson@company.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2023-10-05',
    lastActive: '2023-12-01',
    researchCount: 1
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  if (pathname === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'NeuroNova Backend is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }));
    
  } else if (pathname === '/api/research') {
    const { category, limit = 10, page = 1 } = query;
    let filteredResearch = mockResearch;
    
    if (category && category !== 'all') {
      filteredResearch = mockResearch.filter(r => r.category === category);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResearch = filteredResearch.slice(startIndex, endIndex);
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: paginatedResearch,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredResearch.length / limit),
        totalResults: filteredResearch.length,
        hasNextPage: endIndex < filteredResearch.length,
        hasPrevPage: page > 1
      }
    }));
    
  } else if (pathname.startsWith('/api/research/') && pathname !== '/api/research/stats') {
    const id = pathname.split('/')[3];
    const research = mockResearch.find(r => r._id === id);
    
    if (!research) {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        error: 'Research not found'
      }));
      return;
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: research
    }));
    
  } else if (pathname === '/api/research/stats') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        totalPapers: mockResearch.length,
        totalCitations: mockResearch.reduce((sum, r) => sum + r.citationCount, 0),
        averageImpactScore: mockResearch.reduce((sum, r) => sum + r.impactScore, 0) / mockResearch.length,
        categoriesCount: {
          neurotech: mockResearch.filter(r => r.category === 'neurotech').length,
          'gene-therapy': mockResearch.filter(r => r.category === 'gene-therapy').length,
          'ai-healthcare': mockResearch.filter(r => r.category === 'ai-healthcare').length
        }
      }
    }));
    
  } else if (pathname === '/api/search') {
    const { q: searchQuery, category, limit = 10 } = query;
    let results = mockResearch;
    
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      results = mockResearch.filter(r => 
        r.title.toLowerCase().includes(searchTerm) ||
        r.abstract.toLowerCase().includes(searchTerm) ||
        r.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
        r.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }
    
    if (category && category !== 'all') {
      results = results.filter(r => r.category === category);
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: results.slice(0, parseInt(limit)),
      query: searchQuery || '',
      totalResults: results.length
    }));
    
  } else if (pathname === '/api/experts') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockUsers.filter(u => u.role === 'expert')
    }));
    
  } else if (pathname === '/api/trending') {
    const trending = mockResearch
      .sort((a, b) => b.citationCount - a.citationCount)
      .slice(0, 5);
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: trending
    }));
    
  } else if (pathname === '/api/admin/users') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockAdminUsers
    }));
    
  } else if (pathname === '/api/admin/stats') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        totalUsers: mockAdminUsers.length,
        activeUsers: mockAdminUsers.filter(u => u.status === 'active').length,
        totalResearchers: mockAdminUsers.filter(u => u.role === 'researcher').length,
        totalPapers: mockResearch.length,
        totalCitations: mockResearch.reduce((sum, r) => sum + r.citationCount, 0)
      }
    }));
    
  } else if (pathname === '/api/admin/content') {
    const mockContentItems = [
      {
        id: '1',
        title: 'Novel Approach to Quantum Computing',
        type: 'research',
        author: 'Dr. Sarah Johnson',
        content: 'This research paper explores a novel approach to quantum computing using advanced algorithms that could revolutionize the field. The methodology involves...',
        status: 'pending',
        flagReason: 'Potential copyright issues - needs verification',
        submittedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        title: 'Discussion on AI Ethics in Healthcare',
        type: 'discussion',
        author: 'John Smith',
        content: 'I believe we need to consider the ethical implications of AI development in healthcare. The rapid advancement of AI technologies raises important questions about privacy, consent, and decision-making autonomy...',
        status: 'approved',
        submittedAt: '2024-01-19T15:45:00Z',
        reviewedAt: '2024-01-19T16:00:00Z',
        reviewedBy: 'Admin User'
      },
      {
        id: '3',
        title: 'Comment on Machine Learning Paper',
        type: 'comment',
        author: 'Dr. Michael Chen',
        content: 'This paper has some interesting insights, but I disagree with the methodology used in section 3. The sample size seems insufficient for the conclusions drawn...',
        status: 'pending',
        flagReason: 'Needs fact-checking on methodology claims',
        submittedAt: '2024-01-18T09:15:00Z'
      },
      {
        id: '4',
        title: 'Climate Change Research Data Analysis',
        type: 'research',
        author: 'Dr. Emily Davis',
        content: 'Our latest research on climate change patterns shows significant trends in global temperature variations. The data collected over the past decade indicates...',
        status: 'rejected',
        flagReason: 'Insufficient peer review documentation',
        submittedAt: '2024-01-17T14:20:00Z',
        reviewedAt: '2024-01-17T16:30:00Z',
        reviewedBy: 'Admin User'
      },
      {
        id: '5',
        title: 'Neural Network Architecture Discussion',
        type: 'discussion',
        author: 'Dr. Lisa Wang',
        content: 'The new transformer architecture proposed in the recent paper shows promising results. However, I think there are some optimization opportunities that were missed...',
        status: 'approved',
        submittedAt: '2024-01-16T11:20:00Z',
        reviewedAt: '2024-01-16T12:00:00Z',
        reviewedBy: 'Content Moderator'
      },
      {
        id: '6',
        title: 'Inappropriate Research Submission',
        type: 'research',
        author: 'Anonymous User',
        content: 'This content contains inappropriate material and violates community guidelines...',
        status: 'rejected',
        flagReason: 'Violates community guidelines - inappropriate content',
        submittedAt: '2024-01-15T08:30:00Z',
        reviewedAt: '2024-01-15T09:00:00Z',
        reviewedBy: 'Admin User'
      }
    ];
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockContentItems
    }));
    
  } else if (pathname === '/api/admin/content/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { contentIds } = JSON.parse(body);
        console.log('Approving content items:', contentIds);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: `Approved ${contentIds.length} content item(s)`,
          approvedIds: contentIds
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
    
  } else if (pathname === '/api/admin/content/reject' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { contentIds, reason } = JSON.parse(body);
        console.log('Rejecting content items:', contentIds, 'Reason:', reason);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: `Rejected ${contentIds.length} content item(s)`,
          rejectedIds: contentIds,
          reason: reason
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
    
  } else if (pathname.startsWith('/api/')) {
    // Catch all for API routes
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      message: `API endpoint ${pathname} is working`,
      method: req.method,
      timestamp: new Date().toISOString()
    }));
    
  } else {
    // 404 for non-API routes
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      error: 'Route not found',
      path: pathname,
      method: req.method,
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
🚀 NeuroNova Backend Server Started Successfully!
📍 Server running on: http://localhost:${PORT}
🔍 Health check: http://localhost:${PORT}/api/health
📊 Research data: http://localhost:${PORT}/api/research
🔍 Search endpoint: http://localhost:${PORT}/api/search
👥 Experts: http://localhost:${PORT}/api/experts
📈 Stats: http://localhost:${PORT}/api/research/stats
🔥 Trending: http://localhost:${PORT}/api/trending

Environment: ${process.env.NODE_ENV || 'development'}
Timestamp: ${new Date().toISOString()}
  `);
});

server.on('error', (err) => {
  console.error('Server error:', err);
}); 