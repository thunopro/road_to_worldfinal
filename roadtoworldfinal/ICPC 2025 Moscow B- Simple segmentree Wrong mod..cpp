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

int n; 
vii adjList[maxn]; 

int W[maxn],S[maxn]; 

struct edge{
    int u,v,w; 
}E[maxn]; 
int p[maxn]; 
int tin[maxn],tout[maxn],timeDfs,ver[maxn]; 
int dp[maxn]; 
void dfs (int u) 
{
    tin[u] = ++timeDfs; ver[timeDfs] = u;
    for (auto [v,w] : adjList[u]) 
    {
        if (v == p[u]) continue; 
        S[u] += w; 
        W[v] = w; 
    }
    for (auto [v,w] : adjList[u]) 
    {
        if (v == p[u]) continue; 
        p[v] = u; 
        dp[v] = dp[u]*W[v]%mod*_pow(S[u],mod-2)%mod;
        dfs(v); 
    }
    tout[u] = timeDfs; ;
}

int T[maxn*4], lazy[maxn*4]; 

void build (int id, int l, int r) 
{
    if (l == r) 
    {
        T[id] = dp[ver[l]]; 
        return; 
    }
    build(left,l,mid); build(right,mid+1,r); 
}
void down (int id) 
{
    int &t = lazy[id]; if (t == 1) return; 
    lazy[left] = lazy[left]*t%mod, T[left] = T[left]*t%mod; 
    lazy[right] = lazy[right]*t%mod, T[right] = T[right]*t%mod; 
    t = 1; 
}
void update (int id, int l, int r, int u, int v, int w) 
{
    if (l > v || r < u) return; 
    if (u <= l && r <= v) 
    {
        T[id] = T[id]*w%mod; 
        lazy[id] = lazy[id]*w%mod; 
        return; 
    }
    down(id);
    update(left,l,mid,u,v,w); update(right,mid+1,r,u,v,w); 
}
int get(int id, int l, int r, int pos) 
{
    if (l > pos || r < pos) return 1; 
    if (l == r) return T[id]; 
    down(id); 
    return get(left,l,mid,pos)*get(right,mid+1,r,pos)%mod; 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n; 
    fill(lazy,lazy+n*4+10,1); 
    for (int i = 1; i < n; i ++) 
    {
        int u,v,w; cin >> u >> v >> w; 
        E[i] = {u,v,w}; 
        adjList[u].pb({v,w}), adjList[v].pb({u,w}); 
    }
    dp[1] = 1; 
    dfs(1);
    build(1,1,n);  
    for (int i = 1; i < n; i ++) if (p[E[i].v] == E[i].u) swap(E[i].u,E[i].v); 

    int nq; cin >> nq; 
    while (nq --) 
    {
        int type; cin >> type; 
        if (type == 1) 
        {
            int i,w; cin >> i >> w; 
            int u = E[i].u; 
            int w_old = W[u], s_old = S[p[u]]; 
            W[u] = w, S[p[u]] += (w-w_old); 
            int w_new = W[u], s_new = S[p[u]];

            int mul_u = s_old*w_new%mod*_pow(w_old,mod-2)%mod*_pow(s_new,mod-2)%mod; 
            int mul_pu = s_old*_pow(s_new,mod-2)%mod; 
            update(1,1,n,tin[u],tout[u],mul_u*_pow(mul_pu,mod-2)%mod); 
            update(1,1,n,tin[p[u]]+1,tout[p[u]],mul_pu); 
        }
        else 
        {
            int v; cin >> v; 
            cout << get(1,1,n,tin[v]) << "\n"; 
        }
    }
    return 0;
}
