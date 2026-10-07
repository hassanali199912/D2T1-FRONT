# Frontend quick start

Private Vite SPA for the insurance dashboard. It talks to the Nest API at `http://localhost:3030`.

For architecture and gaps, see [SYSTEM-DESIGN.md](./SYSTEM-DESIGN.md).

## Quick start (about 15 minutes)

1. Install Node.js 20+ and open two terminals: one for the API (`d:\iti-task\back`), one for this frontend (`d:\iti-task\front`).
2. In the API repo, install and start the server so it listens on port `3030`:

   ```bash
   npm install
   npm run dev
   ```

3. In this frontend repo:

   ```bash
   npm install
   copy .env.example .env
   npm run dev
   ```

   `.env` must contain:

   ```env
   VITE_API_BASE_URL=http://localhost:3030/
   ```

4. Open **`http://localhost:5173/login`**.

   Use these seeded accounts (password `password1` for both):

   | Role | Email |
   | --- | --- |
   | Admin | `admin@example.com` |
   | Employee | `employee@example.com` |

CORS allows origin `http://localhost:5173` only. If Vite falls through to `5174`, API calls from the browser will fail. Stop the process on `5173` or open that port explicitly.

## 5-minute demo path

Run this path after both servers are up. It shows the MVP end to end.

1. Log in as **employee** (`employee@example.com` / `password1`).
2. Open **Documents**. Confirm at least one policy shows status `INDEXED`. If the list is empty, upload a PDF or DOCX and wait until indexing finishes (the table refreshes while status is `UPLOADED` or `PROCESSING`).
3. Open **Ask & answers**.
   - Ask something that should hit the corpus, for example `deductible`. You should see passages and citations.
   - Ask nonsense such as `quantum banana orbit`. You should see a refusal (not enough evidence).
4. Open **Claims → New claim**. Choose an indexed policy, fill incident date (not after today), type, amount, and description. Submit and wait on the same page while analyze runs.
5. Log out. Log in as **admin** (`admin@example.com` / `password1`).
6. Open **Approvals**. Open a pending item. Show Accept, Reject (comment required), or Edit and accept (final decision, payout when approving, comment).
7. Open **Dashboard**. The three tables load from the API: policies, claims, and pending approvals.

### What each role can do in the demo

- **Employee**: upload/list policies, ask over indexed text, create and see own claims. Approvals page shows “admin only”.
- **Admin**: same plus the approvals queue and review actions; claims list includes every claim.
