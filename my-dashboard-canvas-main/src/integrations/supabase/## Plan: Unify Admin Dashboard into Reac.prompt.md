## Plan: Unify Admin Dashboard into React App

Since the vanilla Admin Dashboard (`admin-dashboard.html`) currently manages Menu Items via `localStorage` and embeds the React app inside an iframe, the best way to merge them fully is to move the "Menu Management" into the React app and replace the vanilla dashboard entirely. This will give you a single, modern React dashboard that requires an admin login.

**Steps**
1. **Fix frontend data persistence**
   - Fix a bug in `frontend/menu.html` where `localStorage('menuItems')` is forcefully overwritten with hardcoded seed data on every load, which currently makes admin changes useless.

2. **Replicate Menu Management in React** (*parallel with step 3*)
   - Create `src/pages/MenuPage.tsx` and `src/components/menu/...` to manage Menu items.
   - Implement read/write to `localStorage.getItem('menuItems')` matching the vanilla schema so the frontend updates instantly.

3. **Secure the React App (Auth Guard)** (*parallel with step 2*)
   - Wrap the React app's routing in `App.tsx` to check for `localStorage.getItem('isAdminLoggedIn') === 'true'`.
   - Redirect unauthorized users to `../admin-login.html`.
   - Add a "Logout" button to the `AppSidebar` that clears the auth token and redirects to the frontend.

4. **Update Navigation & Build Integration** (*depends on 2 & 3*)
   - Add the new "Menu Management" page to `AppSidebar.tsx` and `MobileNav.tsx`.
   - Update `frontend/admin-login.html` to redirect directly to the React build (`admin-react-dashboard/index.html`) on successful login.

5. **Clean up old dashboard** (*depends on 4*)
   - Rename or remove the vanilla `frontend/admin-dashboard.html` as it is now fully replaced by the React app.

**Relevant files**
- `frontend/menu.html` — Fix `getMenuItems()` to only seed if empty.
- `frontend/admin-login.html` — Change redirect destination.
- `my-dashboard-canvas-main/src/App.tsx` — Add Auth Guard and new `/menu` route.
- `my-dashboard-canvas-main/src/components/AppSidebar.tsx` — Add Menu tab and Logout button.
- `my-dashboard-canvas-main/src/pages/MenuPage.tsx` (new) — React implementation of the Menu manager.

**Verification**
1. Log in via `admin-login.html` and verify it lands directly in the React dashboard.
2. Verify unauthorized direct access to `admin-react-dashboard/index.html` redirects back to login.
3. Add a new menu item in the React Dashboard and verify it appears on the customer `menu.html` page without being overwritten.
4. Verify Supabase Orders still load properly in the React app.

**Decisions**
- The React App will completely replace `admin-dashboard.html` (no iframes).
- Menu items will be managed via `localStorage` (to sync with the frontend).
- Orders will continue to use Supabase in the React app as requested.
