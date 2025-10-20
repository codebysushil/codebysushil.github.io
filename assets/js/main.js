// --- GitHub Config ---
const GITHUB_USER = 'codebysushil';      
const GITHUB_REPO = "codebysushil.github.io";    
const ARTICLES_PATH = 'articles';         
const BRANCH = 'main';                    

// --- Helpers ---
function parseFrontMatter(md){
  const fmRegex=/^---\s*([\s\S]*?)\s*---\s*/;
  const match=md.match(fmRegex);
  if(!match) return {fm:{}, content:md};
  const yaml=match[1];
  const content=md.slice(match[0].length);
  const lines=yaml.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const fm={};
  for(const line of lines){
    const m=line.match(/^([A-Za-z0-9\-_]+)\s*:\s*(.*)$/);
    if(m){fm[m[1].toLowerCase()]=m[2].replace(/^["'](.*)["']$/,'$1');}
  }
  return {fm, content};
}
function formatDate(iso){try{const d=new Date(iso);return isNaN(d)?iso:d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});}catch(e){return iso}}
function estimateReadTime(text){const words=text.trim().split(/\s+/).length;return Math.max(1,Math.round(words/200))+' min read'}
async function incAndGetViews(key){
  try{
    const res=await fetch(`https://api.countapi.xyz/hit/${GITHUB_USER}-${GITHUB_REPO}/${key}`);
    const json=await res.json();
    return json.value||0;
  }catch(e){return '—'}
}

// --- DOM Elements ---
const grid=document.getElementById('articles-grid');
const modal=document.getElementById('article-modal');
const modalClose=document.getElementById('modal-close');
const modalTitle=document.getElementById('modal-title');
const modalAuthor=document.getElementById('modal-author');
const modalDate=document.getElementById('modal-date');
const modalReadtime=document.getElementById('modal-readtime');
const modalTags=document.getElementById('modal-tags');
const modalViews=document.getElementById('modal-views');
const modalCover=document.getElementById('modal-cover');
const articleContent=document.getElementById('article-content');
const prevBtn=document.getElementById('prev-article');
const nextBtn=document.getElementById('next-article');

let articlesData=[];    // store all articles
let currentIndex=0;     // current article in modal

// --- Load articles dynamically ---
(async function(){
  try{
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${ARTICLES_PATH}?ref=${BRANCH}`;
    const res = await fetch(apiUrl);
    if(!res.ok) throw new Error('Failed to fetch articles list');
    const files = await res.json();
    const mdFiles = files.filter(f=>f.name.endsWith('.md'));

    for(const file of mdFiles){
      try{
        const rawUrl = file.download_url;
        const resp = await fetch(rawUrl);
        if(!resp.ok) continue;
        const mdText = await resp.text();
        const {fm, content} = parseFrontMatter(mdText);

        const article = {
          fileName: file.name,
          title: fm.title||file.name,
          description: fm.description||'',
          author: fm.author||'Unknown',
          date: fm.date?formatDate(fm.date):'',
          tags: fm.tags||'',
          cover: fm.cover||'',
          content
        };
        articlesData.push(article);

        // create card
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML=`
          <h2>${article.title}</h2>
          <p>${article.description}</p>
          <div class="meta">By ${article.author} | ${article.date}</div>
          <div class="tags">${article.tags}</div>
        `;

        card.addEventListener('click',()=>openModal(articlesData.indexOf(article)));
        grid.appendChild(card);

      }catch(err){console.error('Error loading file', file.name, err);}
    }
  }catch(e){console.error('Failed to fetch articles list', e);}
})();

// --- Modal functions ---
async function openModal(index){
  currentIndex=index;
  const article=articlesData[index];
  modalTitle.textContent=article.title;
  modalAuthor.textContent='By '+article.author;
  modalDate.textContent=article.date;
  modalReadtime.textContent=estimateReadTime(article.content);
  modalTags.textContent=article.tags;
  if(article.cover){modalCover.src=article.cover; modalCover.style.display='block';} else modalCover.style.display='none';
  articleContent.innerHTML=marked.parse(article.content);
  Prism.highlightAll();
  modalViews.textContent='Views: ' + await incAndGetViews(article.fileName.replace(/\.[^/.]+$/,""));
  modal.style.display='flex';
}

// Next / Previous
prevBtn.addEventListener('click',()=>openModal((currentIndex-1+articlesData.length)%articlesData.length));
nextBtn.addEventListener('click',()=>openModal((currentIndex+1)%articlesData.length));

// Close modal
modalClose.addEventListener('click',()=>modal.style.display='none');
window.addEventListener('click',e=>{if(e.target==modal) modal.style.display='none'});

