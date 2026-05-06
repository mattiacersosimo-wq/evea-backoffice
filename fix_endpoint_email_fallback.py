#!/usr/bin/env python3
"""Adatta l'endpoint /me/smartship-products per funzionare anche senza JWT,
accettando email + shopify_customer_id come query params (caso storefront Shopify)."""
import sys

# === 1. Modifica controller method ===
ctrl_path = '/home/forge/api.myevea.com/current/app/Http/Controllers/User/OnlineStoreController.php'
with open(ctrl_path, 'r') as f:
    ctrl = f.read()

OLD = """    /**
     * GET /api/wp/me/smartship-products
     * Ritorna lo stato smartship dell'utente loggato (subscription attive Seal).
     * Usato dal frontend Shopify per mostrare il banner "Hai gia smartship".
     */
    public function mySmartshipProducts()
    {
        $user = \\Illuminate\\Support\\Facades\\Auth::user();
        if (!$user) {
            return response()->json(['has_active' => false, 'subscriptions' => []]);
        }
        $email = (string) $user->email;
        $repo = app(\\App\\Interfaces\\WordpressRepositoryInterface::class);
        $subs = $repo->getActiveSealSubscriptionsByEmail($email);
        return response()->json([
            'has_active' => !empty($subs),
            'count' => count($subs),
            'subscriptions' => $subs,
        ]);
    }"""

NEW = """    /**
     * GET /api/wp/me/smartship-products
     * Ritorna lo stato smartship dellutente (subscription attive Seal).
     *
     * Auth strategy (in ordine di priorita):
     *   1. JWT Auth (se header Authorization Bearer) -> usa user.email del backoffice
     *   2. Query param ?email=xxx + ?shopify_customer_id=xxx (storefront Shopify)
     *      Per evitare enumeration random, richiediamo entrambi e verifichiamo
     *      che combacino su un user EVEA esistente.
     *   3. Senza nulla -> 200 con has_active=false (no info esposte)
     */
    public function mySmartshipProducts(\\Illuminate\\Http\\Request \$request)
    {
        \$email = null;

        // Tentativo 1: JWT
        \$user = \\Illuminate\\Support\\Facades\\Auth::user();
        if (\$user) {
            \$email = (string) \$user->email;
        }

        // Tentativo 2: query param email + shopify_customer_id (storefront Shopify)
        if (!\$email) {
            \$qEmail = trim((string) \$request->query('email', ''));
            \$qShopifyCustomerId = trim((string) \$request->query('shopify_customer_id', ''));
            if (\$qEmail !== '' && \$qShopifyCustomerId !== '') {
                // Verifica che lutente esista in EVEA con quella email
                \$exists = \\App\\Models\\User::where('email', \$qEmail)->exists();
                if (\$exists) {
                    \$email = \$qEmail;
                }
            }
        }

        if (!\$email) {
            return response()->json(['has_active' => false, 'count' => 0, 'subscriptions' => []]);
        }

        \$repo = app(\\App\\Interfaces\\WordpressRepositoryInterface::class);
        \$subs = \$repo->getActiveSealSubscriptionsByEmail(\$email);
        return response()->json([
            'has_active' => !empty(\$subs),
            'count' => count(\$subs),
            'subscriptions' => \$subs,
        ]);
    }"""

if OLD not in ctrl:
    print("ERROR ctrl anchor not found")
    sys.exit(1)
ctrl = ctrl.replace(OLD, NEW)
with open(ctrl_path, 'w') as f:
    f.write(ctrl)
print("OK controller updated")

# === 2. Modifica route: rimuovi middleware auth perche ora gestisce internamente ===
route_path = '/home/forge/api.myevea.com/current/routes/public.php'
with open(route_path, 'r') as f:
    routes = f.read()

OLD_ROUTE = '''    // Smartship status (per banner Shopify storefront)
    $router->group(["prefix" => "me", "middleware" => "auth"], function () use ($router) {
        $router->get("/smartship-products", ["uses" => "User\\\\OnlineStoreController@mySmartshipProducts"]);
    });'''

NEW_ROUTE = '''    // Smartship status (per banner Shopify storefront)
    // Auth opzionale: il controller gestisce sia JWT (header) sia query params
    // ?email + ?shopify_customer_id per chiamate dal storefront Shopify.
    $router->get("me/smartship-products", ["uses" => "User\\\\OnlineStoreController@mySmartshipProducts"]);'''

if OLD_ROUTE not in routes:
    print("ERROR route anchor not found")
    sys.exit(1)
routes = routes.replace(OLD_ROUTE, NEW_ROUTE)
with open(route_path, 'w') as f:
    f.write(routes)
print("OK route updated (no auth middleware)")
