const $=id=>document.getElementById(id);
const size=n=>n<1024?n+' B':(n/1024).toFixed(1)+' KiB';
async function refresh(){
  const r=await fetch('/api/files'); if(!r.ok)throw Error('Could not load files.');
  const rows=await r.json(); $('count').textContent=rows.length+' FILES'; $('files').replaceChildren();
  if(!rows.length){const p=document.createElement('p');p.className='empty';p.textContent='No files yet. Encrypt your first file above.';$('files').append(p);}
  for(const f of rows){const row=document.createElement('div');row.className='file-row';const info=document.createElement('div');const b=document.createElement('b');b.textContent=f.name;const sm=document.createElement('small');sm.textContent=`${size(f.size)} · ${f.count} encrypted block${f.count===1?'':'s'} · SHA-256 ${f.sha256.slice(0,12)}…`;info.append(b,sm);const a=document.createElement('a');a.className='download';a.href='/api/download/'+f.id;a.textContent='Download archive ↓';row.append(info,a);$('files').append(row);}
}
$('file').addEventListener('change',()=>{$('chosen').textContent=$('file').files[0]?.name||'Choose a file to get started';});
$('upload').addEventListener('submit',async e=>{e.preventDefault();const f=$('file').files[0];if(!f)return;if(f.size>10485760){$('status').textContent='Choose a file smaller than 10 MiB.';return;}$('submit').disabled=true;$('status').textContent='Splitting and encrypting your file…';try{const r=await fetch('/api/upload',{method:'POST',headers:{'X-Filename':encodeURIComponent(f.name),'X-Password':encodeURIComponent($('password').value)},body:f});const data=await r.json();if(!r.ok)throw Error(data.error||'Upload failed.');$('password').value='';$('status').textContent=`Encrypted successfully: ${data.count} block${data.count===1?'':'s'}. Your archive is ready below.`;await refresh();}catch(err){$('status').textContent=err.message;}finally{$('submit').disabled=false;}});
refresh().catch(e=>{$('status').textContent=e.message;});
