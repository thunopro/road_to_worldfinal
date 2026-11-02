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
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e18+2; 

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
#define maxn 1400009
int n,k,nq; 
int a[maxn]; 

struct query1{
    int l,r,w; 
} query[maxn]; 

struct matrix{
    int a[5][5]; 
    matrix()
    {
        for (int i = 0; i < k; i ++) for (int j = 0; j < k; j ++) a[i][j] = -INF; 
    }
};
vector<matrix> T; int lazy[maxn*4]; 

void put (matrix &A, int w) 
{
    matrix B; 
    for (int i = 0; i < k; i ++) 
    {
        for (int j = 0; j < k; j ++) chkmax(B.a[i][0],A.a[i][j]); // case don't choose
        for (int j = 0; j < k-1; j ++) chkmax(B.a[i][j+1],A.a[i][j]+w); // case choose
    }
    A = B; 
}
void gap (matrix &A, int len)
{
    if (len >= k) 
    {
        for (int i = 0; i < k; i ++) 
        {
            int best = -INF; 
            for (int j = 0; j < k; j ++) chkmax(best,A.a[i][j]); 
            for (int j = 0; j < k; j ++) A.a[i][j] = best; 
        }
    }
    else while (len --) put (A,0); 
}
matrix same(int len, int w) 
{
    matrix A; 
    for (int i = 0; i < k; i ++) for (int j = 0; j < k; j ++) 
    {
        if (i + len == j) { A.a[i][j] = len*w; continue; }
        int rem = len-j; if (rem <= 0) continue; 
        int skip = max(0ll,(rem+i+k-1)/k); 
        A.a[i][j] = (len-skip)*w; 
    }
    return A; 
}

matrix merge(matrix &L, matrix &R) 
{
    matrix res; 
    for (int i = 0; i < k; i ++) for (int j = 0; j < k; j ++) for (int t = 0; t < k; t ++) chkmax(res.a[i][j],L.a[i][t]+R.a[t][j]); 
    return res; 
}
vi xs; 
void apply (int id, int l, int r, int w)
{
    T[id] = same(xs[r]-xs[l-1],w); 
    lazy[id] = w; 
}
void down (int id, int l, int r) 
{
    if (lazy [id] == -1) return; 
    apply(left,l,mid,lazy[id]); apply(right,mid+1,r,lazy[id]); 
    lazy[id] = -1; 
}
void update (int id, int l, int r, int u, int v, int w) 
{
    if (l > v || r < u) return; 
    if (u <= l && r <= v) { apply(id,l,r,w); return;}
    down(id,l,r); 
    update(left,l,mid,u,v,w); update(right,mid+1,r,u,v,w); 
    T[id] = merge(T[left],T[right]); 
}
void build (int id, int l, int r, vector<matrix> &leaf) 
{
    if (l == r) { T[id] = leaf[l]; return;}
    build(left,l,mid,leaf), build(right,mid+1,r,leaf); 
    T[id] = merge(T[left],T[right]); 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n >> k >> nq; 
    for (int i = 1; i <= n; i ++) cin >> a[i]; 
    sort (a+1,a+n+1); 
    xs.pb(a[1]), xs.pb(a[n]+1); 

    for (int i = 1; i <= nq; i ++) 
    {
        int l,r,w; cin >> l >> r >> w; 
        query[i] = {l,r,w}; 
        xs.pb(l), xs.pb(r+1); 
    }

    auto compress = [&] (vi &x)
    {
        sort(x.begin(),x.end()); 
        x.resize(unique(x.begin(),x.end())-x.begin()); 
    };
    auto _lower = [&] (vi &x, int w) { return lower_bound(x.begin(),x.end(),w)-x.begin() + 1;}; 
    compress (xs); 

    int N = (int)xs.size() - 1; 
    int j = 1;
    vector<matrix> leaf; leaf.pb(matrix());  
    for (int t = 1; t <= N; t ++) 
    {
        matrix A; 
        for (int i = 0; i < k; i ++) A.a[i][i] = 0; 
        int pos = xs[t-1]; 
        while (j <= n && a[j] < xs[t]) 
        {
            int w = a[j]; 
            int cnt = 1; 
            while (j + 1 <= n && a[j+1] == w) cnt ++, j ++; 
            gap (A,w-pos); 
            put (A,cnt); 
            j ++; 
            pos = w+1; 
        }

        gap(A,xs[t]-pos); 
        leaf.pb(A); 
    }
    T.resize(N*4+10); 
    memset(lazy,-1,sizeof lazy); 
    build(1,1,N,leaf); 
    
    auto get_answer= [&]
    {
        int answer = 0; 
        for (int i = 0; i < k; i ++) chkmax(answer,T[1].a[0][i]); 
        return answer + 1; 
    }; 
    cout << get_answer() << " "; 
    for (int i = 1; i <= nq; i ++) 
    {
        auto [l,r,w] = query [i]; 
        l = _lower(xs,l), r = _lower(xs,r+1) - 1; 
        update (1,1,N,l,r,w); 
        cout << get_answer() << " "; 
    }
    return 0;
}
