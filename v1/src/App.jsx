// React App Component
import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { NotificationProvider, NotificationContext } from './components/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import People from './pages/People';
import Map from './pages/Map';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Notification from './components/Notification';
import * as RB from 'react-bootstrap';

function App() {
  const [folders, setFolders] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedRootPath, setSelectedRootPath] = useState('');
  const [cols, setCols] = useState(5);
  const [theme, setTheme] = useState('dark');
  const [selected, setSelected] = useState(new Set());
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [lastSelectedUrl, setLastSelectedUrl] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const sentinelRefs = useRef(new Map());
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }, [theme]);

  useEffect(() => {
    function onKey(e) {
      const key = e.key || '';
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'a') {
        e.preventDefault();
        const s = new Set();
        folders.forEach(f => f.files.forEach(it => s.add(it.url)));
        setSelected(s);
        return;
      }
      if (key === 'Escape') {
        setSelected(new Set());
        setLastSelectedUrl(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [folders]);

  function openFilePicker() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleFiles(fileList) {
    const incoming = Array.from(fileList).filter(f => f.type.startsWith('image') || /\.(heic|heif)$/i.test(f.name));
    const map = new Map();
    const relPaths = [];
    incoming.forEach(f => {
      const full = f.webkitRelativePath || f.name;
      const parts = full.split('/');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '/';
      const name = parts[parts.length - 1];
      let url;
      let entry;
      if (/\.(heic|heif)$/i.test(name)) {
        const short = name.length > 24 ? name.slice(0, 20) + '...' : name;
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='#0e1113' width='100%' height='100%'/><text x='50%' y='50%' fill='#dfe8ef' font-family='Roboto, Arial, sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle'>${short}</text></svg>`;
        url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        entry = { file: f, url, name, folderPath: folder, placeholder: true };
      } else {
        url = URL.createObjectURL(f);
        entry = { file: f, url, name, folderPath: folder };
      }
      if (!map.has(folder)) map.set(folder, []);
      map.get(folder).push(entry);
      if (f.webkitRelativePath) relPaths.push(f.webkitRelativePath);
    });
    const arr = Array.from(map.entries()).map(([k, v]) => ({ name: k, files: v, displayed: Math.min(30, v.length) }));
    arr.sort((a, b) => a.name.localeCompare(b.name));
    setFolders(arr);
    setSelected(new Set());
    let common = '';
    if (relPaths.length) {
      const splitPaths = relPaths.map(p => p.split('/'));
      const minLen = Math.min(...splitPaths.map(s => s.length));
      let i = 0;
      while (i < minLen) {
        const seg = splitPaths[0][i];
        if (splitPaths.every(sp => sp[i] === seg)) i++; else break;
      }
      common = splitPaths[0].slice(0, i).join('/');
    }
    setSelectedRootPath(common || '');
  }

  function onFolderInput(e) {
    handleFiles(e.target.files);
  }

  function selectRange(fromUrl, toUrl) {
    const allFiles = [];
    folders.forEach(f => f.files.forEach(it => allFiles.push(it.url)));
    const fromIdx = allFiles.indexOf(fromUrl);
    const toIdx = allFiles.indexOf(toUrl);
    if (fromIdx === -1 || toIdx === -1) return;
    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);
    const newSelected = new Set(selected);
    for (let i = start; i <= end; i++) {
      newSelected.add(allFiles[i]);
    }
    setSelected(newSelected);
    setLastSelectedUrl(toUrl);
  }

  function toggleSelect(url, keepSelection = false) {
    setSelected(prev => {
      const s = new Set(prev);
      if (keepSelection && s.has(url)) {
        s.delete(url);
      } else if (!keepSelection) {
        s.clear();
        s.add(url);
      } else {
        s.add(url);
      }
      return s;
    });
    setLastSelectedUrl(url);
  }

  function selectAllToggle(checked) {
    if (checked) {
      const s = new Set();
      folders.forEach(f => f.files.forEach(it => s.add(it.url)));
      setSelected(s);
    } else setSelected(new Set());
  }

  async function downloadSelected() {
    if (selected.size === 0) {
      alert('No images selected');
      return;
    }
    const zip = new JSZip();
    const folder = zip.folder('images');
    const items = [];
    for (const f of folders) {
      for (const it of f.files) {
        if (selected.has(it.url)) items.push(it);
      }
    }
    for (const it of items) {
      if (it.placeholder) continue;
      const buf = await it.file.arrayBuffer();
      folder.file(it.name, buf);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-images.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    try {
      if (!navigator.clipboard || !navigator.clipboard.write) throw new Error('Clipboard API not supported for images');
      const items = [];
      for (const f of folders) {
        for (const it of f.files) {
          if (selected.has(it.url) && !it.placeholder) {
            const blob = await it.file.slice(0, it.file.size, it.file.type);
            items.push(new ClipboardItem({ [it.file.type]: blob }));
          }
        }
      }
      if (items.length === 0) {
        alert('No images selected');
        return;
      }
      await navigator.clipboard.write(items);
      alert('Copied selected images to clipboard (if supported by your browser).');
    } catch (err) {
      alert('Copy to clipboard not available. Falling back to ZIP download.');
      downloadSelected();
    }
  }

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          const id = ent.target.dataset.folder;
          setFolders(prev => prev.map(f => {
            if (f.name === id) {
              const newCount = Math.min(f.files.length, f.displayed + 30);
              return { ...f, displayed: newCount };
            }
            return f;
          }));
        }
      });
    }, { rootMargin: '200px' });
    sentinelRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [folders]);

  function registerSentinel(folder, el) {
    if (!el) sentinelRefs.current.delete(folder);
    else sentinelRefs.current.set(folder, el);
  }

  function filteredFiles(f) {
    if (!query) return f;
    const q = query.toLowerCase();
    return f.filter(it => it.name.toLowerCase().includes(q));
  }

  const visibleFiles = useMemo(() => {
    const arr = [];
    folders.forEach(f => {
      const list = filteredFiles(f.files);
      list.forEach(it => arr.push(it));
    });
    return arr;
  }, [folders, query]);

  function openModalAt(item) {
    const idx = visibleFiles.findIndex(x => x.url === item.url);
    const i = idx === -1 ? 0 : idx;
    setModalIndex(i);
    setModalImg(visibleFiles[i]);
  }

  function showNext() {
    if (!visibleFiles.length) return;
    const next = modalIndex === null ? 0 : (modalIndex + 1) % visibleFiles.length;
    setModalIndex(next);
    setModalImg(visibleFiles[next]);
  }

  function showPrev() {
    if (!visibleFiles.length) return;
    const prev = modalIndex === null ? visibleFiles.length - 1 : (modalIndex - 1 + visibleFiles.length) % visibleFiles.length;
    setModalIndex(prev);
    setModalImg(visibleFiles[prev]);
  }

  useEffect(() => {
    function onKeyNav(e) {
      if (!modalImg) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    }
    window.addEventListener('keydown', onKeyNav);
    return () => window.removeEventListener('keydown', onKeyNav);
  }, [modalImg, visibleFiles, modalIndex]);

  function openFolderAnchor(name) {
    setShowOffcanvas(false);
    setTimeout(() => {
      const id = encodeURIComponent(name);
      const el = document.getElementById('folder-' + id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 260);
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <div>
            <Navbar />
            <NotificationContainer />
            <Routes>
              <Route path="/" element={<Home 
                folders={folders}
                query={query}
                setQuery={setQuery}
                selectedRootPath={selectedRootPath}
                cols={cols}
                setCols={setCols}
                theme={theme}
                setTheme={setTheme}
                selected={selected}
                setSelected={setSelected}
                showOffcanvas={showOffcanvas}
                setShowOffcanvas={setShowOffcanvas}
                modalImg={modalImg}
                setModalImg={setModalImg}
                lastSelectedUrl={lastSelectedUrl}
                setLastSelectedUrl={setLastSelectedUrl}
                modalIndex={modalIndex}
                setModalIndex={setModalIndex}
                sentinelRefs={sentinelRefs}
                fileInputRef={fileInputRef}
                openFilePicker={openFilePicker}
                onFolderInput={onFolderInput}
                selectRange={selectRange}
                toggleSelect={toggleSelect}
                selectAllToggle={selectAllToggle}
                downloadSelected={downloadSelected}
                copyToClipboard={copyToClipboard}
                registerSentinel={registerSentinel}
                filteredFiles={filteredFiles}
                visibleFiles={visibleFiles}
                openModalAt={openModalAt}
                showNext={showNext}
                showPrev={showPrev}
                openFolderAnchor={openFolderAnchor}
              />} />
              <Route path="/people" element={<People />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default App;