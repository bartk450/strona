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

// Tabela 'words' utworzona ręcznie przez D1 Console

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

        if (action === 'quiz') {
            const count = parseInt(url.searchParams.get('count') || '10');
            const cat = url.searchParams.get('cat') || '';
            const q = cat
                ? 'SELECT question, answer, wrong1, wrong2, wrong3, category FROM quiz_questions WHERE category=? ORDER BY RANDOM() LIMIT ?'
                : 'SELECT question, answer, wrong1, wrong2, wrong3, category FROM quiz_questions ORDER BY RANDOM() LIMIT ?';
            const params = cat ? [cat, count] : [count];
            try {
                const { results } = await env.DB.prepare(q).bind(...params).all();
                return new Response(JSON.stringify({ questions: results, count: results.length }), { headers: CORS_HEADERS });
            } catch(e) {
                return new Response(JSON.stringify({ questions: [], count: 0, error: e.message }), { headers: CORS_HEADERS });
            }
        }


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
