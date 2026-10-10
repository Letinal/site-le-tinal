/* Rend le programme en direct depuis /api/programme (base KV).
   Remplace le rendu statique par les evenements a jour (ajouts/modifs du bureau). */
(function () {
  var moisCourt = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function jour(d){ return new Date(d+'T00:00:00').getDate(); }
  function mois(d){ return moisCourt[new Date(d+'T00:00:00').getMonth()]; }
  function dateLongue(d){ try { return new Date(d+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); } catch(e){ return d; } }
  function imgSrc(im){ if(!im) return ''; if(im.indexOf('data:')===0||im.charAt(0)==='/') return im; return '/photos/events/'+im; }
  function couleurType(t){
    var s=String(t||'').toLowerCase();
    if(s.indexOf('festival')>=0) return 't-magenta';
    if(s.indexOf('concert')>=0||s.indexOf('musi')>=0||s.indexOf('chorale')>=0||s.indexOf('bluegrass')>=0||s.indexOf('swing')>=0||s.indexOf('danse')>=0) return 't-coral';
    if(s.indexOf('spectacle')>=0||s.indexOf('clown')>=0||s.indexOf('théât')>=0||s.indexOf('theat')>=0) return 't-turquoise';
    if(s.indexOf('conte')>=0) return 't-jaune';
    if(s.indexOf('verniss')>=0||s.indexOf('expo')>=0||s.indexOf('sérigraph')>=0||s.indexOf('serigraph')>=0||s.indexOf('art')>=0||s.indexOf('ciné')>=0||s.indexOf('cine')>=0) return 't-violet';
    if(s.indexOf('jeu')>=0||s.indexOf('quizz')>=0||s.indexOf('karaok')>=0||s.indexOf('mario')>=0||s.indexOf('puzzle')>=0||s.indexOf('march')>=0||s.indexOf('dégust')>=0||s.indexOf('degust')>=0) return 't-jaune';
    return 't-vert';
  }
  function badge(e){
    if(e.gratuit) return '<span class="badge gratuit">Gratuit</span>';
    if(e.prix) return '<span class="badge">'+esc(e.prix)+'</span>';
    return '';
  }
  function card(e, meta){
    return '<article class="evt '+couleurType(e.type)+'">'
      + '<div class="cal"><div class="j">'+jour(e.date)+'</div><div class="m">'+mois(e.date)+'</div></div>'
      + '<div>'
      + (e.image ? '<img class="evt-img" src="'+imgSrc(e.image)+'" alt="'+esc(e.titre)+'" loading="lazy" />' : '')
      + '<h3>'+esc(e.titre)+badge(e)+'</h3>'
      + '<div class="meta">'+meta.filter(Boolean).map(esc).join(' · ')+'</div>'
      + (e.description ? '<p>'+esc(e.description)+'</p>' : '')
      + '</div></article>';
  }
  function todayISO(){ return new Date().toISOString().slice(0,10); }

  fetch('/api/programme').then(function(r){ return r.json(); }).then(function(d){
    var events = (d && d.events) || [];
    if(!events.length) return;

    var list = document.getElementById('prog-list');
    if(list){
      var desc = events.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
      list.innerHTML = desc.map(function(e){ return card(e, [dateLongue(e.date), e.heure, e.type, e.lieu]); }).join('');
    }

    var proch = document.getElementById('prog-prochains');
    if(proch){
      var t = todayISO();
      var up = events.filter(function(e){ return e.date>=t; }).sort(function(a,b){ return a.date.localeCompare(b.date); }).slice(0,3);
      if(!up.length) up = events.slice().sort(function(a,b){ return a.date.localeCompare(b.date); }).slice(0,3);
      proch.innerHTML = up.map(function(e){ return card(e, [e.type, e.heure, e.lieu]); }).join('');
    }
  }).catch(function(){ /* on garde le rendu statique en cas d'erreur */ });
})();
