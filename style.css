/* Reset e base */
*{margin:0;padding:0;box-sizing:border-box;font-family:Inter, Arial, sans-serif}
:root{
  --pink:#ff416c;
  --pink-dark:#ff1e54;
  --bg:#f7f7fa;
  --card:#ffffff;
  --muted:#666;
  --dark:#222;
  --admin-bg:#0f1113;
}

/* Body */
body{background:var(--bg);color:var(--dark);transition:all .18s ease}
header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 20px;
  background:linear-gradient(90deg,var(--pink),#ff8a5b);
  color:white;
}
.header-left{display:flex;align-items:center;gap:12px}
#logo{font-size:1.4rem;font-weight:700}
.gear{background:transparent;border:none;font-size:22px;cursor:pointer;padding:8px;border-radius:8px;color:white}
.gear:hover{background:rgba(255,255,255,0.08)}
.header-right{display:flex;align-items:center;gap:8px}
#toggle-mode{padding:8px 12px;border-radius:8px;border:none;background:white;color:var(--pink);font-weight:700;cursor:pointer}
#toggle-mode.small{padding:6px 8px;font-size:0.9rem}

/* Destaques */
.destaques{background:#222;color:white;padding:10px;text-align:center;font-weight:600}
/* Carousel */
.carousel{overflow:hidden;margin:18px auto;max-width:1200px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.08)}
.carousel-container{display:flex;transition:transform .5s ease}
.carousel-container img{width:100%;object-fit:cover;display:block}

/* Layout principal */
.container{display:flex;gap:20px;max-width:1200px;margin:20px auto;padding:0 16px}
.sidebar{width:260px;background:var(--card);padding:18px;border-radius:10px;box-shadow:0 6px 18px rgba(15,15,15,0.04)}
.sidebar h3{margin-bottom:12px}
.sidebar ul{list-style:none}
.sidebar ul li{padding:10px;border-radius:8px;cursor:pointer;color:var(--muted);transition:background .18s}
.sidebar ul li:hover{background:linear-gradient(90deg, rgba(255,65,108,0.06), rgba(255,65,108,0.02));color:var(--pink-dark);font-weight:600}

/* Produtos */
.products{flex:1}
.products h2{margin-bottom:12px}
.produtos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;transition:opacity .25s}
.produtos-grid.fade-out{opacity:.2}
.produto{background:var(--card);padding:12px;border-radius:12px;box-shadow:0 6px 18px rgba(15,15,15,0.06);text-align:center;transition:transform .18s,box-shadow .18s}
.produto img{width:100%;height:180px;object-fit:cover;border-radius:8px}
.produto h3{margin:10px 0;font-size:1rem}
.preco{color:var(--pink);font-weight:700;margin-top:6px}
.produto a{display:inline-block;margin-top:10px;padding:8px 12px;border-radius:8px;background:var(--pink);color:white;text-decoration:none}
.produto:hover{transform:translateY(-6px);box-shadow:0 18px 40px rgba(255,65,108,0.12)}

/* Footer */
footer{text-align:center;padding:18px;background:#101010;color:#fff;margin-top:28px;border-top-left-radius:6px;border-top-right-radius:6px}

/* Admin styles (dark) */
.admin-body{background:var(--admin-bg);color:white;min-height:100vh}
.card{background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));padding:18px;border-radius:12px;max-width:980px;margin:20px auto}
.center-card{max-width:420px}
input,select,button{font-size:1rem;border:none;padding:10px;border-radius:8px}
input,select{background:rgba(255,255,255,0.04);color:white;margin:8px 0;width:100%}
button{background:var(--pink);color:white;padding:10px 14px;cursor:pointer}
.small-ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:white;padding:8px 10px;border-radius:8px;cursor:pointer}
.row{display:flex;gap:8px;margin-top:8px}
.row button{flex:1}
.admin-grid{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start}
.admin-list{list-style:none;padding:0;margin-top:10px}
.admin-list li{background:rgba(255,255,255,0.03);padding:10px;margin-bottom:8px;border-radius:8px;display:flex;justify-content:space-between;align-items:center}
.admin-list button{background:transparent;color:var(--pink);border:1px solid rgba(255,255,255,0.05);padding:6px 8px;border-radius:6px;cursor:pointer}

/* mensagens */
.msg-error{color:#ffccd5;margin-top:8px}
.msg-success{color:#c7ffd6;margin-top:8px}
.hint{display:block;margin-top:8px;color:#ddd;font-size:.9rem}

/* hidden */
.hidden{display:none}

/* modo celular forçado */
body.modo-celular header{padding:12px}
body.modo-celular .container{flex-direction:column;padding:0 10px}
body.modo-celular .sidebar{width:100%}
body.modo-celular .produtos-grid{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}

/* responsividade */
@media(max-width:900px){
  .container{gap:12px;padding:0 12px}
  .admin-grid{grid-template-columns:1fr}
  .sidebar{width:100%}
  .carousel{margin:12px}
}

/* ---- CORREÇÃO DO BUG DO SELECT (mantém animações e estilo original) ---- */
select {
  background:white !important;
  color:black !important;
  border:1px solid rgba(0,0,0,0.12) !important;
}
.admin-body select {
  background:#1e1e1e !important;
  color:white !important;
  border:1px solid rgba(255,255,255,0.08) !important;
}
/* tentativa de estilo nas options (nem todos navegadores seguem) */
select option { background:#fff !important; color:#000 !important; }
.admin-body select option { background:#1e1e1e !important; color:#fff !important; }
