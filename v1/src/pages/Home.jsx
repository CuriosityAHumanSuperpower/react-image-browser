// Home Page Component
import React from 'react';
import * as RB from 'react-bootstrap';

function Home({
  folders,
  query,
  setQuery,
  selectedRootPath,
  cols,
  setCols,
  theme,
  setTheme,
  selected,
  setSelected,
  showOffcanvas,
  setShowOffcanvas,
  modalImg,
  setModalImg,
  lastSelectedUrl,
  setLastSelectedUrl,
  modalIndex,
  setModalIndex,
  sentinelRefs,
  fileInputRef,
  openFilePicker,
  onFolderInput,
  selectRange,
  toggleSelect,
  selectAllToggle,
  downloadSelected,
  copyToClipboard,
  registerSentinel,
  filteredFiles,
  visibleFiles,
  openModalAt,
  showNext,
  showPrev,
  openFolderAnchor,
}) {
  return (
    <div data-bs-theme={theme}>
      <RB.Navbar bg="light" expand="lg" className="mb-3 sticky-top shadow-sm navbar">
        <div className="container-fluid">
          <RB.Navbar.Brand href="#">Local Images Browser</RB.Navbar.Brand>
          <RB.Navbar.Toggle aria-controls="nav" />
          <RB.Navbar.Collapse id="nav">
            <RB.Nav className="me-auto">
            </RB.Nav>
            <div className="d-flex align-items-center">
              <div className="btn-group btn-group-sm me-2" role="group" aria-label="Browse and folders">
                <RB.Button variant="outline-secondary" size="sm" onClick={openFilePicker} aria-label="Browse a folder">Browse</RB.Button>
                <RB.Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowOffcanvas(true)}
                  aria-label="Folders"
                  disabled={folders.length === 0}
                  title={folders.length === 0 ? 'Load a folder first' : 'Open folders list'}
                >
                  Folders
                </RB.Button>
              </div>
              <input ref={fileInputRef} type="file" webkitdirectory="" directory="" multiple style={{ display: 'none' }} onChange={onFolderInput} />
            </div>
          </RB.Navbar.Collapse>
        </div>
      </RB.Navbar>

      {selectedRootPath && (
        <div className="container">
          <div className="small text-muted mb-2">Selected folder: {selectedRootPath}</div>
        </div>
      )}

      <div className="container" onClick={(e) => {
        if (e.target === e.currentTarget && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
          setSelected(new Set());
          setLastSelectedUrl(null);
        }
      }}>
        {folders.length === 0 && (
          <div className="alert alert-info">No images loaded. Use the <button type="button" className="btn btn-link p-0 align-baseline" onClick={openFilePicker}>folder button</button> to pick images. Works offline and runs from this file.</div>
        )}
        {folders.map(folder => {
          const id = encodeURIComponent(folder.name);
          const files = filteredFiles(folder.files).slice(0, folder.displayed);
          return (
            <div key={folder.name} id={'folder-' + id}>
              <h5 className="folder-title">{folder.name} <small className="text-muted">({folder.files.length})</small></h5>
              <div className="gallery mb-3" onClick={(e) => {
                if (e.target === e.currentTarget && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  setSelected(new Set());
                  setLastSelectedUrl(null);
                }
              }}>
                {files.map(it => (
                  <div className={`thumb ${selected.has(it.url) ? 'selected' : ''}`} key={it.url}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (e.ctrlKey || e.metaKey) {
                        setSelected(prev => {
                          const s = new Set(prev);
                          if (s.has(it.url)) s.delete(it.url); else s.add(it.url);
                          return s;
                        });
                        setLastSelectedUrl(it.url);
                      } else if (e.shiftKey) {
                        if (lastSelectedUrl) {
                          selectRange(lastSelectedUrl, it.url);
                        } else {
                          setSelected(prev => {
                            const s = new Set(prev);
                            s.add(it.url);
                            return s;
                          });
                          setLastSelectedUrl(it.url);
                        }
                      } else {
                        openModalAt(it);
                      }
                    }}
                  >
                    <img src={it.url} loading="lazy" alt={it.name} />
                  </div>
                ))}
              </div>
              <div ref={el => registerSentinel(folder.name, el)} data-folder={folder.name} style={{ height: 1 }}></div>
            </div>
          );
        })}
      </div>

      <RB.Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <RB.Offcanvas.Header closeButton>
          <RB.Offcanvas.Title>📂 Folders</RB.Offcanvas.Title>
        </RB.Offcanvas.Header>
        <RB.Offcanvas.Body>
          <div className="list-group">
            {folders.map(f => {
              const id = encodeURIComponent(f.name);
              return (
                <a key={f.name} href={`#folder-${id}`} className="list-group-item list-group-item-action folder-link" onClick={() => setShowOffcanvas(false)}>{f.name} <span className="text-muted">({f.files.length})</span></a>
              );
            })}
          </div>
        </RB.Offcanvas.Body>
      </RB.Offcanvas>

      <RB.Modal show={!!modalImg} onHide={() => { setModalImg(null); setModalIndex(null); }} fullscreen centered>
        <RB.Modal.Header closeButton>
          <RB.Modal.Title>{modalImg?.name}</RB.Modal.Title>
        </RB.Modal.Header>
        <RB.Modal.Body className="modal-image-body">
          <div className="modal-image-wrap">
            <div className="nav-zone left" onClick={showPrev} aria-hidden="true"></div>
            {modalImg && <img src={modalImg.url} alt={modalImg.name} />}
            <div className="nav-zone right" onClick={showNext} aria-hidden="true"></div>
          </div>
        </RB.Modal.Body>
      </RB.Modal>

      <div className="fixed-footer d-flex align-items-center justify-content-between">
        <RB.Dropdown drop="up" align="end">
          <RB.Dropdown.Toggle variant="secondary" id="actionsDrop" size="sm">
            ⚙️ Actions
          </RB.Dropdown.Toggle>
          <RB.Dropdown.Menu className="p-3" style={{ minWidth: 260 }}>
            <div className="mb-2">
              <label className="d-flex align-items-center gap-2 mb-1"><strong>Columns:</strong>
                <input type="range" min="1" max="6" value={cols} onChange={e => setCols(Number(e.target.value))} />
                <span className="ms-1">{cols}</span>
              </label>
            </div>
            <RB.Dropdown.Divider />
            <div className="mb-2 d-flex gap-2 btn-group" role="group" aria-label="Theme selection">
              <button className="btn btn-outline-secondary btn-sm" title="Light theme" onClick={() => setTheme('light')} style={{ flex: 1, opacity: theme === 'light' ? 1 : 0.5 }}>☀️</button>
              <button className="btn btn-outline-secondary btn-sm" title="Dark theme" onClick={() => setTheme('dark')} style={{ flex: 1, opacity: theme === 'dark' ? 1 : 0.5 }}>🌙</button>
            </div>
            <RB.Dropdown.Divider />
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={downloadSelected}>📥 Download</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={copyToClipboard}>📋 Copy</button>
            </div>
          </RB.Dropdown.Menu>
        </RB.Dropdown>
        <div className="d-flex align-items-center gap-2">
          {selected.size > 0 ? (
            <>
              <small className="text-muted">{selected.size} selected •</small>
              <a href="#" className="text-primary" style={{ textDecoration: 'underline', fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); setSelected(new Set()); setLastSelectedUrl(null); }}>unselect all</a>
            </>
          ) : (
            <small className="text-muted">{folders.reduce((acc, f) => acc + f.files.length, 0)} total images</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;