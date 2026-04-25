/**
 * Cloudflare Worker — ecosystem
 * 
 * Serwuje statyczne pliki (HTML/CSS/JS) z Assets
 * ORAZ obsługuje endpoint /api/words dla Wisielca (D1 database)
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};

// ── Inicjalizacja tabeli i seed danych ─────────────────────
async function ensureTable(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS words (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            word     TEXT    NOT NULL COLLATE NOCASE,
            hint     TEXT    DEFAULT '',
            def      TEXT    DEFAULT '',
            category TEXT    DEFAULT 'ogólne',
            created  INTEGER DEFAULT (unixepoch())
        );
    `);

    const { results } = await db.prepare('SELECT COUNT(*) as n FROM words').all();
    if (results[0].n > 0) return; // już są słowa

    // Seed — 30 słów startowych
    await db.exec(`
        INSERT INTO words (word, hint, def, category) VALUES
        ('algorytm',     'Informatyka',      'Zbiór kroków do rozwiązania problemu',                    'it'),
        ('fotosynteza',  'Biologia',         'Proces wytwarzania glukozy przez rośliny ze światła',     'biologia'),
        ('ewolucja',     'Biologia',         'Zmiana cech organizmów przez kolejne pokolenia',          'biologia'),
        ('kryptografia', 'Bezpieczeństwo',   'Nauka o szyfrowaniu i ochronie informacji',               'it'),
        ('meteorologia', 'Nauka o pogodzie', 'Dział fizyki atmosfery badający zjawiska pogodowe',       'nauka'),
        ('architektura', 'Sztuka',           'Sztuka i nauka projektowania i wznoszenia budowli',       'kultura'),
        ('antropologia', 'Nauka',            'Nauka badająca człowieka, jego kulturę i ewolucję',       'nauka'),
        ('magnetyzm',    'Fizyka',           'Właściwość przyciągania materiałów ferromagnetycznych',   'nauka'),
        ('demokracja',   'Polityka',         'System rządów oparty na woli większości obywateli',       'historia'),
        ('astronomia',   'Nauka',            'Nauka badająca ciała niebieskie i Wszechświat',           'nauka'),
        ('chromosom',    'Biologia',         'Struktura w jądrze komórkowym niosąca geny',              'biologia'),
        ('javascript',   'IT',               'Popularny język skryptowy używany w przeglądarkach',      'it'),
        ('klimatologia', 'Nauka o klimacie', 'Nauka badająca długoterminowe wzorce pogodowe',           'nauka'),
        ('renesans',     'Historia sztuki',  'Europejski ruch kulturalny XIV–XVII wieku',               'historia'),
        ('izotop',       'Chemia',           'Atom tego samego pierwiastka z różną liczbą neutronów',  'nauka'),
        ('katalizator',  'Chemia',           'Substancja przyspieszająca reakcję bez zużywania się',    'nauka'),
        ('parlament',    'Polityka',         'Ciało ustawodawcze wybierane przez obywateli',            'historia'),
        ('symbioza',     'Biologia',         'Wzajemnie korzystna relacja między organizmami',          'biologia'),
        ('grawitacja',   'Fizyka',           'Siła przyciągania między masami',                        'nauka'),
        ('logarytm',     'Matematyka',       'Odwrotność potęgowania',                                  'nauka'),
        ('paradoks',     'Filozofia',        'Twierdzenie prowadzące do sprzecznego wniosku',           'kultura'),
        ('propaganda',   'Historia',         'Celowe kształtowanie opinii publicznej',                  'historia'),
        ('urbanizacja',  'Geografia',        'Proces wzrostu liczby ludności w miastach',              'nauka'),
        ('hologram',     'Fizyka',           'Trójwymiarowy obraz stworzony za pomocą lasera',          'nauka'),
        ('polimer',      'Chemia',           'Makrocząsteczka złożona z powtarzających się jednostek',  'nauka'),
        ('fotografia',   'Sztuka',           'Technika utrwalania obrazów za pomocą światła',           'kultura'),
        ('demokracja',   'Ustrój',           'System oparty na suwerenności narodu',                    'historia'),
        ('ekosystem',    'Biologia',         'Zespół organizmów żywych i ich środowisko',               'biologia'),
        ('inflacja',     'Ekonomia',         'Wzrost ogólnego poziomu cen w gospodarce',               'ekonomia'),
        ('migracja',     'Socjologia',       'Przemieszczanie się ludności między regionami',           'historia');
    `);
}

// ── Handler API /api/words ─────────────────────────────────
async function handleApi(request, env) {
    const url    = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS preflight
    if (method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                ...CORS_HEADERS,
                'Access-Control-Allow-Methods': 'GET,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Key',
            },
        });
    }

    if (!env.DB) {
        return new Response(JSON.stringify({
            error: 'Baza D1 nie jest podpięta. Dodaj binding "DB" w zakładce Bindings workera.'
        }), { status: 500, headers: CORS_HEADERS });
    }

    try {
        await ensureTable(env.DB);
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Błąd bazy: ' + e.message }), { status: 500, headers: CORS_HEADERS });
    }

    // ── GET ──────────────────────────────────────────────────
    if (method === 'GET') {
        const action = url.searchParams.get('action') || 'random';
        const cat    = url.searchParams.get('cat')    || '';

        if (action === 'random') {
            const query  = cat
                ? 'SELECT word,hint,def,category FROM words WHERE category=? ORDER BY RANDOM() LIMIT 1'
                : 'SELECT word,hint,def,category FROM words ORDER BY RANDOM() LIMIT 1';
            const params = cat ? [cat] : [];
            const { results } = await env.DB.prepare(query).bind(...params).all();
            if (!results.length)
                return new Response(JSON.stringify({ error: 'Brak słów w bazie' }), { status: 404, headers: CORS_HEADERS });
            return new Response(JSON.stringify(results[0]), { headers: CORS_HEADERS });
        }

        if (action === 'list') {
            const query  = cat
                ? 'SELECT id,word,hint,category FROM words WHERE category=? ORDER BY id DESC LIMIT 200'
                : 'SELECT id,word,hint,category FROM words ORDER BY id DESC LIMIT 200';
            const params = cat ? [cat] : [];
            const { results } = await env.DB.prepare(query).bind(...params).all();
            return new Response(JSON.stringify({ words: results, count: results.length }), { headers: CORS_HEADERS });
        }

        if (action === 'categories') {
            const { results } = await env.DB.prepare('SELECT DISTINCT category FROM words ORDER BY category').all();
            return new Response(JSON.stringify({ categories: results.map(r => r.category) }), { headers: CORS_HEADERS });
        }

        return new Response(JSON.stringify({ error: 'Nieznana akcja. Użyj: random, list, categories' }), { status: 400, headers: CORS_HEADERS });
    }

    // ── POST — dodaj słowo ───────────────────────────────────
    if (method === 'POST') {
        const key = request.headers.get('X-Admin-Key');
        if (env.ADMIN_KEY && key !== env.ADMIN_KEY)
            return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401, headers: CORS_HEADERS });

        let body;
        try   { body = await request.json(); }
        catch { return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: CORS_HEADERS }); }

        const { word, hint = '', def = '', category = 'ogólne' } = body;
        if (!word || word.length < 2 || word.length > 30)
            return new Response(JSON.stringify({ error: 'Słowo musi mieć 2–30 znaków' }), { status: 400, headers: CORS_HEADERS });

        await env.DB.prepare('INSERT INTO words (word,hint,def,category) VALUES (?,?,?,?)')
            .bind(word.toLowerCase().trim(), hint, def, category).run();

        return new Response(JSON.stringify({ ok: true, word }), { headers: CORS_HEADERS });
    }

    // ── DELETE — usuń słowo ──────────────────────────────────
    if (method === 'DELETE') {
        const key = request.headers.get('X-Admin-Key');
        if (env.ADMIN_KEY && key !== env.ADMIN_KEY)
            return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), { status: 401, headers: CORS_HEADERS });

        const id = url.searchParams.get('id');
        if (!id) return new Response(JSON.stringify({ error: 'Brak ?id=' }), { status: 400, headers: CORS_HEADERS });

        await env.DB.prepare('DELETE FROM words WHERE id=?').bind(Number(id)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: CORS_HEADERS });
    }

    return new Response(JSON.stringify({ error: 'Metoda nieobsługiwana' }), { status: 405, headers: CORS_HEADERS });
}

// ── GŁÓWNY HANDLER ─────────────────────────────────────────
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Wszystkie requesty do /api/* obsługuje nasz kod
        if (url.pathname.startsWith('/api/')) {
            return handleApi(request, env);
        }

        // Reszta idzie do statycznych assetów (HTML/CSS/JS)
        return env.ASSETS.fetch(request);
    },
};
