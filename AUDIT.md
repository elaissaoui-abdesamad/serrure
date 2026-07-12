# AUDIT TECHNIQUE & SEO — elactronics.ma

**Date :** 2026-07-12 · **Périmètre :** dépôt complet (24 pages HTML, 1 CSS, 1 JS, 8 images, config GitHub Pages) · **Mode :** lecture seule — aucun fichier du site modifié.
**Méthodologie :** cartographie → analyse fichier par fichier → cohérence transversale. Chaque constat est prouvé par le code (fichier + ligne). Les points non prouvables statiquement sont marqués comme tels.

---

## 0. Cartographie du dépôt

### Arborescence & rôles

| Fichier / dossier | Rôle |
|---|---|
| `index.html` (829 l.) | Accueil + catalogue des 5 modèles (source de vérité produits/prix) |
| `casablanca / rabat / bouznika . html` (842–865 l.) | Pages villes « enrichies » (serrurier, quartiers, Airbnb, LocalBusiness) |
| `mohammedia / marrakech . html` (669–702 l.) | Pages villes intermédiaires (serrurier + Airbnb, sans LocalBusiness) |
| `agadir / fes / kenitra / meknes / sale / tanger / temara . html` (572–673 l.) | Pages villes « template de base » (about + produits + avis + maillage + FAQ) |
| `prix- / meilleure- / serrure-electronique-fiable .html` | Pages SEO éditoriales (prix, comparatif, fiabilité) |
| `zones-couvertes.html` | Hub villes (12 cartes ville) |
| `faq.html`, `a-propos.html`, `travailler-avec-nous.html` | Pages support |
| `cgv / mentions-legales / politique-confidentialite .html` | Pages légales (**noindex, follow** — correct, hors sitemap — correct) |
| `style.css` (1 850 l.), `script.js` (154 l.) | Styles + JS partagés (menu, reveal, accordéon, bouton flottant, tracking clics) |
| `images/` (8 WebP, 7,5–31 Ko) | Toutes référencées, aucune orpheline, aucune manquante¹ |
| `sitemap.xml` (20 URLs), `robots.txt`, `CNAME` (`elactronics.ma`), `.nojekyll`, `google1beba9ea27cecf5f.html` | Config déploiement/indexation — tous corrects |

¹ `images/installation-serrure-rabat.webp` est référencée **uniquement dans un bloc HTML commenté** de `rabat.html:270` (placeholder volontaire « fournir l'image puis décommenter ») → pas un asset cassé.

### Valeurs de référence vérifiées

- **Tracking :** GA4 `G-YG9P3FXJX9` + Meta Pixel `1981751045765597`, identiques sur les 22 pages trackées (chargement différé sur interaction ou 3 s — bon pour la perf). Exception : `cgv.html` (voir P3-8).
- **Numéro unique :** `+33625287070` partout (wa.me + JSON-LD). Aucune divergence.
- **Prix (source de vérité `index.html`) :** SmartLock 890 (barré 1 190), NextLock 1 390 (1 790), NeoLock 1 790 (2 190), FutureLock 2 690 (3 290), Infinity 3 390 (3 790) DH. **Vérifié identique sur les 13 pages produits + wa.me + page prix : 0 divergence.**
- **Checksum wa.me : 135 occurrences** (134 dans les HTML + 1 injectée par `script.js`). 100 % bien formées (`https://wa.me/33625287070?text=…` encodé). Détail : index 9, chaque page ville 8, zones-couvertes 13, meilleure 4, travailler 3, faq 2, prix 2, fiable 2, a-propos 1, mentions-légales 1, politique 1, cgv 0.

### Contrôles passés sans anomalie (prouvés)

- JSON-LD : **tous syntaxiquement valides** (47 blocs) ; aucun `aggregateRating`/`review[]` auto-attribué réintroduit sur `LocalBusiness`/`Organization`/`Service` ✔
- Liens internes : **0 lien cassé, 0 ancre cassée, 0 page orpheline** ✔
- Canonicals : présents, uniques, auto-référents sur les 23 pages ✔ · `robots` meta cohérents (noindex uniquement sur les 3 pages légales, hors sitemap) ✔
- Un seul H1 par page, **aucun saut de niveau Hn** sur les 23 pages ✔ · aucun ID dupliqué ✔
- Titles/descriptions : tous présents et **uniques** ✔
- Images : alt présents partout, `width`/`height` partout (anti-CLS), `loading="lazy"` hors héros, héros en `eager + fetchpriority=high` + preload cohérent avec l'image affichée ✔
- Nav (7 liens) et footer (23 liens) **strictement identiques sur les 23 pages** ✔
- Breadcrumb visible ↔ `BreadcrumbList` JSON-LD cohérents sur les 12 pages villes ✔
- Casse des chemins uniforme (minuscules) — pas de risque Linux/GitHub Pages ✔
- `target="_blank"` avec `rel="noopener"` partout **sauf** 2 cas (P2-4) ✔

---

## 1. Anomalies

> Aucune anomalie **P0** détectée : pas de CTA mort, pas de JSON-LD invalide, pas de page indexable bloquée, pas d'asset critique manquant.

---

### P1-1 — `sale.html` : structure du hero cassée + `</div>` orphelin

1. **Priorité :** P1
2. **Fichier :** `sale.html`
3. **Lignes :** 125–142
4. **Problème :** `</div>` ligne 125 ferme `.hero-content` **avant** `.hero-highlights` ; le `</div>` ligne 132 ferme alors `.hero-inner`, ce qui fait sortir `.hero-media` (l. 133–141) du conteneur grid ; le `</div>` ligne 142 est orphelin (HTML invalide). Sur les 11 autres pages villes (ex. `temara.html:139-180`), `.hero-highlights` est *dans* `.hero-content` et `.hero-media` *dans* `.hero-inner`.
5. **Impact :** UX/technique — l'image hero de Salé sort de la mise en page 2 colonnes (affichée pleine largeur sous le texte, hors `.container`), badges hero décalés, HTML invalide.
6. **Correction :** répliquer la structure de `temara.html` : remonter `.hero-highlights` dans `.hero-content`, réintégrer `.hero-media` dans `.hero-inner`, supprimer le `</div>` orphelin.
7. **Correctif exact** (remplacement des lignes 124–142 de `sale.html`) :

```html
          </div>
          <div class="hero-highlights">
            <span>✓ Tous quartiers de Salé</span>
            <span>✓ Installation en 2h</span>
            <span>✓ À partir de 890 DH</span>
            <span>✓ Garantie 2 ans</span>
          </div>
        </div>
        <div class="hero-media">
          <div class="hero-card">
            <div class="hero-image">
              <img src="images/serrure-electronique-maroc.webp"
                alt="Serrure électronique à Salé avec installation à domicile" width="600" height="600" loading="eager"
                fetchpriority="high" />
            </div>
          </div>
        </div>
      </div>
    </section>
```

---

### P1-2 — Page prix : 2 CTA or « photo » avec message pré-rempli sans photo

1. **Priorité :** P1
2. **Fichier :** `prix-serrure-electronique-maroc.html`
3. **Lignes :** 118 et 247
4. **Problème :** les deux boutons sont conformes visuellement à la règle CTA or (classe `btn-gold` + icône appareil photo + libellé « Envoyer une photo de ma porte »), mais les messages pré-remplis sont « Bonjour, je souhaite connaître le prix adapté à ma porte. » (l. 118) et « Bonjour, je souhaite un prix selon mon usage. » (l. 247) — **aucune mention de photo**. Toutes les autres pages à CTA or ont un message photo (« je vous envoie une photo de ma porte pour… » : index, meilleure, fiable ×2).
5. **Impact :** conversion + cohérence du système à deux règles — le client clique « envoyer une photo » mais ouvre WhatsApp avec un message qui ne l'invite pas à joindre la photo ; rupture d'intention, et divergence de message entre pages censées appliquer la même règle.
6. **Correction :** aligner le `text=` sur l'intention photo, en conservant la nuance « prix » propre à la page.
7. **Correctif exact :**

Ligne 118 — remplacer :
```
?text=Bonjour%2C%20je%20souhaite%20conna%C3%AEtre%20le%20prix%20adapt%C3%A9%20%C3%A0%20ma%20porte.
```
par :
```
?text=Bonjour%2C%20je%20vous%20envoie%20une%20photo%20de%20ma%20porte%20pour%20conna%C3%AEtre%20le%20prix%20adapt%C3%A9.
```
Ligne 247 — remplacer :
```
?text=Bonjour%2C%20je%20souhaite%20un%20prix%20selon%20mon%20usage.
```
par :
```
?text=Bonjour%2C%20je%20vous%20envoie%20une%20photo%20de%20ma%20porte%20pour%20avoir%20un%20prix%20selon%20mon%20usage.
```

---

### P1-3 — Comparatif : « Visiophone ✓ » attribué à l'Infinity, contredit la fiche produit

1. **Priorité :** P1
2. **Fichier :** `meilleure-serrure-electronique-maroc.html`
3. **Ligne :** 392
4. **Problème :** le tableau comparatif affiche `Visiophone ✓` pour l'**Infinity**. Or la fiche produit Infinity (source de vérité, `index.html:430-443`, répliquée sur les 12 pages villes) ne liste **aucun visiophone** (12 caractéristiques, sans visiophone) ; seule la **FutureLock** a « Visiophone intégré (appel vidéo) » (`index.html:368`). La page prix (l. 197) ne mentionne pas non plus de visiophone pour l'Infinity.
5. **Impact :** business/conversion — spec contradictoire entre deux pages ; risque de promesse produit non tenue (litige client) ou, si l'Infinity a réellement un visiophone, fiche produit sous-vendue. Le sens de la correction est une **décision business** ; statiquement, la source de vérité dit « pas de visiophone ».
6. **Correction :** aligner le comparatif sur la fiche produit (✓ → ✗), OU compléter la fiche Infinity partout si la spec est réelle.
7. **Correctif exact** (hypothèse : fiche produit = vérité) — `meilleure-serrure-electronique-maroc.html:392`, remplacer :
```html
            <div class="comp-card__feat"><span>Visiophone</span><span class="feat-yes">✓</span></div>
```
par :
```html
            <div class="comp-card__feat"><span>Visiophone</span><span class="feat-no">✗</span></div>
```

---

### P1-4 — Risque doorway pages : 7 pages villes quasi identiques

1. **Priorité :** P1
2. **Fichiers :** `agadir.html`, `fes.html`, `kenitra.html`, `meknes.html`, `sale.html`, `tanger.html`, `temara.html`
3. **Lignes :** ensemble du corps de page
4. **Problème :** similarité textuelle mesurée (noms de villes neutralisés) : **kenitra↔meknes 94 %**, kenitra↔sale 92 %, meknes↔sale 91 %, agadir↔meknes/kenitra/sale 89 %, fes↔meknes 87 %… Ces 7 pages partagent le même squelette (~6 600–7 100 caractères de texte) où seuls les noms de quartiers et la ville changent. À l'inverse, les pages retravaillées se différencient bien : casablanca↔marrakech 40 %, rabat↔sale 42 % (le pilote `rabat.html` et `casablanca/bouznika/mohammedia` ont des sections serrurier/quartiers/Airbnb spécifiques et ~9 300–12 100 caractères).
5. **Impact :** SEO — profil typique de doorway pages / contenu dupliqué localisé ; risque de déclassement groupé des pages villes, qui portent l'essentiel de la stratégie SEO locale (priorité 0,75–0,95 dans le sitemap).
6. **Correction :** poursuivre le déploiement du format « pilote Rabat » (sections serrurier local, quartiers réels, cas d'usage Airbnb/local, FAQ locale 6 questions, LocalBusiness JSON-LD) sur les 7 pages restantes, par ordre de potentiel : Marrakech (déjà partiel), Tanger, Agadir, Fès, Kénitra, Salé, Meknès, Témara.
7. **Correctif exact :** contenu rédactionnel à produire par ville (non scriptable) — utiliser `rabat.html` comme gabarit structurel (sections l. 149–330 + FAQ 6 questions + bloc LocalBusiness l. 37-66 de `bouznika.html` adapté).

---

### P2-1 — zones-couvertes : 12 CTA WhatsApp en style `btn-outline-accent` (hors règle CTA vert)

1. **Priorité :** P2
2. **Fichier :** `zones-couvertes.html`
3. **Lignes :** 440, 452, 464, 476, 488, 500, 512, 524, 536, 548, 560, 572 (boutons « WhatsApp » des cartes villes)
4. **Problème :** ces 12 liens `wa.me` (action WhatsApp générique « je suis intéressé par une serrure électronique à X ») utilisent `class="btn btn-outline-accent"` **sans logo WhatsApp**, alors que la règle du site impose CTA **vert** `btn-whatsapp` + logo pour toute action WhatsApp générique. Sur les pages villes, le même message est porté par des composants verts (`contact-btn-whatsapp`).
5. **Impact :** conversion/cohérence — le code couleur (vert = WhatsApp) est le repère appris par l'utilisateur sur tout le site ; ces boutons bleus « WhatsApp » cassent la convention sur la page hub la plus stratégique du maillage villes.
6. **Correction :** passer les 12 boutons en `btn btn-whatsapp` (le libellé court « WhatsApp » peut rester ; l'ajout du SVG est optionnel vu la taille réduite `.city-card-cta .btn`).
7. **Correctif exact** (motif à répliquer 12×, exemple Casablanca l. 440) — remplacer :
```html
            <a href="https://wa.me/33625287070?text=..." class="btn btn-outline-accent" target="_blank" rel="noopener noreferrer">WhatsApp</a>
```
par :
```html
            <a href="https://wa.me/33625287070?text=..." class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
```
(en conservant le `?text=` propre à chaque ville).

---

### P2-2 — zones-couvertes : CTA final — le texte promet une photo, le bouton est générique

1. **Priorité :** P2
2. **Fichier :** `zones-couvertes.html`
3. **Lignes :** 617–624
4. **Problème :** le paragraphe dit « **Envoyez une photo de votre porte** sur WhatsApp… », mais le bouton est un CTA vert `btn-whatsapp` « Réserver mon installation » avec message générique (« j'aimerais des informations sur vos serrures connectées »). Selon la règle du site, une intention photo appelle le CTA **or** + message photo — ou alors le texte ne doit pas promettre de photo.
5. **Impact :** conversion — rupture intention/action au point de sortie principal de la page hub.
6. **Correction :** deux options ; la moins invasive (ne touche pas au CTA or, réservé) : reformuler le paragraphe. Option alternative : remplacer le bouton par le CTA or photo standard.
7. **Correctif exact** (option 1 — l. 617) — remplacer :
```html
      <p>Envoyez une photo de votre porte sur WhatsApp. Nous vérifions la compatibilité gratuitement et planifions rapidement l'intervention.</p>
```
par :
```html
      <p>Contactez-nous sur WhatsApp : nous vérifions gratuitement la compatibilité de votre porte et planifions rapidement l'intervention.</p>
```

---

### P2-3 — travailler-avec-nous : 3 CTA WhatsApp sans `target="_blank"` ni `rel`

1. **Priorité :** P2
2. **Fichier :** `travailler-avec-nous.html`
3. **Lignes :** 349, 377, 422
4. **Problème :** ces 3 liens `wa.me` (`btn-whatsapp`) sont les **seuls du site** (sur 134) sans `target="_blank" rel="noopener noreferrer"` : le clic quitte la page au lieu d'ouvrir WhatsApp dans un nouvel onglet.
5. **Impact :** UX/cohérence — comportement différent du reste du site ; l'utilisateur perd la page de recrutement.
6. **Correction :** ajouter les attributs manquants.
7. **Correctif exact** (à appliquer aux 3 ancres) — remplacer :
```html
class="btn btn-whatsapp">
```
par :
```html
class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
```

---

### P2-4 — politique-confidentialite : `target="_blank"` sans `rel="noopener"`

1. **Priorité :** P2
2. **Fichier :** `politique-confidentialite.html`
3. **Lignes :** 61 (`wa.me`), 62 (Instagram)
4. **Problème :** seuls `target="_blank"` du site sans `rel="noopener"` (`mentions-legales.html:124` l'a correctement).
5. **Impact :** sécurité (reverse tabnabbing, faible ici) + bonne pratique/cohérence.
6. **Correction :** ajouter `rel="noopener"`.
7. **Correctif exact :**
```html
<a href="https://wa.me/33625287070" target="_blank" rel="noopener">WhatsApp</a>,
…
<a href="https://www.instagram.com/elactronics.ma/" target="_blank" rel="noopener">Instagram</a>
```

---

### P2-5 — JSON-LD `LocalBusiness` présent sur 3 pages villes seulement

1. **Priorité :** P2
2. **Fichiers :** `agadir.html`, `fes.html`, `kenitra.html`, `marrakech.html`, `meknes.html`, `mohammedia.html`, `sale.html`, `tanger.html`, `temara.html`
3. **Lignes :** `<head>` (blocs JSON-LD)
4. **Problème :** `bouznika`, `casablanca` et `rabat` ont 4 blocs (LocalBusiness + Service + BreadcrumbList + FAQPage) ; les 9 autres pages villes n'en ont que 3 (pas de LocalBusiness avec `areaServed` ville). Divergence issue des refontes successives (régression de synchronisation entre générations de pages).
5. **Impact :** SEO local — signal `LocalBusiness`/`areaServed` inégal entre villes équivalentes.
6. **Correction :** répliquer le bloc LocalBusiness (modèle `bouznika.html`, bloc 0) sur les 9 pages, en adaptant `areaServed` à la ville.
7. **Correctif exact** (gabarit, à insérer avant le bloc `Service` de chaque page — exemple Agadir) :
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Elactronics",
  "url": "https://elactronics.ma/agadir.html",
  "telephone": "+33625287070",
  "logo": "https://elactronics.ma/images/logo-elactronics.webp",
  "description": "Vente et installation de serrures électroniques intelligentes à Agadir.",
  "areaServed": { "@type": "City", "name": "Agadir" },
  "priceRange": "890 DH - 3390 DH",
  "address": { "@type": "PostalAddress", "addressLocality": "Agadir", "addressCountry": "MA" }
}
</script>
```

---

### P2-6 — Bloc `villes-seo` : contraste 2,19:1 (texte + liens réels)

1. **Priorité :** P2
2. **Fichier :** `style.css`
3. **Lignes :** 666–675 (`.villes-seo p`, `.villes-seo a` — `rgba(156,163,175,.42)` sur fond `#050509`)
4. **Problème :** contraste calculé **2,19:1** (minimum WCAG AA : 4,5:1) sur un bloc contenant 10 liens internes réels (présent sur `index.html:736-750`).
5. **Impact :** accessibilité (texte illisible pour malvoyants) + SEO (des liens quasi invisibles peuvent être interprétés comme du maillage dissimulé).
6. **Correction :** remonter l'opacité à un niveau lisible tout en gardant le style discret.
7. **Correctif exact** — `style.css:668` et `674`, remplacer `rgba(156, 163, 175, 0.42)` par `rgba(156, 163, 175, 0.72)` (contraste ≈ 4,6:1).

---

### P3-1 — FAQ : micro-divergences JSON-LD ↔ contenu visible

1. **Priorité :** P3
2. **Fichiers/lignes :**
   - `faq.html:69` JSON-LD « La serrure **électronique** est-elle compatible avec ma porte ? » vs visible l. 238 « La serrure est-elle compatible avec ma porte ? »
   - `faq.html:85` JSON-LD « Peut-on ouvrir sans téléphone ? » vs visible l. 248 « Peut-on ouvrir **la serrure** sans téléphone ? »
   - `bouznika.html:134` JSON-LD « Quelle serrure choisir pour Airbnb **ou location courte durée** à Bouznika ? » vs visible l. 677 « Quelle serrure choisir pour Airbnb à Bouznika ? »
   - `index.html:78` réponse JSON-LD « **Les serrures electroniques Elactronics** commencent… » vs visible l. 616 « **Nos serrures électroniques** commencent… » (formulation, hors Q1 non accentuée de rabat qui est un choix assumé)
3. **Problème :** le texte des données structurées ne correspond pas mot à mot au contenu visible (exigence Google pour l'éligibilité rich results FAQ).
4. **Impact :** SEO — risque (faible) d'inéligibilité des rich snippets FAQ.
5. **Correction :** aligner le JSON-LD sur le texte visible (le visible fait foi).
6. **Correctif exact :** recopier la formulation visible dans les champs `name`/`text` correspondants des 4 blocs listés.

### P3-2 — `og:title` non synchronisés avec les titles différenciés

- **P3 · Fichiers :** `rabat.html` (title l. 8 « …dès 890 DH – Installée chez vous en 2h » vs og:title « Serrure électronique Rabat – Serrure intelligente installée en 2h | Elactronics »), `casablanca.html`, `agadir.html` (et autres pages villes : title « … | Installation en 2h — Elactronics » vs og:title à séparateurs « – … | Elactronics »).
- **Problème :** lors des différenciations successives, les `og:title` n'ont pas suivi les `<title>` — régression de synchronisation typique.
- **Impact :** partages sociaux avec des titres obsolètes/incohérents ; pas d'impact ranking.
- **Correctif :** recopier le `<title>` courant dans `og:title` sur chaque page ville.

### P3-3 — style.css : couches mortes (footer ×2, maillage ×3)

- **P3 · Fichier :** `style.css:1097-1115` vs `1611-1633` (`.footer-links`, `.footer-inner p` définis deux fois) ; `style.css:1706-1760` + `1762-1806` (`.section-maillage .contact-bullets` défini 3 fois, le bloc « RESET FINAL » annulant intégralement les deux précédents).
- **Impact :** maintenabilité — ~100 lignes de CSS mortes, risque d'édition du mauvais bloc.
- **Correctif :** supprimer `style.css:1097-1115` et `1706-1760` (conserver la version finale de chaque), puis incrémenter `?v=` (cf. commentaire l. 1).

### P3-4 — Animations `reveal-on-scroll` inertes sur 18 pages

- **P3 · Fichiers :** toutes les pages sauf `index`, `faq`, `meilleure-`, `prix-`, `serrure-electronique-fiable` (seules à contenir `document.documentElement.classList.add('js')`, ex. `index.html:34-36`).
- **Problème :** `.js .reveal-on-scroll{opacity:0…}` (`style.css:1348`) ne s'applique jamais sans la classe `js` → les 18 autres pages affichent tout sans animation (dégradation propre, contenu jamais masqué — mais comportement incohérent entre pages).
- **Correctif :** ajouter `<script>document.documentElement.classList.add('js');</script>` dans le `<head>` des 18 pages (avant `style.css` pour éviter le flash), ou assumer l'absence d'animation et retirer le script des 5 pages.

### P3-5 — Comparatif : `SmartLock — Connexion WiFi ✓` non corroborée (à confirmer business)

- **P3 · Fichier :** `meilleure-serrure-electronique-maroc.html:334`.
- **Problème :** la fiche SmartLock (`index.html:216-221`) liste « Application mobile Tuya » mais ne revendique pas de WiFi ; le badge « Connectée » est réservé à la NeoLock (`index.html:287`). **Non vérifiable statiquement** : à confirmer avec la fiche technique réelle ; si la SmartLock n'a pas de WiFi autonome, passer en ✗ (même correctif de motif que P1-3).

### P3-6 — Pages légales : liens WhatsApp sans message pré-rempli

- **P3 · Fichiers :** `mentions-legales.html:124`, `politique-confidentialite.html:61` (`https://wa.me/33625287070` nu).
- **Impact :** mineur (contexte légal) mais incohérent avec les 133 autres liens ; un `?text=` générique améliore la qualification.
- **Correctif :** ajouter `?text=Bonjour%2C%20j%27aimerais%20des%20informations%20sur%20vos%20serrures%20connect%C3%A9es`.

### P3-7 — Favicons absents/incomplets sur 4 pages

- **P3 · Fichiers :** `mentions-legales.html`, `politique-confidentialite.html` (0 lien icône), `a-propos.html`, `travailler-avec-nous.html` (uniquement `favicon.ico`).
- **Correctif :** répliquer le bloc de 4 liens de `index.html:27-30`.

### P3-8 — `cgv.html` : seule page sans tracking GA4/Pixel

- **P3 · Fichier :** `cgv.html` (aucun script tracking ; `mentions-legales.html` en a un, `politique-confidentialite.html` n'en a pas non plus).
- **Problème :** politique de tracking incohérente entre les 3 pages légales (1 sur 3 trackée).
- **Correctif :** choisir une règle (tout ou rien sur les pages légales) et l'appliquer aux 3 — cohérence RGPD : plutôt retirer le bloc de `mentions-legales.html`.

### P3-9 — `sitemap.xml` : `lastmod` non mis à jour

- **P3 · Fichier :** `sitemap.xml` (lastmod 2026-07-05/06 alors que rabat/avis/WhatsApp ont été modifiés les 8–11/07, cf. git log).
- **Correctif :** rafraîchir les `lastmod` des pages modifiées lors du prochain commit de contenu.

### P3-10 — a-propos : « des centaines d'installations » vs compteur « 100+ »

- **P3 · Fichier :** `a-propos.html` (meta description l. ~10 « Centaines d'installations réalisées », récit « nous avons réalisé des centaines d'installations » vs stat visible « 100+ Installations réalisées »).
- **Impact :** crédibilité — deux ordres de grandeur différents sur la même page.
- **Correctif :** harmoniser (soit « 100+ » partout, soit « des centaines » partout, selon la réalité).

### P3-11 — Accordéon FAQ : handler JS mort sur 14 pages + `aria-expanded` manquant sur zones-couvertes

- **P3 · Fichiers :** pages villes + prix/meilleure (FAQ en `h3.faq-question` + `p.faq-answer` toujours visibles : le toggle `.active` de `script.js:74-79` n'a aucun effet visuel — code mort inoffensif) ; `zones-couvertes.html:583-608` (vrais `<button>` accordéon, mais sans `aria-expanded`).
- **Correctif :** sur zones-couvertes, ajouter `aria-expanded="false"` aux 5 boutons et le basculer dans `script.js` (déjà fait pour le nav-toggle) ; optionnel : réserver la classe `faq-question` aux vrais accordéons.

### P3-12 — Divers cosmétiques

- `casablanca.html`/`rabat.html` : `priceRange` avec tiret cadratin « 890 DH – 3390 DH » vs trait d'union sur index/bouznika — harmoniser (P3).
- `marrakech.html` : seule page ville « enrichie » sans section maillage interne (`section-maillage`) — ajouter le bloc standard (P3).
- Meta descriptions > 160 caractères : `zones-couvertes` (181), `travailler-avec-nous` (174), `politique-confidentialite` (171), `a-propos` (164) — tronquées en SERP (P3).
- `index.html:7` : « Maroc » présent 2× dans le title (« Serrure électronique Maroc | Installation en 2h partout au Maroc ») — reformuler la 2ᵉ partie (P3).
- `index.html:502` : coquille dans un avis client « jr recommande » → « je recommande » (P3 — si l'avis est cité verbatim, laisser tel quel).
- Twitter Cards absentes partout — optionnel, faible ROI au Maroc (P3, ne pas prioriser).
- Blocs commentés en attente dans `rabat.html:268-274` (photo d'installation) et `rabat.html:622-628` (avis local) — placeholders volontaires, à alimenter puis décommenter (info, pas une anomalie).

---

## 2. Scores (0–100)

| Domaine | Score | Justification |
|---|---|---|
| **SEO** | **78** | Fondamentaux excellents (canonicals, sitemap/robots/noindex, 47 JSON-LD valides, Hn propres, maillage dense). Pénalisé par le risque doorway sur 7 pages villes (94 % de similarité au pire) et les og:title désynchronisés. |
| **Technique** | **84** | HTML valide sur 22/23 pages (structure hero cassée sur sale.html), 0 lien/ancre cassé, 0 asset manquant, déploiement GitHub Pages correct (CNAME, .nojekyll, vérif Google). |
| **UX** | **80** | Design cohérent, nav/footer strictement identiques partout, bouton flottant mobile. Points faibles : hero Salé cassé, animations actives sur 5 pages seulement, 3 CTA qui ne s'ouvrent pas en nouvel onglet. |
| **Conversion** | **83** | Système CTA à deux règles bien appliqué à ~95 % (135 liens wa.me bien formés, messages contextualisés par ville et par modèle). Pénalisé par les 2 CTA or à message non-photo (page prix) et les 12 boutons WhatsApp bleus du hub villes. |
| **Accessibilité** | **72** | Bons réflexes (alt partout, aria-labels sur icônes et toggles, landmarks main/nav/footer, un H1/page). Pénalisé par les contrastes (villes-seo 2,19:1, feat-no 1,81:1) et l'accordéon sans aria-expanded. |
| **Maintenabilité** | **62** | Pas de build : catalogue produits dupliqué sur 13 pages, script tracking dupliqué sur 22 pages, CSS avec ~100 lignes mortes, deux générations de templates villes qui divergent — chaque modif transversale coûte 13–23 éditions (le commit « harmonisation WhatsApp » du 11/07 en témoigne). |

---

## 3. Synthèse décisionnelle

### Les 10 priorités absolues (ROI × urgence)

1. **P1-2** Corriger les 2 messages wa.me des CTA or de la page prix (2 lignes — restaure l'entonnoir photo sur une page à priorité 0,9).
2. **P1-1** Réparer la structure hero de `sale.html` (page indexée avec mise en page cassée).
3. **P1-3** Trancher et corriger le « Visiophone ✓ » de l'Infinity (risque de promesse client non tenue).
4. **P2-1** Passer les 12 boutons WhatsApp de `zones-couvertes.html` en vert `btn-whatsapp` (page hub, 12 points de conversion).
5. **P2-3** Ajouter `target="_blank" rel` aux 3 CTA de `travailler-avec-nous.html`.
6. **P1-4** Différencier les pages villes restantes en commençant par Marrakech et Tanger (chantier de fond, à étaler — c'est le principal risque SEO du site).
7. **P2-5** Répliquer le bloc `LocalBusiness` JSON-LD sur les 9 pages villes qui ne l'ont pas.
8. **P2-6** Remonter le contraste du bloc `villes-seo` (1 ligne CSS ×2).
9. **P2-2 + P2-4** Aligner texte/CTA final de zones-couvertes + `noopener` sur politique-confidentialite.
10. **P3-1 + P3-2** Synchroniser FAQ JSON-LD ↔ visible et og:title ↔ title (préserve les rich results).

### Optimisations au meilleur ROI (rapides, gain net)

- P1-2, P2-3, P2-4, P2-6, P3-6 : **< 15 lignes modifiées au total**, gains conversion/a11y immédiats.
- P2-1 : simple substitution de classe ×12.
- P2-5 : gabarit JSON-LD copiable en 9 exemplaires.

### Optimisations à faible ROI (à NE PAS faire maintenant)

- **Twitter Cards** : trafic X marginal pour la cible Maroc ; les og: suffisent.
- **Factorisation en générateur de site statique** : pertinent seulement si le rythme de modifs transversales reste élevé ; migration risquée vs bénéfice court terme.
- **Réécriture des deux variantes de SVG WhatsApp en une seule** : zéro impact utilisateur.
- **Compression supplémentaire des images** : déjà en WebP, 7–32 Ko — rien à gagner.
- **Ajout d'`aggregateRating`** : exclu (choix assumé, conformité guidelines).
- **P3-4 (animations)** : décision esthétique, aucun impact SEO/conversion mesurable.

---

## 4. Tableau récapitulatif

| Priorité | Fichier | Problème | Impact | Effort |
|---|---|---|---|---|
| P1 | sale.html:125-142 | Hero : divs mal imbriqués + `</div>` orphelin | UX/HTML invalide | 10 min |
| P1 | prix-…-maroc.html:118,247 | CTA or « photo » avec message wa.me sans photo | Conversion | 5 min |
| P1 | meilleure-…-maroc.html:392 | Infinity « Visiophone ✓ » contredit la fiche produit | Business/confiance | 5 min + décision |
| P1 | 7 pages villes (agadir…temara) | Similarité 86–94 % — risque doorway | SEO local | 2–4 h / ville |
| P2 | zones-couvertes.html:440-572 | 12 CTA WhatsApp en bleu `btn-outline-accent` | Conversion/cohérence | 15 min |
| P2 | zones-couvertes.html:617 | Texte « envoyez une photo » sur CTA générique | Conversion | 5 min |
| P2 | travailler-avec-nous.html:349,377,422 | CTA wa.me sans `target="_blank"`/`rel` | UX | 5 min |
| P2 | politique-confidentialite.html:61-62 | `target="_blank"` sans `noopener` | Sécurité/bonne pratique | 2 min |
| P2 | 9 pages villes | `LocalBusiness` JSON-LD manquant | SEO local | 45 min |
| P2 | style.css:666-675 | Contraste villes-seo 2,19:1 | A11y/SEO | 5 min |
| P3 | faq/bouznika/index | FAQ JSON-LD ≠ texte visible (4 blocs) | SEO rich results | 15 min |
| P3 | pages villes | og:title désynchronisés des titles | Partages sociaux | 20 min |
| P3 | style.css:1097-1115,1706-1760 | ~100 lignes CSS mortes (footer ×2, maillage ×3) | Maintenabilité | 15 min |
| P3 | 18 pages | Classe `js` absente → animations inertes | UX cohérence | 20 min |
| P3 | meilleure-…-maroc.html:334 | SmartLock WiFi ✓ non corroboré (à confirmer) | Business | décision |
| P3 | mentions-legales/politique | wa.me sans message pré-rempli | Conversion mineure | 5 min |
| P3 | 4 pages | Favicons absents/incomplets | Cosmétique | 10 min |
| P3 | cgv/mentions/politique | Tracking incohérent (1 page légale sur 3) | Analytics/RGPD | 10 min |
| P3 | sitemap.xml | `lastmod` non rafraîchis | SEO mineur | 5 min |
| P3 | a-propos.html | « centaines » vs « 100+ » | Crédibilité | 5 min |
| P3 | zones-couvertes.html:583-608 | Accordéon sans `aria-expanded` | A11y | 15 min |
| P3 | divers | priceRange –/-, Marrakech sans maillage, descriptions >160c, title index répétitif, coquille avis | Cosmétique | 30 min |

---

*Rapport produit en lecture seule. Aucun fichier du site n'a été modifié ; les correctifs ci-dessus sont prêts à appliquer après GO, selon le protocole habituel (édits Python multi-fichiers, écriture BOM-safe, vérif grep, commits mono-sujet).*
