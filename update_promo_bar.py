#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_promo_bar.py — Bandeau promotionnel Elactronics (variante A « Nuit ancrée »)

Workflow :
    python3 update_promo_bar.py audit   -> rapport LECTURE SEULE (aucune écriture)
    python3 update_promo_bar.py apply   -> applique les modifications (après GO)

Idempotent : relancer `apply` remplace les blocs entre marqueurs (changement de
montant = éditer PROMO_AMOUNT + PROMO_VERSION, relancer, 1 commit).

Encodage : lecture utf-8-sig (absorbe un éventuel BOM), écriture utf-8 SANS BOM.
"""

import re
import sys
import pathlib

# ============================== CONFIG ==============================
PROMO_AMOUNT   = "600"   # DH — seule valeur à changer pour un nouveau montant
PROMO_VERSION  = "v1"    # incrémenter à CHAQUE changement de montant/texte
                         # (fait réapparaître le bandeau chez ceux qui l'ont fermé)
WA_EXPECTED    = 160     # invariant liens wa.me sur l'ensemble du site
CSS_VERSION    = "20260723"  # bump a chaque modif de style.css (cache CDN)
REPO_DIR       = "."     # racine du clone frais du repo `serrure`

# Pages qui ne reçoivent JAMAIS le bandeau (aucun modèle en promo présenté)
EXCLUDE = {
    "serrure-smartlock-maroc.html",
    "serrure-nextlock-maroc.html",
    "mentions-legales.html",
    "cgv.html",
    "politique-confidentialite.html",
}

# Critère d'inclusion : la page présente au moins un modèle en promotion
PROMO_MODELS_RE = re.compile(r"NeoLock|FutureLock|Infinity", re.IGNORECASE)

# ====================== BLOCS INJECTÉS (marqueurs) ======================

HEAD_START, HEAD_END = "<!-- PROMO-HEAD:START -->", "<!-- PROMO-HEAD:END -->"
BAR_START,  BAR_END  = "<!-- PROMO-BAR:START -->",  "<!-- PROMO-BAR:END -->"
CSS_START,  CSS_END  = "/* PROMO-BAR:START */",     "/* PROMO-BAR:END */"

STORAGE_KEY = f"el_promo_{PROMO_VERSION}"

HEAD_BLOCK = f"""{HEAD_START}
<style>.promo-hidden .promo-bar{{display:none}}</style>
<script>(function(){{try{{var d=localStorage.getItem("{STORAGE_KEY}");
if(d&&Date.now()-(+d)<2592e6)document.documentElement.className+=" promo-hidden";}}catch(e){{}}}})();</script>
{HEAD_END}"""

BAR_BLOCK = f"""{BAR_START}
<div class="promo-bar" id="promoBar">
  <a class="promo-bar__link" href="/index.html#produits" data-promo-target="#produits">
    <span class="promo-bar__dot" aria-hidden="true"></span>
    <span class="promo-bar__txt"><strong>Offres en cours</strong>
      <span class="promo-bar__sep" aria-hidden="true">·</span>
      <span class="promo-bar__full">Économisez jusqu'à <b>{PROMO_AMOUNT}&nbsp;DH</b> sur nos serrures haut de gamme</span>
      <span class="promo-bar__short">Économisez jusqu'à <b>{PROMO_AMOUNT}&nbsp;DH</b></span></span>
    <span class="promo-bar__cta"><span class="promo-bar__cta-l">Voir les offres</span>
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></span>
  </a>
  <button class="promo-bar__close" type="button" aria-label="Fermer le bandeau promotionnel">
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</div>
<script>(function(){{
  var bar=document.getElementById('promoBar');if(!bar)return;
  var link=bar.querySelector('.promo-bar__link');
  link.addEventListener('click',function(e){{
    var t=document.querySelector(link.getAttribute('data-promo-target'));
    if(t){{e.preventDefault();
      var h=document.querySelector('header');
      var off=(h?h.offsetHeight:0)+8;
      var y=t.getBoundingClientRect().top+window.pageYOffset-off;
      var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({{top:y,behavior:r?'auto':'smooth'}});}}
    if(window.gtag)gtag('event','promo_bar_click',{{transport_type:'beacon'}});
  }});
  bar.querySelector('.promo-bar__close').addEventListener('click',function(){{
    bar.style.display='none';
    try{{localStorage.setItem('{STORAGE_KEY}',String(Date.now()));}}catch(e){{}}
    if(window.gtag)gtag('event','promo_bar_dismiss',{{transport_type:'beacon'}});
  }});
}})();</script>
{BAR_END}"""

CSS_BLOCK = f"""{CSS_START}
@keyframes promo-bar-in{{from{{transform:translateY(-100%);opacity:0}}
  to{{transform:translateY(0);opacity:1}}}}
.promo-bar{{position:relative;box-sizing:border-box;width:100%;height:40px;
  background:var(--color-bg-elevated);border-bottom:1px solid rgba(245,196,81,.25);
  overflow:hidden;animation:promo-bar-in .2s cubic-bezier(.22,.61,.36,1) both}}
.promo-bar__link{{display:flex;align-items:center;justify-content:center;gap:10px;height:100%;
  padding:0 44px 0 16px;text-decoration:none;color:var(--color-text);font-size:13px;line-height:1;
  letter-spacing:.005em;white-space:nowrap}}
.promo-bar__link strong{{font-weight:600}}
.promo-bar__link b{{color:var(--color-gold);font-weight:600}}
.promo-bar__sep{{color:rgba(249,250,251,.34)}}
.promo-bar__dot{{width:5px;height:5px;border-radius:50%;background:var(--color-gold);flex:0 0 auto;
  box-shadow:0 0 0 3px rgba(245,196,81,.18)}}
.promo-bar__cta{{display:inline-flex;align-items:center;gap:5px;color:var(--color-gold);
  font-weight:600;transition:gap .18s ease}}
.promo-bar__link:hover .promo-bar__cta{{gap:8px}}
.promo-bar__link:focus-visible{{outline:2px solid var(--color-gold);outline-offset:-3px}}
.promo-bar__close{{position:absolute;top:0;right:0;width:40px;height:100%;display:flex;
  align-items:center;justify-content:center;background:none;border:0;padding:0;cursor:pointer;
  color:var(--color-text);opacity:.55;transition:opacity .18s ease}}
.promo-bar__close:hover,.promo-bar__close:focus-visible{{opacity:1}}
.promo-bar__short{{display:none}}
@media(max-width:640px){{
  .promo-bar{{height:38px}}
  .promo-bar__link{{font-size:12.5px;padding:0 38px 0 12px;gap:8px}}
  .promo-bar__full,.promo-bar__cta-l{{display:none}}
  .promo-bar__short{{display:inline}}
  .promo-bar__close{{width:34px}}
}}
@media(prefers-reduced-motion:reduce){{.promo-bar,.promo-bar *{{
  transition:none!important;animation:none!important}}}}
{CSS_END}"""

# ============================== OUTILS ==============================

def read(p: pathlib.Path) -> str:
    return p.read_text(encoding="utf-8-sig")

def write(p: pathlib.Path, s: str) -> None:
    p.write_text(s, encoding="utf-8")  # UTF-8 sans BOM

def html_pages(root: pathlib.Path):
    return sorted(x for x in root.rglob("*.html") if ".git" not in x.parts)

def replace_between(text, start, end, block):
    """Remplace un bloc existant entre marqueurs ; retourne (texte, remplacé?)."""
    pat = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    if pat.search(text):
        return pat.sub(block, text, count=1), True
    return text, False

def wa_count(root: pathlib.Path) -> int:
    return sum(read(p).count("wa.me/") for p in html_pages(root))

def bump_css_version(root: pathlib.Path) -> int:
    pat = re.compile(r"style\.css\?v=\d+")
    n = 0
    for p in html_pages(root):
        t = read(p)
        new = pat.sub(f"style.css?v={CSS_VERSION}", t)
        if new != t:
            n += len(pat.findall(t))
            write(p, new)
    return n

def target_pages(root: pathlib.Path):
    """Pages incluses / exclues, selon le critère 'présente un modèle en promo'."""
    inc, exc = [], []
    for p in html_pages(root):
        if p.name in EXCLUDE:
            exc.append((p, "exclusion explicite"))
        elif PROMO_MODELS_RE.search(read(p)):
            inc.append(p)
        else:
            exc.append((p, "aucun modèle en promo mentionné"))
    return inc, exc

def header_position(root: pathlib.Path):
    """Détecte position:sticky / fixed dans les CSS (info, pas bloquant)."""
    hits = []
    for css in sorted(root.rglob("*.css")):
        if ".git" in css.parts:
            continue
        txt = read(css)
        for m in re.finditer(r"position\s*:\s*(sticky|fixed)", txt):
            line = txt[:m.start()].count("\n") + 1
            hits.append(f"{css.name}:{line} -> position:{m.group(1)}")
    return hits

# ============================== PHASES ==============================

def audit(root: pathlib.Path):
    print("=" * 62)
    print("AUDIT (lecture seule) — bandeau promo", PROMO_VERSION,
          "—", PROMO_AMOUNT, "DH")
    print("=" * 62)

    inc, exc = target_pages(root)
    print(f"\n[Pages INCLUSES : {len(inc)}]")
    for p in inc:
        print("  +", p.relative_to(root))
    print(f"\n[Pages EXCLUES : {len(exc)}]")
    for p, why in exc:
        print("  -", p.relative_to(root), f"({why})")

    print("\n[Header — position détectée dans les CSS]")
    hits = header_position(root)
    print("\n".join("  " + h for h in hits) if hits
          else "  (aucun sticky/fixed trouvé — vérifier manuellement)")
    if any("fixed" in h for h in hits):
        print("  !! position:fixed détecté quelque part : vérifier que c'est")
        print("     bien le header AVANT apply (le bandeau doit rester au-dessus).")

    n = wa_count(root)
    print(f"\n[Invariant wa.me] {n} liens (attendu : {WA_EXPECTED})",
          "OK" if n == WA_EXPECTED else "!! ÉCART — STOP, investiguer avant apply")

    already = [p for p in html_pages(root) if BAR_START in read(p)]
    print(f"\n[Marqueurs existants] {len(already)} page(s) portent déjà le bloc"
          + (" (apply = mise à jour idempotente)" if already else ""))
    print("\nAucune écriture effectuée. GO explicite requis pour `apply`.")

def apply(root: pathlib.Path):
    n0 = wa_count(root)
    if n0 != WA_EXPECTED:
        sys.exit(f"STOP avant écriture : {n0} liens wa.me (attendu {WA_EXPECTED}).")

    inc, _ = target_pages(root)
    stats = {"head_new": 0, "head_upd": 0, "bar_new": 0, "bar_upd": 0}

    for p in inc:
        txt = read(p)

        # --- head : snippet anti-CLS ---
        txt, done = replace_between(txt, HEAD_START, HEAD_END, HEAD_BLOCK)
        if done:
            stats["head_upd"] += 1
        else:
            m = re.search(r"</head>", txt, re.IGNORECASE)
            if not m:
                print("  !! </head> introuvable :", p.name, "— page sautée")
                continue
            txt = txt[:m.start()] + HEAD_BLOCK + "\n" + txt[m.start():]
            stats["head_new"] += 1

        # --- bandeau : juste après <body>, AVANT le header sticky ---
        txt, done = replace_between(txt, BAR_START, BAR_END, BAR_BLOCK)
        if done:
            stats["bar_upd"] += 1
        else:
            m = re.search(r"<body[^>]*>", txt, re.IGNORECASE)
            if not m:
                print("  !! <body> introuvable :", p.name, "— page sautée")
                continue
            txt = txt[:m.end()] + "\n" + BAR_BLOCK + txt[m.end():]
            stats["bar_new"] += 1

        write(p, txt)

    # --- CSS : bloc dans la feuille principale ---
    css_files = [c for c in sorted(root.rglob("*.css")) if ".git" not in c.parts]
    if not css_files:
        sys.exit("STOP : aucun fichier CSS trouvé.")
    css = css_files[0]  # feuille principale du repo
    ctxt = read(css)
    ctxt, done = replace_between(ctxt, CSS_START, CSS_END, CSS_BLOCK)
    if not done:
        ctxt = ctxt.rstrip() + "\n\n" + CSS_BLOCK + "\n"
    write(css, ctxt)
    print(f"[CSS] bloc {'mis à jour' if done else 'ajouté'} dans {css.name}")
    nv = bump_css_version(root)
    print(f"[CACHE] {nv} liens style.css?v= bumpes vers {CSS_VERSION}")

    # --- Vérifications post-écriture ---
    n1 = wa_count(root)
    pages_with_bar = [p for p in html_pages(root) if BAR_START in read(p)]
    amount_ok = all(f"{PROMO_AMOUNT}&nbsp;DH" in read(p) for p in pages_with_bar)
    key_ok = all(STORAGE_KEY in read(p) for p in pages_with_bar)

    print("\n" + "=" * 62)
    print("APPLY terminé")
    print(f"  head  : {stats['head_new']} ajout(s), {stats['head_upd']} mise(s) à jour")
    print(f"  bar   : {stats['bar_new']} ajout(s), {stats['bar_upd']} mise(s) à jour")
    print(f"  pages avec bandeau : {len(pages_with_bar)}")
    print(f"  montant {PROMO_AMOUNT} DH partout : {'OK' if amount_ok else '!! ÉCHEC'}")
    print(f"  clé {STORAGE_KEY} partout        : {'OK' if key_ok else '!! ÉCHEC'}")
    print(f"  wa.me : {n1} (attendu {WA_EXPECTED}) : "
          f"{'OK' if n1 == WA_EXPECTED else '!! ÉCART — NE PAS COMMITTER'}")
    print("=" * 62)

if __name__ == "__main__":
    root = pathlib.Path(REPO_DIR).resolve()
    mode = sys.argv[1] if len(sys.argv) > 1 else "audit"
    if mode == "audit":
        audit(root)
    elif mode == "apply":
        apply(root)
    else:
        sys.exit("Usage : python3 update_promo_bar.py [audit|apply]")
