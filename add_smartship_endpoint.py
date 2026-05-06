#!/usr/bin/env python3
"""Add getActiveSealSubscriptionsByEmail() to WordpressRepository
+ controller method + route."""
import sys

# === 1. WordpressRepository: add public method ===
repo_path = '/home/forge/api.myevea.com/current/app/Repositories/WordpressRepository.php'
with open(repo_path, 'r') as f:
    repo = f.read()

REPO_ANCHOR = """    private function hasActiveSealSubscriptionByEmail(string $customerEmail, array $context = []): bool
    {"""

REPO_NEW = """    /**
     * Ritorna le subscription attive Seal per un'email (con prodotti + edit_url).
     * Usato dall'endpoint /api/wp/me/smartship-products del frontend Shopify.
     */
    public function getActiveSealSubscriptionsByEmail(string $customerEmail): array
    {
        if ($customerEmail === '') return [];
        try {
            $sealToken = trim((string) config('app.seal.api_token', ''));
            $sealSecret = trim((string) config('app.seal.api_secret', ''));
            if ($sealToken === '') return [];
            $headers = ['X-Seal-Token' => $sealToken, 'Content-Type' => 'application/json'];
            if ($sealSecret !== '') $headers['X-Seal-Secret'] = $sealSecret;
            $response = Http::withHeaders($headers)->timeout(20)->get(
                'https://app.sealsubscriptions.com/shopify/merchant/api/subscriptions',
                ['query' => $customerEmail, 'active-only' => 'true']
            );
            if (!$response->successful()) return [];
            $subscriptions = $response->json('payload.subscriptions') ?: $response->json('payload') ?: [];
            if (!is_array($subscriptions)) return [];

            $result = [];
            $emailLower = strtolower(trim($customerEmail));
            foreach ($subscriptions as $sub) {
                if (strtolower(trim((string) ($sub['email'] ?? ''))) !== $emailLower) continue;
                if (strtoupper((string) ($sub['status'] ?? '')) !== 'ACTIVE') continue;
                $items = [];
                foreach (($sub['items'] ?? []) as $it) {
                    $items[] = [
                        'title' => (string) ($it['title'] ?? ''),
                        'quantity' => (int) ($it['quantity'] ?? 1),
                        'selling_plan_id' => (string) ($it['selling_plan_id'] ?? ''),
                        'selling_plan_name' => (string) ($it['selling_plan_name'] ?? ''),
                    ];
                }
                $result[] = [
                    'id' => (int) ($sub['id'] ?? 0),
                    'order_id' => (string) ($sub['order_id'] ?? ''),
                    'order_placed' => (string) ($sub['order_placed'] ?? ''),
                    'delivery_interval' => (string) ($sub['delivery_interval'] ?? ''),
                    'billing_interval' => (string) ($sub['billing_interval'] ?? ''),
                    'total_value' => (float) ($sub['total_value'] ?? 0),
                    'currency' => (string) ($sub['currency'] ?? 'EUR'),
                    'edit_url' => (string) ($sub['edit_url'] ?? ''),
                    'items' => $items,
                ];
            }
            return $result;
        } catch (\\Throwable $e) {
            \\Illuminate\\Support\\Facades\\Log::warning('getActiveSealSubscriptionsByEmail failed: ' . $e->getMessage());
            return [];
        }
    }

    private function hasActiveSealSubscriptionByEmail(string $customerEmail, array $context = []): bool
    {"""

if REPO_ANCHOR not in repo:
    print("ERROR repo anchor not found")
    sys.exit(1)
repo = repo.replace(REPO_ANCHOR, REPO_NEW)
with open(repo_path, 'w') as f:
    f.write(repo)
print("OK WordpressRepository.getActiveSealSubscriptionsByEmail added")

# === 2. OnlineStoreController: add controller method ===
ctrl_path = '/home/forge/api.myevea.com/current/app/Http/Controllers/User/OnlineStoreController.php'
with open(ctrl_path, 'r') as f:
    ctrl = f.read()

CTRL_ANCHOR = """    public function paymentTypes()"""

CTRL_NEW = """    /**
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
    }

    public function paymentTypes()"""

if CTRL_ANCHOR not in ctrl:
    print("ERROR ctrl anchor not found")
    sys.exit(1)
ctrl = ctrl.replace(CTRL_ANCHOR, CTRL_NEW)
with open(ctrl_path, 'w') as f:
    f.write(ctrl)
print("OK OnlineStoreController.mySmartshipProducts added")

# === 3. Add route ===
route_path = '/home/forge/api.myevea.com/current/routes/public.php'
with open(route_path, 'r') as f:
    routes = f.read()

ROUTE_ANCHOR = '$router->get("/document/{userId}/{type}",'
if ROUTE_ANCHOR not in routes:
    print("ERROR route anchor not found")
    sys.exit(1)

# Find a good place: after the auth group "wp" prefix where my-orders etc live
# Look for any existing route under auth that does similar
ROUTE_INSERT_ANCHOR = """    // Health Check / Centro Controllo"""
if ROUTE_INSERT_ANCHOR not in routes:
    print("ERROR insert anchor not found")
    sys.exit(1)

new_route_block = """    // Smartship status (per banner Shopify storefront)
    $router->group(["prefix" => "me", "middleware" => "auth"], function () use ($router) {
        $router->get("/smartship-products", ["uses" => "User\\\\OnlineStoreController@mySmartshipProducts"]);
    });

    // Health Check / Centro Controllo"""

routes = routes.replace(ROUTE_INSERT_ANCHOR, new_route_block)
with open(route_path, 'w') as f:
    f.write(routes)
print("OK route /me/smartship-products added")
