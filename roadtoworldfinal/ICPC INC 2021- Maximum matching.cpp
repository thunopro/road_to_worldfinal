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
#define maxn 509

int n,m,N; 
int d[maxn][maxn]; 
int a[maxn]; 

vi adjList[maxn]; 

int match[maxn]; 
bool used[maxn]; 
bool try_kuhn (int u) 
{
    if (used[u]) return false; 
    used[u] = true; 
    for (auto v : adjList[u]) 
    {
        if (match[v] == -1 || try_kuhn(match[v])) 
        {
            match[v] = u; 
            return true; 
        }
    }
    return false; 
}

int num[maxn],low[maxn],timeDfs; 

stack<int> stk; 
int group[maxn]; 
int num_group; 
void tarjan (int u) 
{
    num[u] = low[u] = ++timeDfs; 
    stk.push(u); 
    for (auto v : adjList[u]) 
    {
        if (!num[v]) 
        {
            tarjan(v); 
            chkmin(low[u],low[v]); 
        }
        else chkmin(low[u],num[v]); 
    }

    if (num[u] == low[u]) 
    {
        num_group ++; 
        while (true) 
        {
            int v = stk.top(); stk.pop(); 
            group[v] = num_group; 
            num[v] = low[v] = INF; 
            if (u == v) break; 
        }
    }
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> m >> N; 
    for (int i = 1; i <= N; i ++) cin >> a[i]; 

    for (int i = 1; i <= n; i ++) for (int j = 1; j <= n; j ++) d[i][j] = 1; 
    for (int i = 1; i <= n; i ++) d[i][i] = 0; 
    for (int i = 1; i <= m; i ++) 
    {
        int u,v; cin >> u >> v; 
        d[u][v] = 0; 
    }

    for (int k = 1; k <= n; k ++) for (int i = 1; i <= n; i ++) for (int j = 1; j <= n; j ++) chkmin(d[i][j],d[i][k]+d[k][j]); 

    for (int i = 1; i <= N; i ++) for (int j = 1; j <= N; j ++) 
    {
        if (i == j) continue; 
        if (d[a[i]][a[j]] == 0) adjList[i].pb(j); 
    }

    for (int i = 1; i <= N; i ++) num[i] = 0; 
    for (int i = 1; i <= N; i ++) if (!num[i]) tarjan(i); 

    for (int i = 1; i <= N; i ++) adjList[i].clear(); 
    
    for (int i = 1; i <= N; i ++) for (int j = 1; j <= N; j ++)
    {
        if (i == j) continue; 
        if (d[a[i]][a[j]] == 0) 
        {
            int u = group[i], v = group[j]; 
            if (u != v) adjList[u].pb(v); 
        }
    }
    N = num_group; 

    for (int i = 1; i <= N; i ++) match[i] = -1;

    int res = N-1;
    for (int i = 1; i <= N; i ++) 
    {
        memset (used,false,sizeof used); 
        res -= try_kuhn(i); 
    }

    cout << res; 
    return 0;
}
