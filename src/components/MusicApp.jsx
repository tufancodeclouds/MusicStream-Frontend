import React, { useState, useEffect } from 'react';
import { Search, Music2, Play, ExternalLink, Loader2 } from 'lucide-react';

const MusicApp = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const searchSongs = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSongs([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (data.status) {
        setSongs(data.songs);
      } else {
        setError(data.message || 'No songs found');
        setSongs([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server. Please try again later.');
      setSongs([]);
    }

    setLoading(false);
  };

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchSongs(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerFlex}>
            <div style={styles.logo}>
              <Music2 style={styles.logoIcon} />
            </div>
            <div>
              <h1 style={styles.title}>MusicStream</h1>
              <p style={styles.subtitle}>Discover music from YouTube</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <div style={styles.searchGlow}></div>
          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>
              <Search style={{ width: 24, height: 24 }} />
            </div>
            <input
              type="text"
              placeholder="Search songs, artists or albums"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.input}
            />
            {loading && (
              <div style={styles.searchingIndicator}>
                <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <Loader2 style={{ ...styles.loadingIcon, animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Searching for music...</p>
          </div>
        )}

        {/* Results */}
        {!loading && songs.length > 0 && (
          <div>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>
                Found {songs.length} results
              </h2>
            </div>

            <div style={styles.songGrid}>
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  style={{
                    ...styles.songCard,
                    animation: `slideIn 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div style={styles.songCardContent}>
                    {/* Thumbnail */}
                    <div style={styles.thumbnailWrapper}>
                      <img
                        src={song?.image?.[0] || '/placeholder.png'}
                        alt={song.name}
                        style={styles.thumbnail}
                      />
                      <div style={styles.playOverlay}>
                        <div style={styles.playButton}>
                          <Play style={styles.playIcon} />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={styles.songInfo}>
                      <div>
                        <h3 style={styles.songName}>{song.name}</h3>
                        <p style={styles.artistName}>
                          <Music2 style={styles.artistIcon} />
                          {song.primaryArtists}
                        </p>
                      </div>

                      {/* Video Player */}
                      <div style={styles.videoWrapper}>
                        <div style={styles.videoContainer}>
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${song.id}`}
                            title={song.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={styles.iframe}
                          ></iframe>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={styles.actionsWrapper}>
                        <a
                          href={song.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.youtubeLink}
                        >
                          <ExternalLink style={styles.linkIcon} />
                          Watch on YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && query.trim() && songs.length === 0 && !error && (
          <div style={styles.centerContainer}>
            <div style={styles.messageBox}>
              <Music2 style={styles.messageIcon} />
              <h3 style={styles.messageTitle}>No results found</h3>
              <p style={styles.messageText}>
                Try searching with different keywords or check your spelling
              </p>
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!query.trim() && songs.length === 0 && (
          <div style={styles.centerContainer}>
            <div style={styles.messageBox}>
              <div style={styles.welcomeLogo}>
                <Music2 style={styles.welcomeIcon} />
              </div>
              <h3 style={styles.welcomeTitle}>Welcome to MusicStream</h3>
              <p style={styles.welcomeText}>
                Search for your favorite songs, artists, or albums and discover amazing music from YouTube
              </p>
              <div style={styles.tagsContainer}>
                {['Yoga Music', 'Classical', 'Meditation'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    style={styles.tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #ffffff99;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #581c87, #6b21a8, #4338ca)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backdropFilter: 'blur(12px)',
    background: 'rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  headerFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    background: 'linear-gradient(to bottom right, #c084fc, #f9a8d4)',
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
  logoIcon: {
    width: 32,
    height: 32,
    color: 'white',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  subtitle: {
    color: '#e9d5ff',
    fontSize: '14px',
    margin: '4px 0 0 0',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  searchWrapper: {
    marginBottom: '32px',
    position: 'relative',
  },
  searchGlow: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, #c084fc, #f9a8d4)',
    borderRadius: '16px',
    filter: 'blur(40px)',
    opacity: 0.5,
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
  },
  searchIcon: {
    paddingLeft: '24px',
    color: '#d8b4fe',
  },
  input: {
    flex: 1,
    background: 'transparent',
    color: 'white',
    padding: '20px 16px',
    fontSize: '18px',
    border: 'none',
    outline: 'none',
  },
  searchingIndicator: {
    padding: '0 24px',
    color: '#c084fc',
    display: 'flex',
    alignItems: 'center',
  },
  errorBox: {
    marginBottom: '24px',
    padding: '16px',
    background: 'rgba(239, 68, 68, 0.2)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
  },
  errorText: {
    color: '#fecaca',
    textAlign: 'center',
    margin: 0,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
  loadingIcon: {
    width: 64,
    height: 64,
    color: '#c084fc',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#e9d5ff',
    fontSize: '18px',
    margin: 0,
  },
  resultsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  resultsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  songGrid: {
    display: 'grid',
    gap: '16px',
  },
  songCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s',
  },
  songCardContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    padding: '16px',
  },
  thumbnailWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  thumbnail: {
    width: '160px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  playButton: {
    background: '#a855f7',
    padding: '12px',
    borderRadius: '50%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    transform: 'scale(0.9)',
    transition: 'transform 0.3s',
  },
  playIcon: {
    width: 24,
    height: 24,
    color: 'white',
    fill: 'white',
  },
  songInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  songName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  artistName: {
    color: '#d8b4fe',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  artistIcon: {
    width: 16,
    height: 16,
  },
  videoWrapper: {
    marginTop: '8px',
  },
  videoContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    paddingBottom: '56.25%',
    background: 'rgba(0, 0, 0, 0.4)',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  actionsWrapper: {
    marginTop: '16px',
    display: 'flex',
    gap: '8px',
  },
  youtubeLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: '8px',
    transition: 'all 0.3s',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  linkIcon: {
    width: 16,
    height: 16,
  },
  centerContainer: {
    textAlign: 'center',
    padding: '80px 0',
  },
  messageBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  messageIcon: {
    width: 64,
    height: 64,
    color: '#c084fc',
    margin: '0 auto 16px',
  },
  messageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
  },
  messageText: {
    color: '#e9d5ff',
    margin: 0,
  },
  welcomeLogo: {
    background: 'linear-gradient(to bottom right, #c084fc, #f9a8d4)',
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  welcomeIcon: {
    width: 40,
    height: 40,
    color: 'white',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
  },
  welcomeText: {
    color: '#e9d5ff',
    marginBottom: '24px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },
  tag: {
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#e9d5ff',
    borderRadius: '8px',
    transition: 'all 0.3s',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
  },
};

export default MusicApp;