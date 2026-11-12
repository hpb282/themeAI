(() => {
  function usePlatform(platform) {
    const claude=platform==='claude';
    document.documentElement.dataset.themeaiPlatform=platform;
    document.getElementById('platform-label').textContent=claude?'Claude':'ChatGPT / Codex';
    document.getElementById('assistant-label').textContent=claude?'Claude':'Codex';
    for(const button of document.querySelectorAll('[data-platform]'))button.setAttribute('aria-pressed',String(button.dataset.platform===platform));
  }
  document.querySelectorAll('[data-platform]').forEach(button=>button.addEventListener('click',()=>usePlatform(button.dataset.platform)));
  document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('prompt-textarea').value=button.dataset.prompt;document.getElementById('prompt-textarea').focus();}));
  document.querySelectorAll('.nav-item').forEach(button=>button.addEventListener('click',()=>{document.getElementById('demo-notice').textContent='Đây là giao diện minh họa. Cài theme để sử dụng trên ChatGPT / Claude thật.';}));
  document.getElementById('preview-composer').addEventListener('submit',event=>{event.preventDefault();document.getElementById('demo-notice').textContent='Ô nhập minh họa; không gửi nội dung tới AI hoặc máy chủ.';});
})();
