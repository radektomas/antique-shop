-- ============================================================
-- Antique Shop — Seed Data
-- Paste into Supabase SQL Editor after running schema.sql
-- ============================================================

INSERT INTO products (name, description, price, category, images, sold, created_at)
VALUES
  (
    'Biedermeierský psací stůl',
    'Elegantní psací stůl z třešňového dřeva, Biedermeier, cca 1830–1850. Tři šuplíky s mosazným kováním, přirozená patina povrchu. Plně funkční, dvířka dobře dosedají. Rozměry: 120 × 65 × 78 cm.',
    12500,
    'nábytek',
    ARRAY['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    false,
    NOW() - INTERVAL '6 days'
  ),
  (
    'Porcelánová váza s kobaltovým dekorem',
    'Ručně malovaná porcelánová váza s tradičním kobaltovým dekorem podglazurní modří, přelom 19. a 20. stol. Výška 32 cm. Bez prasklin ani restaurátorských zásahů, značena na spodku.',
    3200,
    'keramika',
    ARRAY['https://picsum.photos/800/600?random=3', 'https://picsum.photos/800/600?random=4'],
    false,
    NOW() - INTERVAL '5 days'
  ),
  (
    'Zátiší s loveckou tematikou',
    'Olejomalba na plátně — zátiší s pernatou zvěří a loveckými atributy (flinta, lovecká brašna). Signováno v pravém dolním rohu, datováno 1887. Rozměr plátna: 60 × 80 cm. Původní zlatý rám v dobrém stavu.',
    8900,
    'obrazy',
    ARRAY['https://picsum.photos/800/600?random=5', 'https://picsum.photos/800/600?random=6'],
    false,
    NOW() - INTERVAL '4 days'
  ),
  (
    'Kyvadlové hodiny Junghans',
    'Stolní kyvadlové hodiny ve skříňce z ořechového dřeva, výrobce Junghans, Německo, cca 1920. Hodinový strojek v chodu — bijí celé a půlhodiny. Výška skříňky 38 cm. Klíček přiložen.',
    5500,
    'hodiny',
    ARRAY['https://picsum.photos/800/600?random=7', 'https://picsum.photos/800/600?random=8'],
    false,
    NOW() - INTERVAL '3 days'
  ),
  (
    'Rohová vitrína z mahagonu',
    'Rohová vitrína z tmavého mahagonu s prosklenými dvířky, secese, cca 1905. Vnitřek s původními dřevěnými policemi. Výška 185 cm, šíře 60 cm. Sklo originální, bez popraskání.',
    6800,
    'nábytek',
    ARRAY['https://picsum.photos/800/600?random=9', 'https://picsum.photos/800/600?random=10'],
    true,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Keramická mísa Ditmar Urbach',
    'Dekorativní mísa z dílny Ditmar Urbach, Československo, 30. léta 20. stol. Geometrický vzor v oranžové a černé glazuře — typický art deco motiv. Průměr 28 cm, výška 8 cm. Bez trhlin.',
    1800,
    'keramika',
    ARRAY['https://picsum.photos/800/600?random=11', 'https://picsum.photos/800/600?random=12'],
    false,
    NOW() - INTERVAL '1 day'
  );
