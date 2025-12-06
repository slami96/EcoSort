import { useState, useEffect } from 'react';
import { client } from './sanityClient';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDanishGuide, setShowDanishGuide] = useState(false);
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalImpact, setTotalImpact] = useState(1247);

  // Danish bin data
  const danishBins = [
    {
      name: 'Plastic',
      danishName: 'Plast',
      image: 'https://www.vana.dk/media/jlpftyie/plast.webp',
      color: '#0066CC',
      canGo: [
        'Plastic bottles and containers',
        'Plastic bags and shopping bags',
        'Plastic trays and tubs',
        'Freezer bags',
        'Food packaging (emptied and scraped clean)'
      ],
      cannotGo: [
        'PVC materials',
        'Packaging with plant/insect poisons',
        'Plastic products with electronics',
        'Tarpaulins',
        'Dirty or contaminated plastic'
      ],
      tips: 'Empty and scrape clean all food packaging before recycling'
    },
    {
      name: 'Paper',
      danishName: 'Papir',
      image: 'https://www.vana.dk/media/moafbx1i/papir.webp',
      color: '#4A90E2',
      canGo: [
        'Newspapers and magazines',
        'Print advertising circulars',
        'Office paper',
        'Clean and dry paper',
        'Envelopes (windows OK)'
      ],
      cannotGo: [
        'Wet or dirty paper',
        'Paper with PFOS (perfluorinated substances)',
        'Tissue paper',
        'Paper towels',
        'Receipts (thermal paper)'
      ],
      tips: 'Keep paper clean and dry for best recycling quality'
    },
    {
      name: 'Cardboard',
      danishName: 'Pap',
      image: 'https://www.vana.dk/media/bgoijumk/pap.webp',
      color: '#8B6F47',
      canGo: [
        'Cardboard boxes',
        'Cardboard tubes (toilet/kitchen rolls)',
        'Cardboard from packaging',
        'Clean and dry cardboard',
        'Shipping boxes'
      ],
      cannotGo: [
        'Expanded polystyrene (foam)',
        'Wet or greasy cardboard',
        'Wax-coated cardboard',
        'Contaminated cardboard'
      ],
      tips: 'Flatten boxes to save space. Remove tape and plastic windows'
    },
    {
      name: 'Glass',
      danishName: 'Glas',
      image: 'https://www.vana.dk/media/oxnky0ju/glas.webp',
      color: '#2ECC71',
      canGo: [
        'Glass bottles and jars',
        'Wine bottles',
        'Food jars (emptied and scraped)',
        'Drinking glasses',
        'Broken glass from the above'
      ],
      cannotGo: [
        'Refractory dishes (Pyrex)',
        'Flat glass from windows',
        'Mirrors',
        'Light bulbs',
        'Ceramics or porcelain'
      ],
      tips: 'Remove lids and rinse clean. Labels can stay on'
    },
    {
      name: 'Metal',
      danishName: 'Metal',
      image: 'https://www.vana.dk/media/fsefhr13/metal.webp',
      color: '#95A5A6',
      canGo: [
        'Food and beverage cans',
        'Aluminum cans',
        'Steel cans',
        'Metal lids and caps',
        'Small metal objects'
      ],
      cannotGo: [
        'Electronics with metal',
        'Pressurized cylinders',
        'Hazardous waste packaging',
        'Large metal items',
        'Metal with electronics'
      ],
      tips: 'Empty and scrape clean. Plastic coatings are OK'
    },
    {
      name: 'Food & Drink Cartons',
      danishName: 'Mad- og drikkekartoner',
      image: 'https://www.vana.dk/media/egchhhdv/mad-og-drikkekartoner.webp',
      color: '#FF6B35',
      canGo: [
        'Milk cartons',
        'Juice cartons',
        'Tomato carton packaging',
        'Legume cartons',
        'Similar food carton packaging'
      ],
      cannotGo: [
        'Chips bags',
        'Coffee bags',
        'Other composite packaging',
        'Plastic-lined bags'
      ],
      tips: 'Empty contents completely. Rinse if possible'
    },
    {
      name: 'Food Waste',
      danishName: 'Mad',
      image: 'https://www.vana.dk/media/1qdj1phy/mad.webp',
      color: '#27AE60',
      canGo: [
        'Fruit and vegetable scraps',
        'Meat and fish residues',
        'Expired food',
        'Coffee filters and grounds',
        'Eggshells and peels'
      ],
      cannotGo: [
        'Packaging materials',
        'Cigarette butts',
        'Ashes',
        'Plastic bags',
        'Non-food items'
      ],
      tips: 'Keep separate from packaging. Use compostable bags if required'
    },
    {
      name: 'Hazardous Waste',
      danishName: 'Farligt affald',
      image: 'https://www.vana.dk/media/02yfqn2x/farligt-affald.webp',
      color: '#E74C3C',
      canGo: [
        'Paints and solvents',
        'Chlorine-containing detergents',
        'Batteries',
        'Aerosols',
        'Chemicals and pesticides'
      ],
      cannotGo: [
        'Fireworks',
        'Explosives',
        'Radioactive materials'
      ],
      tips: 'Take to designated hazardous waste collection points. Never mix with regular waste'
    },
    {
      name: 'Textiles',
      danishName: 'Tekstil',
      image: 'https://www.vana.dk/media/dgxnji33/tekstil.webp',
      color: '#9B59B6',
      canGo: [
        'Worn-out clothes',
        'Torn textiles',
        'Old towels and curtains',
        'Stained fabric',
        'Destroyed clothing'
      ],
      cannotGo: [
        'Shoes, belts, and bags',
        'Reusable clothing (donate instead)',
        'Wet textiles',
        'Textiles with chemicals/oil stains',
        'Textiles with food debris or soil'
      ],
      tips: 'Donate wearable items. Only recycle truly damaged textiles'
    },
    {
      name: 'Residual Waste',
      danishName: 'Rest',
      image: 'https://www.vana.dk/media/0p2jqywi/rest.webp',
      color: '#34495E',
      canGo: [
        'Non-recyclable waste',
        'Mixed materials',
        'Contaminated items',
        'Items not fitting other categories'
      ],
      cannotGo: [
        'Recyclable materials',
        'Hazardous waste',
        'Items covered by producer responsibility'
      ],
      tips: 'This is the last resort. Try to recycle or properly dispose via other bins first'
    }
  ];

  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsQuery = '*[_type == "recyclingItem"] | order(name asc)';
        const itemsData = await client.fetch(itemsQuery);
        setItems(itemsData);
        setFilteredItems(itemsData);

        const uniqueCategories = [...new Set(itemsData.map(item => item.category))];
        const categoriesData = uniqueCategories.map(cat => ({
          name: cat,
          count: itemsData.filter(item => item.category === cat).length,
          icon: getCategoryIcon(cat),
          description: getCategoryDescription(cat)
        }));
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Plastic': '♻️',
      'Paper': '📄',
      'Glass': '🥫',
      'Metal': '🔧',
      'Electronics': '💻',
      'Organic': '🌱',
      'Textiles': '👕',
      'Batteries': '🔋',
      'Hazardous': '⚠️'
    };
    return icons[category] || '📦';
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Plastic': 'Bottles, containers, packaging materials',
      'Paper': 'Newspapers, cardboard, office paper',
      'Glass': 'Bottles, jars, containers',
      'Metal': 'Cans, foil, scrap metal',
      'Electronics': 'Devices, cables, batteries',
      'Organic': 'Food waste, yard trimmings',
      'Textiles': 'Clothing, fabric, linens',
      'Batteries': 'Rechargeable and single-use',
      'Hazardous': 'Paint, chemicals, oils'
    };
    return descriptions[category] || 'Various recyclable items';
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setTotalImpact(prev => prev + 1);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openDanishGuide = () => {
    setShowDanishGuide(true);
    setSelectedBin(null);
  };

  const closeDanishGuide = () => {
    setShowDanishGuide(false);
    setSelectedBin(null);
  };

  const handleBinClick = (bin) => {
    setSelectedBin(bin);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (selectedItem) closeModal();
        if (showDanishGuide) closeDanishGuide();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedItem, showDanishGuide]);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="header">
        <h1>EcoSort</h1>
        <p>Your intelligent guide to sustainable recycling</p>
      </header>

      <main id="main-content" className="container">
        <section className="search-section" aria-label="Search recycling items">
          <div className="search-container">
            <input
              type="search"
              className="search-input"
              placeholder="Search for an item to recycle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search recycling items"
            />
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Danish Sorting Guide Button */}
          <div className="danish-guide-banner">
            <div className="danish-guide-content">
              <span className="danish-flag">🇩🇰</span>
              <div>
                <h3>Sorting in Denmark?</h3>
                <p>Learn about the 10 official Danish waste categories</p>
              </div>
            </div>
            <button 
              className="danish-guide-button"
              onClick={openDanishGuide}
              aria-label="View Danish sorting guide"
            >
              View Guide →
            </button>
          </div>
        </section>

        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>Loading recycling guide...</p>
          </div>
        )}

        {!loading && !searchQuery && !selectedCategory && (
          <section aria-label="Recycling categories">
            <h2 className="section-title">Browse by Category</h2>
            <div className="category-grid">
              {categories.map((category) => (
                <article
                  key={category.name}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.name)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(category.name);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${category.name} recycling items`}
                >
                  <div className="category-card-content">
                    <span className="category-icon" aria-hidden="true">{category.icon}</span>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="category-count">{category.count} items</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {selectedCategory && (
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              aria-label="Clear category filter"
            >
              ← Back to all categories
            </button>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <section aria-label="Recycling items">
            <h2 className="section-title">
              {selectedCategory ? `${selectedCategory} Items` : searchQuery ? 'Search Results' : 'All Items'}
            </h2>
            <div className="items-grid">
              {filteredItems.map((item) => (
                <article
                  key={item._id}
                  className="item-card"
                  onClick={() => handleItemClick(item)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleItemClick(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn more about recycling ${item.name}`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="item-image"
                      loading="lazy"
                    />
                  )}
                  <div className="item-content">
                    <span className="item-category-badge" aria-label={`Category: ${item.category}`}>
                      {item.category}
                    </span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="empty-state" role="status" aria-live="polite">
            <div className="empty-state-icon" aria-hidden="true">🔍</div>
            <h2>No items found</h2>
            <p>Try adjusting your search or browse all categories</p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                style={{
                  marginTop: '1rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && (
          <section className="stats-section" aria-label="Recycling impact">
            <div className="stats-content">
              <h2>Community Impact</h2>
              <p>Items helped recycle together</p>
              <div className="stats-number" aria-live="polite">{totalImpact.toLocaleString()}</div>
              <p>Every item recycled makes a difference! 🌍</p>
            </div>
          </section>
        )}
      </main>

      {/* Danish Guide Modal */}
      {showDanishGuide && (
        <div
          className="modal-overlay"
          onClick={closeDanishGuide}
          role="dialog"
          aria-modal="true"
          aria-labelledby="danish-guide-title"
        >
          <div className="modal danish-guide-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeDanishGuide}
              aria-label="Close dialog"
            >
              ×
            </button>
            
            {!selectedBin ? (
              <>
                <h2 id="danish-guide-title">
                  🇩🇰 Danish Waste Sorting Guide
                </h2>
                <p>
                  Denmark has 10 official waste fractions. Click any bin to learn more.
                </p>
                
                <div className="danish-bins-grid">
                  {danishBins.map((bin) => (
                    <div
                      key={bin.name}
                      className="danish-bin-card"
                      onClick={() => handleBinClick(bin)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleBinClick(bin);
                        }
                      }}
                    >
                      <img src={bin.image} alt={`${bin.danishName} bin`} className="danish-bin-image" />
                      <h3>{bin.danishName}</h3>
                      <p>{bin.name}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedBin(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ← Back to all bins
                </button>

                <div className="bin-header-wrapper">
                  <div className="bin-header-image">
                    <img 
                      src={selectedBin.image} 
                      alt={`${selectedBin.danishName} bin`}
                    />
                    <h2>{selectedBin.danishName}</h2>
                    <p>{selectedBin.name}</p>
                  </div>

                  <div className="bin-details">
                    <div className="bin-section">
                      <h3 style={{ color: '#27AE60' }}>✅ What CAN go here:</h3>
                      <ul>
                        {selectedBin.canGo.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bin-section">
                      <h3 style={{ color: '#E74C3C' }}>❌ What CANNOT go here:</h3>
                      <ul>
                        {selectedBin.cannotGo.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bin-section">
                      <h3 style={{ color: 'var(--primary)' }}>💡 Pro Tip:</h3>
                      <p>{selectedBin.tips}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close dialog"
            >
              ×
            </button>
            
            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt=""
                className="modal-image"
              />
            )}
            
            <div className="modal-content">
              <span className="modal-category-badge" aria-label={`Category: ${selectedItem.category}`}>
                {selectedItem.category}
              </span>
              
              <h2 id="modal-title">{selectedItem.name}</h2>
              
              <div className="modal-section">
                <h3>📋 Description</h3>
                <p>{selectedItem.description}</p>
              </div>
              
              {selectedItem.howToRecycle && (
                <div className="modal-section">
                  <h3>♻️ How to Recycle</h3>
                  <p>{selectedItem.howToRecycle}</p>
                </div>
              )}
              
              {selectedItem.preparation && (
                <div className="modal-section">
                  <h3>🧹 Preparation Steps</h3>
                  <ul>
                    {selectedItem.preparation.split('\n').map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedItem.tips && (
                <div className="modal-section">
                  <h3>💡 Sustainability Tips</h3>
                  <p>{selectedItem.tips}</p>
                </div>
              )}
              
              {selectedItem.impact && (
                <div className="modal-section">
                  <div className="impact-badge" role="status">
                    <span aria-hidden="true">🌱</span>
                    <span>{selectedItem.impact}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>EcoSort - Making recycling simple and sustainable</p>
        <p>Together we can make a difference 🌍</p>
      </footer>
    </div>
  );
}

export default App;
