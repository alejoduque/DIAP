// script.js — Full version with draggable modules injected
document.addEventListener('DOMContentLoaded', () => {
  // main DOM elements
  const panel = document.getElementById('panel');
  const tooltip = document.getElementById('tooltip');
  const tipTitle = document.getElementById('tipTitle');
  const tipDesc = document.getElementById('tipDesc');
  const codeBlock = document.getElementById('codeBlock');
  const activeName = document.getElementById('activeName');
  const closeTip = document.getElementById('closeTip');
  const search = document.getElementById('search');

  // wallet UI elements
  const walletStatusEl = document.getElementById('walletStatus');
  const connectBtn = document.getElementById('connectWallet');
  const mockBtn = document.getElementById('mockConnect');
  const diagBtn = document.getElementById('diagBtn');

  // snippets (unchanged content)
  const snippets = {
    ingest: {
      title: 'generateWaveform & generateSpectrogram (no change)',
      desc: 'Mock data generators used to create waveform & spectrogram arrays.',
      code: `// generateWaveform (unchanged)
const generateWaveform = (duration, quality) => {
  return Array.from({ length: 100 }, (_, i) => {
    const noise = Math.random() * (1 - quality);
    const signal = Math.sin(i * 0.3) * quality + Math.sin(i * 0.1) * 0.5;
    return Math.max(-1, Math.min(1, signal + noise));
  });
};

// generateSpectrogram (unchanged)
const generateSpectrogram = (quality) => {
  return Array.from({ length: 20 }, (_, freq) =>
    Array.from({ length: 50 }, (_, time) => {
      const intensity = quality * Math.random() * (1 - freq * 0.02);
      return Math.max(0, intensity);
    })
  );
};`
    },
    preprocess: {
      title: 'BiodiversityMap / WaveformViz (no critical fixes)',
      desc: 'UI helpers for visualizing waveform, spectrogram and small map. No syntax errors here from the original file.',
      code: `// WaveformViz and SpectrogramViz are UI-only helpers and looked fine. Keep them as-is in TSX.`
    },
    scoring: {
      title: 'Corrected getCalculationSteps + values',
      desc: 'No syntax errors here; this builds the steps array used to compute the running token total.',
      code: `const getCalculationSteps = (rec) => [{
  id: 'duration', name: 'Análisis de Duración del Audio', value: Math.floor(rec.duration / 30), /* ... */ },
  /* ... other steps ... */
];`
    },
    token: {
      title: 'Fixed startCalculation (bug fixes: spread operators and history max)',
      desc: 'Primary fixes: use spread operator [...prev] (not [.prev]) and use Math.max(...history, current) instead of Math.max(.history, current). Also ensure tokenHistory updates use previous state correctly.',
      code: `const startCalculation = (selectedRecording) => {
  setRecording(selectedRecording);
  setIsCalculating(true);
  setCurrentStep(null);
  setCompletedSteps([]);
  setFinalTokens(0);
  setAnimationPhase('processing');
  setTokenHistory([1]);

  const steps = getCalculationSteps(selectedRecording);
  let runningTotal = 1;

  steps.forEach((step, index) => {
    setTimeout(() => {
      setCurrentStep(step.id);

      setTimeout(() => setShowModal(step.id), 200);

      setTimeout(() => {
        setShowModal(null);

        if (index === 0) {
          runningTotal = step.value;
        } else {
          runningTotal *= step.value;
        }

        // CORRECT: use spread operator to append to arrays
        setCompletedSteps(prev => [...prev, step.id]);

        const newTotal = Math.round(runningTotal);
        setFinalTokens(newTotal);

        // CORRECT: append to tokenHistory properly
        setTokenHistory(prev => [...prev, newTotal]);

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsCalculating(false);
            setAnimationPhase('complete');
            setCurrentStep(null);
          }, 500);
        }
      }, 2800);
    }, index * 3500);
  });
};`
    },
    tokenFlowChart: {
      title: 'Fixed TokenFlowChart — correct Math.max usage',
      desc: 'Compute a max value from history and current safely (avoid invalid `.history`).',
      code: `const TokenFlowChart = ({ history, current }) => {
  const maxVal = Math.max(...history, current);
  return (<div className="h-24 bg-gradient-to-r ...">
    {history.map((value, i) => {
      const height = Math.min((value / maxVal) * 60, 60);
      return (<div key={i} style={{ height: \`\${height}px\` }} />);
    })}
  </div>)
};`
    }
  };

  function showNode(key){
    const s = snippets[key];
    if(!s) return;
    tipTitle.textContent = s.title;
    tipDesc.textContent = s.desc;
    codeBlock.textContent = s.code;
    tooltip.style.display = 'block';
    activeName.textContent = key;
    const diagResults = document.getElementById('diagResults');
    if(diagResults) diagResults.style.display = 'none';
  }
  function hideTip(){ tooltip.style.display = 'none'; activeName.textContent = 'none'; }
  closeTip && (closeTip.onclick = hideTip);

  let currentSvgRoot = null;

  function wireSvgRoot(root){
    if(!root) return;
    const svgRoot = (root instanceof Document) ? root.documentElement : root;
    currentSvgRoot = svgRoot;

    const nodeEls = svgRoot.querySelectorAll('.node');
    nodeEls.forEach(el => {
      if(el.__wiredForTokenUI) return;
      el.__wiredForTokenUI = true;

      el.addEventListener('click', () => {
        const key = el.getAttribute('data-node') || el.closest('[data-node]')?.getAttribute('data-node');
        if(key) showNode(key);
      });

      el.addEventListener('mouseenter', () => {
        const key = el.getAttribute('data-node') || el.closest('[data-node]')?.getAttribute('data-node');
        const s = snippets[key];
        if(s){
          tipTitle.textContent = s.title;
          tipDesc.textContent = s.desc;
          codeBlock.textContent = s.code.split('\n').slice(0,6).join('\n') + '\n\n/* click to open full snippet */';
          tooltip.style.display = 'block';
        }
      });

      // ---- DRAGGABLE MODULE LOGIC INJECTED HERE ----
      let offset = { x: 0, y: 0 };
      let selectedElement = null;

      function getMousePosition(evt) {
        const CTM = svgRoot.getScreenCTM();
        return {
          x: (evt.clientX - CTM.e) / CTM.a,
          y: (evt.clientY - CTM.f) / CTM.d
        };
      }

      el.addEventListener('mousedown', (evt) => {
        selectedElement = el;
        offset = getMousePosition(evt);
        const transforms = selectedElement.transform.baseVal;
        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
          const translate = svgRoot.createSVGTransform();
          translate.setTranslate(0, 0);
          selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }
        offset.x -= selectedElement.transform.baseVal.getItem(0).matrix.e;
        offset.y -= selectedElement.transform.baseVal.getItem(0).matrix.f;
      });

      svgRoot.addEventListener('mousemove', (evt) => {
        if (selectedElement) {
          evt.preventDefault();
          const coord = getMousePosition(evt);
          selectedElement.transform.baseVal.getItem(0).setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
      });

      svgRoot.addEventListener('mouseup', () => {
        selectedElement = null;
      });
      svgRoot.addEventListener('mouseleave', () => {
        selectedElement = null;
      });
    });
  }

  const diagramEl = document.getElementById('diagram');
  if(diagramEl){
    const tag = diagramEl.tagName && diagramEl.tagName.toLowerCase();
    if(tag === 'object'){
      if(diagramEl.contentDocument && diagramEl.contentDocument.documentElement){
        wireSvgRoot(diagramEl.contentDocument);
      } else {
        diagramEl.addEventListener('load', () => {
          try{ wireSvgRoot(diagramEl.contentDocument); }
          catch(e){ console.warn('Failed to wire external SVG:', e); }
        });
      }
    } else {
      wireSvgRoot(diagramEl);
    }
  }

  search && search.addEventListener('input', (ev) => {
    const q = ev.target.value.trim().toLowerCase();
    if(!currentSvgRoot) return;
    const nodeEls = currentSvgRoot.querySelectorAll('.node');
    if(!q){
      nodeEls.forEach(n => { n.style.opacity = '1'; });
      return;
    }
    nodeEls.forEach(n => {
      const key = (n.getAttribute('data-node') || '').toLowerCase();
      const codeContains = snippets[key] && (snippets[key].code||'').toLowerCase().includes(q);
      n.style.opacity = (key.includes(q) || codeContains) ? '1' : '0.25';
    });
  });

  // ---------- Wallet / MetaMask logic ----------
  const walletState = { connected: false, account: null, chainId: null, mock: false };

  function updateWalletUI(message){
    if(message) walletStatusEl.textContent = message;
    else if(walletState.mock) walletStatusEl.textContent = `Simulated: ${walletState.account || '0xMOCK'}`;
    else if(walletState.connected) walletStatusEl.textContent = `Connected: ${walletState.account || 'unknown'} (chain ${walletState.chainId})`;
    else walletStatusEl.textContent = 'Not connected';
    connectBtn.textContent = walletState.connected && !walletState.mock ? 'Disconnect' : 'Connect Wallet';
  }

  async function connectWallet(){
    if(walletState.connected && !walletState.mock){
      walletState.connected = false; walletState.account = null; walletState.chainId = null; walletState.mock = false;
      updateWalletUI();
      return;
    }
    const eth = window.ethereum;
    if(!eth){
      updateWalletUI('MetaMask not detected. Install from https://metamask.io/');
      showDiagnosticText(['MetaMask not found on window.ethereum. Install the MetaMask extension.']);
      return;
    }
    try{
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if(Array.isArray(accounts) && accounts.length > 0){
        walletState.account = accounts[0];
        walletState.connected = true;
        walletState.chainId = eth.chainId || (await eth.request({ method: 'eth_chainId' }));
        walletState.mock = false;
        updateWalletUI();
        showDiagnosticText([`Connected to ${walletState.account} on chain ${walletState.chainId}`]);
        if(typeof eth.on === 'function'){
          eth.on('accountsChanged', handleAccountsChanged);
          eth.on('chainChanged', handleChainChanged);
        }
      } else {
        updateWalletUI('No accounts returned.');
      }
    }catch(err){
      console.error('MetaMask connect error', err);
      updateWalletUI('Failed to connect to MetaMask');
    }
  }

  function handleAccountsChanged(accounts){
    if(!accounts || accounts.length === 0){
      walletState.connected = false; walletState.account = null; updateWalletUI('No accounts available');
    } else { walletState.account = accounts[0]; walletState.connected = true; updateWalletUI(); }
  }
  function handleChainChanged(chainId){ walletState.chainId = chainId; updateWalletUI(); }

  function simulateConnect(){
    walletState.mock = true;
    walletState.connected = true;
    walletState.account = '0xMOCKDEADBEEF';
    walletState.chainId = '0x1';
    updateWalletUI('Simulated connection');
  }

  function showDiagnosticText(lines){
    const diag = document.getElementById('diagResults');
    if(!diag) return;
    diag.style.display = 'block';
    diag.innerText = lines.join('\n');
    tooltip.style.display = 'block';
  }

  async function runDiagnostics(){
    const out = [];
    const eth = window.ethereum;
    out.push(`userAgent: ${navigator.userAgent}`);
    if(!eth){
      out.push('No injected provider detected.');
      showDiagnosticText(out);
      return;
    }
    out.push('Ethereum provider detected.');
    const accounts = await eth.request({ method: 'eth_accounts' });
    out.push(`eth_accounts: ${accounts}`);
    const chainId = eth.chainId || await eth.request({ method: 'eth_chainId' });
    out.push(`chainId: ${chainId}`);
    showDiagnosticText(out);
  }

  connectBtn && connectBtn.addEventListener('click', connectWallet);
  mockBtn && mockBtn.addEventListener('click', simulateConnect);
  diagBtn && diagBtn.addEventListener('click', runDiagnostics);
  updateWalletUI();

  if(window.ethereum && typeof window.ethereum.on === 'function'){
    try{
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }catch(e){ console.warn('Failed to attach provider listeners', e); }
  }
});
