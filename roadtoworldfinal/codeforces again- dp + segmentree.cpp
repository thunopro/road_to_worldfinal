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
#define maxn 300009

int n,m; 
int sum[maxn],b[maxn]; 
pii T[maxn*4]; 

pii merge (pii L, pii R) 
{
    if (L.fi < R.fi) return L; 
    if (L.fi > R.fi) return R;
    int A = L.se; add(A,R.se); 
    return {L.fi,A}; 
}
void build (int id, int l, int r) 
{
    if (l == r) 
    {
        if(l == 0) T[id] = {0,1}; 
        else T[id] = {INF,0}; 
        return; 
    }
    build(left,l,mid); build(right,mid+1,r); 
    T[id] = merge(T[left],T[right]); 
}
void update (int id, int l, int r, int pos, pii w) 
{
    if (l > pos || r < pos) return; 
    if (l == r) { T[id] = merge(T[id],w); return;}
    update(left,l,mid,pos,w); update(right,mid+1,r,pos,w); 
    T[id] = merge(T[left],T[right]); 
}

pii query (int id, int l , int r, int u, int v) 
{
    if (l > v || r < u) return {INF,0}; 
    if (u <= l && r <= v) return T[id]; 
    return merge(query(left,l,mid,u,v),query(right,mid+1,r,u,v)); 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    int test; cin >> test; 
    while (test--) 
    {
        cin >> n >> m; 
        sum [0] = 0; 
        for (int i = 1; i <= n; i ++) { int x; cin >> x; sum[i] = sum[i-1] + x;}
        for (int i = 1; i <= m; i ++) cin >> b[i]; 

        build (1,0,n); 
        for (int j = 1; j <= m; j ++) 
        {
            for (int i = 1; i <= n; i ++) 
            {
                int l = lower_bound(sum,sum+i,sum[i]-b[j]) - sum; 
                if (l == i) continue; 
                auto res = query(1,0,n,l,i-1); 
                if (res.fi == INF) continue; 
                res.fi += m-j; 
                update(1,0,n,i,res); 
            }
        }
        auto res = query(1,0,n,n,n); 
        if (res.fi == INF) cout << -1 << "\n"; 
        else cout << res.fi << " " << res.se << "\n"; 
    }
    return 0;
}
