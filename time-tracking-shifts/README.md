# Time Tracking & Shifts

Backend asincrono in **Python + FastAPI + PostgreSQL 18** per la timbratura
entrata/uscita con geolocalizzazione facoltativa e la gestione dei turni di
piccole/medie imprese (fino a ~30 dipendenti).

## Caratteristiche principali

- **FastAPI** con SQLAlchemy 2.x async + asyncpg.
- Autenticazione *passkey-based* (SHA-256) a due livelli: passkey del servizio
  per operazioni amministrative, passkey utente per le timbrature.
- Gestione di **vincoli hard/soft**, preferenze pesate e requisiti di staffing.
- **3 algoritmi** di generazione turni intercambiabili per servizio: `greedy`,
  `ilp` (PuLP + CBC), `genetic` (DEAP opzionale, fallback custom).
- Le timbrature vengono correlate al turno pianificato più vicino e restituite
  con i flag `late` / `early`.

## Requisiti

- Python 3.12+ (raccomandato 3.13)
- PostgreSQL 18 (o 16/17 compatibile)
- pip / venv

## Setup

```bash
# 1. Virtualenv + dipendenze
python -m venv .venv
source .venv/bin/activate        # su Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Configurazione
cp .env.example .env
# modifica DATABASE_URL, CORS_ORIGINS, ecc.

# 3. Inizializzazione DB (scegli UNO dei due metodi)
# 3a. via SQL diretto
psql "$DATABASE_URL_SYNC" -f sql/init.sql
# 3b. via Alembic
alembic upgrade head
```

> L'URL usato da FastAPI è `postgresql+asyncpg://...`; per `psql` usa invece
> `postgresql://...` (senza `+asyncpg`).

## Avvio

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- OpenAPI / Swagger UI : http://localhost:8000/docs
- ReDoc                : http://localhost:8000/redoc
- Health               : http://localhost:8000/health

## Creazione di un servizio

```bash
python create_service.py "Linc Caffè Zero" --algorithm greedy
```

Lo script stampa a video l'ID e la **passkey in chiaro**: salvarla subito —
in database viene conservato solo l'hash SHA-256.

## Autenticazione

Ogni endpoint protetto accetta la passkey in uno di due modi:

- header `X-Passkey: <passkey>` (consigliato)
- query string `?passkey=<passkey>`

## Endpoint principali

### Timbratura (passkey utente)
| Verbo | Path                              | Note                                      |
|-------|-----------------------------------|-------------------------------------------|
| GET   | `/entries/checkin`                | params: `user_id, lat?, lon?`             |
| GET   | `/entries/checkout`               | params: `user_id, lat?, lon?`             |

`lat`/`lon` sono obbligatori solo se `allowed_geoloc = true` per l'utente.

### Utenti (passkey servizio)
| Verbo  | Path                                                  |
|--------|-------------------------------------------------------|
| POST   | `/services/{service_id}/users`                        |
| GET    | `/services/{service_id}/users`                        |
| DELETE | `/services/{service_id}/users/{user_id}`              |
| PATCH  | `/users/{user_id}`                                    |
| PATCH  | `/users/{user_id}/passkey`                            |
| POST   | `/users/{user_id}/activate`                           |
| POST   | `/users/{user_id}/deactivate`                         |

### Servizi (passkey servizio)
| Verbo  | Path                               |
|--------|------------------------------------|
| DELETE | `/services/{service_id}`           |
| PATCH  | `/services/{service_id}/passkey`   |

### Entrate/Uscite
| Verbo  | Path                                   | Protezione                   |
|--------|----------------------------------------|------------------------------|
| DELETE | `/entries/{entry_id}`                  | service                      |
| GET    | `/entries/user/{user_id}`              | user o service               |
| GET    | `/entries/users?user_id=1&user_id=2&…` | service (`service_id` query) |
| GET    | `/services/{service_id}/entries`       | service                      |

Tutti i GET accettano:
- `day=YYYY-MM-DD` oppure
- `start=...&end=...` (ISO-8601)

Se nessuno dei due è fornito, il default è il giorno corrente.

Ogni record di risposta contiene i flag `late`, `early`, `related_shift_id` e
`delta_minutes`.

### Turni
| Verbo  | Path                                            |
|--------|-------------------------------------------------|
| POST   | `/shifts?service_id=…`                          |
| PUT    | `/shifts/{shift_id}?service_id=…`               |
| DELETE | `/shifts/{shift_id}?service_id=…`               |
| GET    | `/services/{service_id}/shifts`                 |
| GET    | `/users/{user_id}/shifts`                       |
| POST   | `/services/{service_id}/shifts/generate`        |

La generazione automatica accetta:

```json
{
  "start": "2026-04-27T00:00:00",
  "end":   "2026-05-04T00:00:00",
  "commit": false,
  "algorithm": "greedy"
}
```

Con `commit=false` restituisce una preview senza salvare i turni generati.
Se `algorithm` è omesso, viene usato quello configurato sul servizio
(`shifts_algorithm`), con fallback a `greedy`.

### Vincoli / preferenze / template / requisiti (CRUD)
| Path prefix                                         |
|-----------------------------------------------------|
| `/users/{user_id}/constraints`                      |
| `/users/{user_id}/preferences`                      |
| `/services/{service_id}/shift-templates`            |
| `/services/{service_id}/shift-requirements`         |

## Algoritmi di generazione turni

- **`greedy`** — scorre gli slot in ordine cronologico e assegna il candidato
  con preferenza più alta che rispetta tutti i vincoli HARD. Veloce, ottimo
  per <10 dipendenti.
- **`ilp`** — Integer Linear Programming con PuLP + CBC. Massimizza la somma
  pesata dei match di preferenze e penalizza fortemente gli slot scoperti.
  Ideale per 10-20 dipendenti con vincoli complessi. Timeout 30 s.
- **`genetic`** — algoritmo genetico (implementazione custom; usa DEAP se
  disponibile per registrare statistiche). Utile per schedulazioni settimanali
  con molte preferenze.

Ogni algoritmo restituisce `{ shifts, unassigned_requirements, score }` e
rispetta i vincoli HARD (`max_hours_per_day`, `max_hours_per_week`,
`min_rest_hours`, `unavailable_*`). I vincoli SOFT e le preferenze pesate
entrano nel punteggio.

## Struttura del progetto

```
time-tracking-shifts/
├── alembic/                # migrazioni
├── app/
│   ├── algorithms/         # greedy / ilp / genetic
│   ├── routers/            # endpoint FastAPI
│   ├── config.py           # settings via pydantic-settings
│   ├── database.py         # async engine + session
│   ├── dependencies.py     # dependency injection (auth passkey)
│   ├── exceptions.py       # handler centralizzati
│   ├── main.py             # entry point FastAPI
│   ├── models.py           # SQLAlchemy 2.x mapped_column
│   ├── schemas.py          # Pydantic v2
│   ├── security.py         # hashing + generatore password/passkey
│   └── utils.py            # helper + rate limiter in-memory
├── sql/init.sql            # DDL alternativa ad Alembic
├── create_service.py       # CLI per creare un servizio
├── requirements.txt
├── changes.txt             # note di design
└── README.md
```

## Normativa italiana

Il flag `allowed_geoloc` memorizza il consenso esplicito al tracciamento della
posizione. Quando è `false`, il backend rifiuta qualsiasi coordinata anche se
inviata e `entries.geoloc` resta `NULL`.

## Note di sicurezza

- Passkey e password utente sono conservate solo come SHA-256 (come richiesto
  dalla specifica). In produzione valuta un hash rinforzato (bcrypt/argon2)
  e aggiungi TLS obbligatorio al reverse proxy.
- Il rate limiter è in-memory e funziona in single-process; dietro a più worker
  passa a Redis/NGINX.

## Licenza

Uso interno cliente.
