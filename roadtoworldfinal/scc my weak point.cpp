#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009

int n,m; 
vi adjList[maxn];
vii adj[maxn];
vi fadj[maxn]; 
int a[maxn]; 
bool used[maxn];
bool visited[maxn]; 
int num[maxn],low[maxn],timeDfs;

bool bad = false; 
void tarjan (int u, int par = -1) 
{
    num[u] = low[u] = ++timeDfs; 
    for (auto [v,id] : adj[u]) 
    {
        if (id == par) continue; 
        if (num[v] == 0) 
        {
            tarjan(v,id);
            fadj[u].pb(v); 
            chkmin(low[u],low[v]); 
            if (low[v] > num[u]) bad = true; 
        }
        else if (num[v] < num[u])
        {
            fadj[u].pb(v); 
            chkmin(low[u],num[v]); 
        }
    }
}

pii edge[maxn]; 
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> m; 
    for (int i = 1; i <= m; i ++) 
    {
        int u,v; cin >> u >> v; 
        edge[i] = {u,v}; 
    }

    for (int i = 1; i <= n; i ++) cin >> a[i]; 

    for (int i = 1; i <= m; i ++) 
    {
        auto [u,v] = edge[i]; 
        if (a[u] < a[v]) fadj[v].pb(u); else if (a[u] > a[v]) fadj[u].pb(v); 
        else if (a[u] == a[v]) 
        {
            adj[u].pb({v,i}); 
            adj[v].pb({u,i}); 
        }
    }
    for (int i = 1; i <= n; i ++) if (!num[i]) tarjan(i); 

    if (bad) 
    {
        cout << -1; re 
    }
    for (int u = 1; u <= n; u ++) 
    {
        for (int i = 1; i <= n; i ++) visited[i] = false; 
        queue <int> q; q.push(u); visited[u] = true; int cnt = 1; 
        while (!q.empty()) 
        {
            int u = q.front(); q.pop(); 
            for (auto v : fadj[u]) 
            {
                if (visited[v] == false) visited[v] = true, cnt ++, q.push(v); 
            }
        }
        if (cnt != a[u]) 
        {
            cout << -1; re 
        }
    }
    for (int i = 1; i <= n; i ++) 
    {
        int u = i; 
        for (auto v : fadj[u]) cout << u << " " << v << "\n"; 
    }
    return 0;
}
