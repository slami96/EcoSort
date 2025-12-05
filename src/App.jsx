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
  const [loading, setLoading] = useState(true);
  const [totalImpact, setTotalImpact] = useState(1247); // Example counter

  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all recycling items
        const itemsQuery = '*[_type == "recyclingItem"] | order(name asc)';
        const itemsData = await client.fetch(itemsQuery);
        setItems(itemsData);
        setFilteredItems(itemsData);

        // Extract unique categories
        const uniqueCategories = [...new Set(itemsData.map(item => item.category))];
        
        // Create category objects with counts
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

  // Search and filter functionality
  useEffect(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  // Get category icon
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

  // Get category description
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

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setTotalImpact(prev => prev + 1); // Increment impact counter
  };

  // Close modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedItem) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedItem]);

  return (
    <div className="app">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="header">
        <h1>EcoSort</h1>
        <p>Your intelligent guide to sustainable recycling</p>
      </header>

      <main id="main-content" className="container">
        {/* Search Section */}
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
        </section>

        {/* Loading State */}
        {loading && (
          <div className="loading" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p>Loading recycling guide...</p>
          </div>
        )}

        {/* Categories Section */}
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

        {/* Active Filter Display */}
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

        {/* Items Grid */}
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

        {/* Empty State */}
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

        {/* Stats Section */}
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

      {/* Footer */}
      <footer className="footer">
        <p>EcoSort - Making recycling simple and sustainable</p>
        <p>Together we can make a difference 🌍</p>
      </footer>
    </div>
  );
}

export default App;
