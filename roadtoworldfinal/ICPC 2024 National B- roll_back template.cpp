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
const int mod = 998244353;
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
#define maxn 400009

int n,m,nq; 
int answer, forced; 
int pw[maxn]; 
struct shape{
    int u,v,w; 
}; 
vector<shape> Edge;
vector<shape> T[maxn*4]; 
void add_edge (int u, int v, int w) { Edge.pb({u,v,w});}
void add_edge (int id, int l, int r, int u, int v, shape &edge) 
{
    if (l > v || r < u) return; 
    if (u <= l && r <= v) { T[id].pb(edge); return;}
    add_edge(left,l,mid,u,v,edge); add_edge(right,mid+1,r,u,v,edge); 
}

struct DSU{
    vi p,sz,xr; 
    vii hist; 
    int comp,bad; 
    DSU (int n)
    {
        p.resize(n+1), sz.resize(n+1), xr.resize(n+1); 
        for (int i = 1; i <= n; i ++) p[i] = i, sz[i] = 1, xr[i] = 0;
        comp = n, bad = 0; 
    } 

    pii find (int u) 
    {
        int x = 0; 
        while (u != p[u]) 
        {
            x ^= xr[u]; 
            u = p[u]; 
        }
        return {u,x}; 
    }
    void uni (int u, int v, int w) 
    {
        auto [a,x] = find (u); auto [b,y] = find(v); 
        if (a == b) 
        {
            if ((x^y) != w) 
            {
                bad ++; 
                hist.pb({-1,-1}); 
            }
            return; 
        }
        if (sz[a] < sz[b]) swap(a,b); 
        hist.pb({a,b}); 
        p[b] = a, xr[b] = x^y^w; sz[a] += sz[b]; 
        comp --; 
    }
    void rollback(int snap)
    {
        while ((int)hist.size() > snap)
        {
            auto [a,b] = hist.back(); 
            hist.pop_back(); 
            if (a == -1) { bad --; continue;}
            sz[a] -= sz[b]; 
            p[b] = b; xr[b] = 0; 
            comp ++;
        }
    }
};

void dfs (int id, int l, int r, DSU &dsu) 
{
    int snap = dsu.hist.size(); 
    for (auto [u,v,w] : T[id]) dsu.uni(u,v,w); 
    if (dsu.bad == 0)
    {
        if (l == r) 
        {
            if (forced == -1 || forced == l) { add (answer,pw[dsu.comp-1]);} 
        }
        else 
        {
            dfs(left,l,mid,dsu); 
            dfs(right,mid+1,r,dsu);
        }
    }
    dsu.rollback(snap); 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    pw[0] = 1; 
    for (int i = 1; i < maxn; i ++) pw[i] = pw[i-1]*2%mod; 
    int test; cin >> test; 
    while (test--) 
    {
        cin >> n >> m >> nq;
        Edge.clear(); 
        int N = n+m+2; 
        for (int i = 0; i <= N*4; i ++) T[i].clear(); 
        forced = -1; 
        bool impossible = false; 
        
        auto idx_row = [&] (int x) { return x+1;}; 
        auto idx_col = [&] (int x) { return n+2+x;}; 

        auto force = [&] (int x){
            if (forced != -1 && forced != x) { impossible = true;}
            forced = x; 
        };

        for (int i = 1; i <= nq; i ++) 
        {
            int x1,y1,x2,y2; cin >> x1 >> y1 >> x2 >> y2; 
            if (x1 == x2 && y1 == y2) continue; 
            if (x1 == x2) { force(idx_row(x1)); continue;}
            if (y1 == y2) { force(idx_col(y1)); continue;}
            int sign = ((x1 < x2) == (y1 < y2));
            add_edge(idx_row(x1),idx_row(x2),1); add_edge(idx_col(y1),idx_col(y2),1); 
            add_edge(idx_row(x1),idx_col(y1),sign); add_edge(idx_row(x2),idx_col(y2),sign); 
        }
        
        if (impossible == true) { cout << 0 << "\n"; continue;}
        answer = 0; 
        DSU dsu(N); 
        if (forced == -1)
        {
            for (auto [u,v,w] : Edge) dsu.uni(u,v,w); 
            if (dsu.bad == 0) add(answer,pw[dsu.comp]); 
            dsu.rollback(0); 
        }
        
        for (auto [u,v,w] : Edge) 
        {
            shape edge = {u,v,w}; 
            if (u > v) swap (u,v); 
            add_edge(1,1,N,1,u-1,edge); 
            add_edge(1,1,N,u+1,v-1,edge); 
            add_edge(1,1,N,v+1,N,edge); 
        }
        
        dfs (1,1,N,dsu);

        cout << answer << "\n"; 
    }
    return 0;
}
