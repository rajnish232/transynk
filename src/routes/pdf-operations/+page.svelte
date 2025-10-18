<script lang="ts">
  import { onMount } from 'svelte';
  import PDFMerger from '$lib/components/pdf/PDFMerger.svelte';
  import PDFSplitter from '$lib/components/pdf/PDFSplitter.svelte';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';

  let activeTab = 'merge';

  // PDF operation tabs
  const operations = [
    { id: 'merge', name: 'Merge PDFs', icon: '📄' },
    { id: 'split', name: 'Split PDF', icon: '✂️' },
    { id: 'rotate', name: 'Rotate Pages', icon: '🔄' },
    { id: 'extract', name: 'Extract Pages', icon: '🔍' },
    { id: 'compress', name: 'Compress PDF', icon: '🗜️' },
    { id: 'text', name: 'Add Text', icon: '✏️' },
    { id: 'image', name: 'Add Image', icon: '🖼️' }
  ];

  function switchTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class="pdf-operations-page">
  <Header />

  <main class="main-content">
    <div class="container">
      <div class="page-header">
        <h1>PDF Operations</h1>
        <p>Process and manipulate your PDF files with powerful tools</p>
      </div>

      <div class="operations-grid">
        <div class="operations-sidebar">
          <h3>Tools</h3>
          <nav class="operations-nav">
            {#each operations as operation}
              <button
                class="operation-tab"
                class:active={activeTab === operation.id}
                on:click={() => switchTab(operation.id)}
              >
                <span class="tab-icon">{operation.icon}</span>
                <span class="tab-name">{operation.name}</span>
              </button>
            {/each}
          </nav>
        </div>

        <div class="operations-content">
          {#if activeTab === 'merge'}
            <PDFMerger />
          {:else if activeTab === 'split'}
            <PDFSplitter />
          {:else if activeTab === 'rotate'}
            <div class="coming-soon">
              <h3>🔄 Rotate Pages</h3>
              <p>Coming soon! This feature will allow you to rotate PDF pages by 90°, 180°, or 270°.</p>
            </div>
          {:else if activeTab === 'extract'}
            <div class="coming-soon">
              <h3>🔍 Extract Pages</h3>
              <p>Coming soon! This feature will allow you to extract specific pages from your PDF.</p>
            </div>
          {:else if activeTab === 'compress'}
            <div class="coming-soon">
              <h3>🗜️ Compress PDF</h3>
              <p>Coming soon! This feature will help you reduce PDF file size while maintaining quality.</p>
            </div>
          {:else if activeTab === 'text'}
            <div class="coming-soon">
              <h3>✏️ Add Text</h3>
              <p>Coming soon! This feature will allow you to add text overlays to your PDF pages.</p>
            </div>
          {:else if activeTab === 'image'}
            <div class="coming-soon">
              <h3>🖼️ Add Image</h3>
              <p>Coming soon! This feature will allow you to add image overlays to your PDF pages.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>

  <Footer />
</div>

<style>
  .pdf-operations-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f7fafc;
  }

  .main-content {
    flex: 1;
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    color: #1a202c;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .page-header p {
    font-size: 1.2rem;
    color: #718096;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .operations-grid {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .operations-sidebar {
    background: #f8fafc;
    padding: 2rem;
    border-right: 1px solid #e2e8f0;
  }

  .operations-sidebar h3 {
    font-size: 1.2rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .operations-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .operation-tab {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    font-size: 1rem;
    color: #4a5568;
    font-weight: 500;
  }

  .operation-tab:hover {
    background: #e2e8f0;
    color: #2d3748;
  }

  .operation-tab.active {
    background: #4299e1;
    color: white;
  }

  .tab-icon {
    font-size: 1.5rem;
  }

  .tab-name {
    flex: 1;
  }

  .operations-content {
    padding: 2rem;
  }

  .coming-soon {
    text-align: center;
    padding: 3rem;
    background: #f7fafc;
    border-radius: 8px;
    border: 2px dashed #cbd5e0;
  }

  .coming-soon h3 {
    font-size: 1.8rem;
    color: #4a5568;
    margin-bottom: 1rem;
  }

  .coming-soon p {
    color: #718096;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .operations-grid {
      grid-template-columns: 1fr;
    }

    .operations-sidebar {
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
    }

    .operations-nav {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .operation-tab {
      flex: 1;
      min-width: 120px;
      padding: 0.75rem;
      font-size: 0.9rem;
    }

    .tab-icon {
      font-size: 1.2rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .page-header p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .operation-tab {
      min-width: 100px;
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .tab-icon {
      font-size: 1rem;
    }

    .operations-content {
      padding: 1rem;
    }

    .coming-soon {
      padding: 2rem 1rem;
    }
  }
</style>
